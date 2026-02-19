/**
 * DeckViewer — In-app PDF viewer for the pitch deck.
 * Uses pdfjs-dist directly (no wrapper library) for React 19 compatibility.
 * Renders each page to a <canvas> fitted to the viewport width.
 *
 * Anti-flicker strategy:
 *  - Canvases use opacity-only hiding (no position changes) to avoid layout shifts.
 *  - readyRef (not state) is used in the render-skip check to keep useCallback stable.
 *  - ResizeObserver is debounced and does NOT reset ready — renderPages handles it.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { FileDown } from 'lucide-react';
import { Link } from '../router';

const PDF_URL = '/CTO-Group7-Poseidon.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

export default function DeckViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderingRef = useRef(false);
  const lastWidthRef = useRef(0);
  const readyRef = useRef(false);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Load the PDF document
  useEffect(() => {
    let cancelled = false;
    const loadTask = pdfjs.getDocument(PDF_URL);

    loadTask.promise
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? 'Failed to load PDF');
        setLoading(false);
      });

    return () => {
      cancelled = true;
      loadTask.destroy();
    };
  }, []);

  // Render all pages fit-to-width (guarded against concurrent calls).
  // Uses readyRef (not ready state) so this callback reference stays stable.
  const renderPages = useCallback(async () => {
    if (!pdfDoc || !containerRef.current) return;
    if (renderingRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth === 0) return;
    if (containerWidth === lastWidthRef.current && readyRef.current) return;

    renderingRef.current = true;
    readyRef.current = false;
    lastWidthRef.current = containerWidth;

    const dpr = window.devicePixelRatio || 1;

    try {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const canvas = canvasRefs.current[i - 1];
        if (!canvas) continue;

        const page = await pdfDoc.getPage(i);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: scale * dpr });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${unscaledViewport.height * scale}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      }
      readyRef.current = true;
      setReady(true);
    } finally {
      renderingRef.current = false;
    }
  }, [pdfDoc]);  // NO ready in deps — keeps callback reference stable

  // Render on load + debounced resize
  useEffect(() => {
    if (!pdfDoc) return;

    const timer = setTimeout(renderPages, 30);

    const container = containerRef.current;
    if (!container) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderPages, 200);  // just re-render, no setReady(false)
    });
    ro.observe(container);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, [pdfDoc, renderPages]);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>
      <header className="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-slate-900/80">
        <Link
          to="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <a
          href={PDF_URL}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-sm"
        >
          <FileDown className="h-4 w-4" />
          Download PDF
        </a>
      </header>

      <main id="main-content" role="main" ref={containerRef} className="flex-1 min-h-0 overflow-auto">
        <h1 className="sr-only">Poseidon MIT Presentation Deck</h1>
        {(loading || (!ready && !error)) && (
          <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
            Loading deck…
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <p className="text-slate-400 mb-2">Failed to load the deck.</p>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <a
              href={PDF_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 underline"
            >
              Download PDF instead
            </a>
          </div>
        )}

        {!loading && !error && (
          <div className={`flex flex-col transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            {Array.from({ length: numPages }, (_, i) => (
              <canvas
                key={i}
                ref={(el) => { canvasRefs.current[i] = el; }}
                className="block w-full"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
