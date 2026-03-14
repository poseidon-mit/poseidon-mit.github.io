import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/router';
import { markPerformance, measurePerformance } from '@/lib/performance-marks';

const LazyDeckPdfViewer = lazy(() => import('@/components/deck/DeckPdfViewer'));

function DeckViewerSkeleton() {
  return (
    <section
      aria-label="Presentation loading"
      style={{
        width: '100%',
        maxWidth: 1180,
        margin: '0 auto',
        padding: '8px 8px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(2,4,16,0.94) 100%)',
          padding: 14,
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 100%)',
          }}
        />
        <div
          style={{
            marginTop: 12,
            height: 10,
            width: '24%',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
          }}
        />
      </div>
    </section>
  );
}

const DeckViewer: React.FC = () => {
  const [shouldLoadViewer, setShouldLoadViewer] = useState(false);

  useEffect(() => {
    markPerformance('deck_route_feedback');
    measurePerformance('landing_cta_click_to_feedback', 'landing_cta_click_start', 'deck_route_feedback');

    const rafId = window.requestAnimationFrame(() => {
      setShouldLoadViewer(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

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
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              to="/"
              navigationStrategy="optimistic"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'rgba(230,237,247,0.9)',
                textDecoration: 'none',
                fontSize: 14,
                touchAction: 'manipulation',
              }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <div />
          </div>
        </div>
      </div>

      {shouldLoadViewer ? (
        <Suspense fallback={<DeckViewerSkeleton />}>
          <LazyDeckPdfViewer />
        </Suspense>
      ) : (
        <DeckViewerSkeleton />
      )}
    </main>
  );
};

export default DeckViewer;
