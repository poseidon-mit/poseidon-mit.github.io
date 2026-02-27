import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from '@/router';

const PDF_PATH = '/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf';
const PDF_EMBED_SRC = `${PDF_PATH}#view=FitH&zoom=page-width&navpanes=0&toolbar=1`;

const DeckViewer: React.FC = () => {
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
            justifyContent: 'space-between',
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

          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#e6edf7',
              textDecoration: 'none',
              fontSize: 14,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Download size={16} />
            Download PDF
          </a>
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
        <iframe
          title="Poseidon MIT Presentation Deck"
          src={PDF_EMBED_SRC}
          style={{
            width: '100vw',
            maxWidth: '100vw',
            height: 'calc(100dvh - 72px)',
            border: 'none',
            display: 'block',
            overflow: 'hidden',
            background: '#020410',
          }}
        />
      </section>
    </main>
  );
};

export default DeckViewer;
