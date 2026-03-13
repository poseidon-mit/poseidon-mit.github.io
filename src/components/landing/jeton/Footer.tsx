import { LANDING_COPY } from '@/content/landing-copy';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--bg-oled)] px-6 py-16 text-white/70 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs tracking-[0.08em]">
          {LANDING_COPY.footer.meta}
        </p>
      </div>
    </footer>
  );
}
