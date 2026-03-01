import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, FileArchive, FileImage, FileText, Presentation } from 'lucide-react';
import { PublicTopBar } from '@/components/landing/PublicTopBar';
import { Link } from '@/router';

type SharedFileKind = 'pdf' | 'pptx' | 'docx' | 'zip' | 'image' | 'other';

interface SharedFileEntry {
  id: string;
  title: string;
  description: string;
  path: string;
  kind: SharedFileKind;
  sizeLabel: string;
}

const SHARED_FILES: SharedFileEntry[] = [
  {
    id: 'deck-pdf',
    title: 'Group7 CTO Poseidon PDF',
    description: 'Browser-friendly share version for review, comments, and quick forwarding.',
    path: '/Group7-CTO-Poseidon.pdf',
    kind: 'pdf',
    sizeLabel: 'PDF · 9.0 MB',
  },
  {
    id: 'deck-pptx',
    title: 'Group7 CTO Poseidon PowerPoint',
    description: 'Editable slide deck for internal handoff and presentation prep.',
    path: '/Group7-CTO-Poseidon.pptx',
    kind: 'pptx',
    sizeLabel: 'PPTX · 12 MB',
  },
  {
    id: 'briefing-docx',
    title: 'Briefing Group7',
    description: 'Working briefing document for teammate context and written reference.',
    path: '/Briefing%20Group7(updated).docx',
    kind: 'docx',
    sizeLabel: 'DOCX · 30 KB',
  },
  {
    id: 'script-docx',
    title: 'Script',
    description: 'Speaker script document for presentation flow and narration alignment.',
    path: '/Script.docx',
    kind: 'docx',
    sizeLabel: 'DOCX · 19 KB',
  },
];

const kindLabel: Record<SharedFileKind, string> = {
  pdf: 'PDF',
  pptx: 'PPTX',
  docx: 'DOCX',
  zip: 'ZIP',
  image: 'IMAGE',
  other: 'FILE',
};

const fileIcon = (kind: SharedFileKind) => {
  switch (kind) {
    case 'pdf':
      return FileText;
    case 'pptx':
      return Presentation;
    case 'docx':
      return FileText;
    case 'zip':
      return FileArchive;
    case 'image':
      return FileImage;
    default:
      return FileText;
  }
};

const ShareFiles: React.FC = () => {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isCancelled = false;

    const checkFiles = async () => {
      const results = await Promise.all(
        SHARED_FILES.map(async (file) => {
          try {
            const response = await fetch(file.path, { method: 'HEAD' });
            return [file.id, response.ok] as const;
          } catch {
            return [file.id, false] as const;
          }
        }),
      );

      if (!isCancelled) {
        setAvailability(Object.fromEntries(results));
      }
    };

    void checkFiles();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05050A] text-white selection:bg-cyan-500 selection:text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.1),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="relative z-10 font-manrope">
        <PublicTopBar />

        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-32 md:px-10">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>

          <section className="grid gap-6 pt-6 md:grid-cols-2">
            {SHARED_FILES.map((file) => {
              const Icon = fileIcon(file.kind);
              const isAvailable = availability[file.id] ?? true;
              const isPdf = file.kind === 'pdf';
              const primaryLabel = isPdf ? 'Open in browser' : `Download ${kindLabel[file.kind]}`;

              return (
                <article
                  key={file.id}
                  className="relative overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(167,139,250,0.08),transparent_24%)]" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="mb-1 text-xs uppercase tracking-[0.22em] text-white/40">{file.sizeLabel}</div>
                          <h2 className="font-inter text-2xl font-medium tracking-[-0.03em] text-white">{file.title}</h2>
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/50">
                        {kindLabel[file.kind]}
                      </div>
                    </div>

                    <p className="mb-8 text-[15px] leading-7 text-white/68">{file.description}</p>

                    <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                      <a
                        href={isAvailable ? file.path : undefined}
                        target={isPdf ? '_blank' : undefined}
                        rel={isPdf ? 'noreferrer' : undefined}
                        download={isPdf ? undefined : true}
                        aria-disabled={!isAvailable}
                        className={[
                          'inline-flex items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-sm font-medium transition-all',
                          isAvailable
                            ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20 hover:bg-cyan-400/20'
                            : 'cursor-not-allowed bg-white/5 text-white/35 ring-1 ring-white/10',
                        ].join(' ')}
                      >
                        {isPdf ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {primaryLabel}
                      </a>

                      {isPdf ? (
                        <a
                          href={isAvailable ? file.path : undefined}
                          download
                          aria-disabled={!isAvailable}
                          className={[
                            'inline-flex items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-sm font-medium transition-all',
                            isAvailable
                              ? 'bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10'
                              : 'cursor-not-allowed bg-white/5 text-white/35 ring-1 ring-white/10',
                          ].join(' ')}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </a>
                      ) : null}
                    </div>

                    {!isAvailable ? (
                      <div className="mt-4 text-sm text-amber-300/85">
                        File unavailable right now. Redeploy or sync the asset into <code className="rounded bg-black/30 px-1.5 py-0.5">public/</code>.
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ShareFiles;
