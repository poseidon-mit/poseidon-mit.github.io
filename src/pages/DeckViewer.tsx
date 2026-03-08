import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/router';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const PDF_PATH = '/Group7-CTO-Poseidon.pdf';
const RESIZE_DEBOUNCE_MS = 180;
const WIDTH_CHANGE_THRESHOLD_PX = 12;
const VISIBLE_BUFFER_PAGES = 1;
const MOBILE_BREAKPOINT = 768;
const QUALITY_BOOST = 1.5;
const PREVIEW_SCALE_MOBILE = 1.6;
const PREVIEW_SCALE_DESKTOP = 1.8;
const MIN_RENDER_SCALE = 1.5;
const MOBILE_MAX_RENDER_SCALE = 2.2;
const DESKTOP_MAX_RENDER_SCALE = 4.0;
const MOBILE_VISIBLE_BUFFER_PAGES = 0;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const requestIdle = (cb: () => void) => {
  const w = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    return w.requestIdleCallback(() => cb(), { timeout: 350 });
  }
  return window.setTimeout(cb, 80);
};

const cancelIdle = (id: number) => {
  const w = window as Window & {
    cancelIdleCallback?: (handle: number) => void;
  };
  if (typeof w.cancelIdleCallback === 'function') {
    w.cancelIdleCallback(id);
    return;
  }
  window.clearTimeout(id);
};

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type RenderQuality = 'preview' | 'high';

const DeckViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const pageContainerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const renderTasksRef = useRef<Map<number, { cancel: () => void }>>(new Map());
  const renderedQualityRef = useRef<Map<number, RenderQuality>>(new Map());
  const renderRunIdRef = useRef(0);
  const visibleSetRef = useRef<Set<number>>(new Set());
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  const isMobile = useMemo(() => containerWidth > 0 && containerWidth <= MOBILE_BREAKPOINT, [containerWidth]);

  const getOutputScale = useCallback(
    (quality: RenderQuality) => {
      const boosted = (window.devicePixelRatio || 1) * QUALITY_BOOST;
      if (quality === 'preview') {
        return isMobile ? PREVIEW_SCALE_MOBILE : PREVIEW_SCALE_DESKTOP;
      }
      return clamp(
        boosted,
        MIN_RENDER_SCALE,
        isMobile ? MOBILE_MAX_RENDER_SCALE : DESKTOP_MAX_RENDER_SCALE,
      );
    },
    [isMobile],
  );

  const cancelAllRenderTasks = useCallback(() => {
    for (const task of renderTasksRef.current.values()) {
      task.cancel();
    }
    renderTasksRef.current.clear();
  }, []);

  const cancelRenderTask = useCallback((pageIndex: number) => {
    const task = renderTasksRef.current.get(pageIndex);
    if (!task) return;
    task.cancel();
    renderTasksRef.current.delete(pageIndex);
  }, []);

  const releasePageCanvas = useCallback((pageIndex: number) => {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    cancelRenderTask(pageIndex);
    renderedQualityRef.current.delete(pageIndex);
    // Shrink backing store aggressively on mobile to avoid Safari tab reloads.
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#020410';
      ctx.fillRect(0, 0, 1, 1);
    }
  }, [cancelRenderTask]);

  const renderPage = useCallback(
    async (pageIndex: number, quality: RenderQuality, runId: number) => {
      if (!pdfDoc || runId !== renderRunIdRef.current) return;
      const canvas = canvasRefs.current[pageIndex];
      if (!canvas) return;

      const existingQuality = renderedQualityRef.current.get(pageIndex);
      if (existingQuality === 'high') return;
      if (existingQuality === 'preview' && quality === 'preview') return;

      cancelRenderTask(pageIndex);

      const page = await pdfDoc.getPage(pageIndex + 1);
      if (runId !== renderRunIdRef.current) return;

      const viewport = page.getViewport({ scale: 1 });
      const fitScale = containerWidth / viewport.width;
      const renderViewport = page.getViewport({ scale: fitScale * getOutputScale(quality) });
      const offscreen = document.createElement('canvas');
      const offscreenContext = offscreen.getContext('2d');
      if (!offscreenContext) return;

      offscreen.width = Math.floor(renderViewport.width);
      offscreen.height = Math.floor(renderViewport.height);

      const renderTask = page.render({
        canvas: offscreen,
        canvasContext: offscreenContext,
        viewport: renderViewport,
      });
      renderTasksRef.current.set(pageIndex, { cancel: () => renderTask.cancel() });

      await renderTask.promise;
      if (runId !== renderRunIdRef.current) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.style.width = `${Math.floor(viewport.width * fitScale)}px`;
      canvas.style.height = `${Math.floor(viewport.height * fitScale)}px`;
      if (canvas.width !== offscreen.width || canvas.height !== offscreen.height) {
        canvas.width = offscreen.width;
        canvas.height = offscreen.height;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(offscreen, 0, 0);

      renderedQualityRef.current.set(pageIndex, quality);
      renderTasksRef.current.delete(pageIndex);
    },
    [cancelRenderTask, containerWidth, getOutputScale, pdfDoc],
  );

  useEffect(() => {
    let isCancelled = false;
    const loadingTask = getDocument(PDF_PATH);

    (async () => {
      try {
        const doc = await loadingTask.promise;
        if (isCancelled) return;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
      } catch (error) {
        if (isCancelled) return;
        setRenderError(error instanceof Error ? error.message : 'Failed to load PDF.');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
      cancelAllRenderTasks();
      visibleSetRef.current.clear();
      void loadingTask.destroy();
    };
  }, [cancelAllRenderTasks]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let previousWidth = -1;

    const applyWidth = () => {
      const width = Math.max(320, Math.floor(node.clientWidth));
      if (previousWidth !== -1 && Math.abs(width - previousWidth) < WIDTH_CHANGE_THRESHOLD_PX) {
        return;
      }
      previousWidth = width;
      setContainerWidth(width);
    };

    const scheduleUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyWidth, RESIZE_DEBOUNCE_MS);
    };

    applyWidth();
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(node);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pageCount === 0) return;
    visibleSetRef.current.clear();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idxRaw = (entry.target as HTMLElement).dataset.pageIndex;
          if (!idxRaw) continue;
          const idx = Number(idxRaw);
          if (Number.isNaN(idx)) continue;
          if (entry.isIntersecting) {
            visibleSetRef.current.add(idx);
          } else {
            visibleSetRef.current.delete(idx);
          }
        }
        setVisiblePages(Array.from(visibleSetRef.current).sort((a, b) => a - b));
      },
      {
        root: null,
        rootMargin: isMobile ? '8% 0px' : '35% 0px',
        threshold: isMobile ? 0.25 : 0.1,
      },
    );

    for (let idx = 0; idx < pageCount; idx++) {
      const node = pageContainerRefs.current[idx];
      if (node) observer.observe(node);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMobile, pageCount]);

  useEffect(() => {
    if (!pdfDoc || containerWidth <= 0 || pageCount === 0) return;
    let disposed = false;
    setRenderError(null);
    renderRunIdRef.current += 1;
    const runId = renderRunIdRef.current;

    cancelAllRenderTasks();
    renderedQualityRef.current.clear();

    const highPriorityQueue = [0];
    const previewQueue = isMobile
      ? []
      : Array.from({ length: pageCount }, (_, idx) => idx).filter((idx) => idx !== 0);

    const renderHighPriority = async () => {
      for (const pageIndex of highPriorityQueue) {
        if (disposed || runId !== renderRunIdRef.current) return;
        try {
          await renderPage(pageIndex, 'high', runId);
        } catch (error) {
          if (disposed) return;
          if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'RenderingCancelledException') {
            return;
          }
          setRenderError(error instanceof Error ? error.message : 'Failed to render PDF.');
          return;
        }
      }
    };

    const idleId = requestIdle(async () => {
      for (const pageIndex of previewQueue) {
        if (disposed || runId !== renderRunIdRef.current) return;
        try {
          await renderPage(pageIndex, 'preview', runId);
        } catch (error) {
          if (disposed) return;
          if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'RenderingCancelledException') {
            return;
          }
          setRenderError(error instanceof Error ? error.message : 'Failed to render PDF.');
          return;
        }
      }
    });

    void renderHighPriority();

    return () => {
      disposed = true;
      cancelIdle(idleId);
      cancelAllRenderTasks();
    };
  }, [cancelAllRenderTasks, containerWidth, isMobile, pageCount, pdfDoc, renderPage]);

  useEffect(() => {
    if (!pdfDoc || containerWidth <= 0 || pageCount === 0) return;
    if (visiblePages.length === 0) return;
    const runId = renderRunIdRef.current;
    const focusTargets = new Set<number>([0]);
    const bufferPages = isMobile ? MOBILE_VISIBLE_BUFFER_PAGES : VISIBLE_BUFFER_PAGES;
    for (const visibleIndex of visiblePages) {
      focusTargets.add(visibleIndex);
      for (let offset = 1; offset <= bufferPages; offset++) {
        if (visibleIndex - offset >= 0) focusTargets.add(visibleIndex - offset);
        if (visibleIndex + offset < pageCount) focusTargets.add(visibleIndex + offset);
      }
    }

    if (isMobile) {
      for (let idx = 0; idx < pageCount; idx++) {
        if (!focusTargets.has(idx)) releasePageCanvas(idx);
      }
    }

    void (async () => {
      for (const pageIndex of Array.from(focusTargets).sort((a, b) => a - b)) {
        try {
          await renderPage(pageIndex, 'high', runId);
        } catch {
          return;
        }
      }
    })();
  }, [containerWidth, isMobile, pageCount, pdfDoc, releasePageCanvas, renderPage, visiblePages]);

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 0%, #0f172a 0%, #020410 50%, #000000 100%)',
        color: '#e6edf7',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: 1280,
          padding: '16px 16px 8px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(230,237,247,0.9)',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      <section
        style={{
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          padding: '8px 0 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: '100%',
            maxWidth: 1180,
            margin: '0 auto',
            padding: '0 8px 24px',
            boxSizing: 'border-box',
          }}
        >
          {isLoading ? (
            <p style={{ margin: 0, color: 'rgba(230,237,247,0.7)', fontSize: 14, textAlign: 'center', paddingTop: 16 }}>
              Loading deck...
            </p>
          ) : null}
          {renderError ? (
            <p style={{ margin: 0, color: '#fda4af', fontSize: 14, textAlign: 'center', paddingTop: 16 }}>
              Failed to render in-page viewer. Please reopen /deck or try again later.
            </p>
          ) : null}
          {Array.from({ length: pageCount }).map((_, idx) => (
            <div
              key={`deck-page-${idx + 1}`}
              ref={(node) => {
                pageContainerRefs.current[idx] = node;
              }}
              data-page-index={idx}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <canvas
                ref={(node) => {
                  canvasRefs.current[idx] = node;
                }}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  aspectRatio: '16 / 9',
                  display: 'block',
                  borderRadius: 6,
                  background: '#020410',
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DeckViewer;
