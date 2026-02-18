/**
 * DeckViewer — In-app PDF viewer for the pitch deck.
 * Uses pdfjs-dist directly (no wrapper library) for React 19 compatibility.
 * Renders each page to a <canvas> fitted to the viewport width.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FileDown } from 'lucide-react';
import { Link } from '../router';

const PDF_URL = '/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf';
const PDFJS_VERSION = '3.11.174';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

export default function DeckViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Render all pages fit-to-width
  const renderPages = useCallback(async () => {
    if (!pdfDoc || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth === 0) return;

    // Use devicePixelRatio for crisp rendering on high-DPI screens
    const dpr = window.devicePixelRatio || 1;

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
      canvas.style.height = `${(unscaledViewport.height * scale)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      await page.render({ canvasContext: ctx, viewport }).promise;
    }
  }, [pdfDoc]);

  // Render on load + resize
  useEffect(() => {
    if (!pdfDoc) return;

    // Small delay to let canvases mount
    const timer = setTimeout(renderPages, 50);

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => renderPages());
    ro.observe(container);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [pdfDoc, renderPages]);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-slate-950">
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

      <main ref={containerRef} className="flex-1 min-h-0 overflow-auto">
        {loading && (
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
          <div className="flex flex-col">
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
