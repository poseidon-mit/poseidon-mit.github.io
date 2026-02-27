import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/router';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const PDF_PATH = '/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const DeckViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);

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
      void loadingTask.destroy();
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const width = Math.max(320, Math.floor(node.clientWidth));
      setContainerWidth(width);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!pdfDoc || containerWidth <= 0 || pageCount === 0) return;
    let cancelled = false;

    const renderAllPages = async () => {
      for (let i = 0; i < pageCount; i++) {
        if (cancelled) return;
        const canvas = canvasRefs.current[i];
        if (!canvas) continue;

        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const fitScale = containerWidth / viewport.width;
        const outputScale = Math.max(1, window.devicePixelRatio || 1);
        const renderViewport = page.getViewport({ scale: fitScale * outputScale });

        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(viewport.width * fitScale)}px`;
        canvas.style.height = `${Math.floor(viewport.height * fitScale)}px`;

        await page.render({
          canvas,
          canvasContext: context,
          viewport: renderViewport,
        }).promise;
      }
    };

    void renderAllPages().catch((error) => {
      if (!cancelled) {
        setRenderError(error instanceof Error ? error.message : 'Failed to render PDF.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageCount, containerWidth]);

  return (
    <main
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
            maxWidth: 980,
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
              Failed to render in-page viewer. Use Download PDF.
            </p>
          ) : null}
          {Array.from({ length: pageCount }).map((_, idx) => (
            <div
              key={`deck-page-${idx + 1}`}
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
