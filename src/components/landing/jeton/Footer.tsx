import { LANDING_COPY } from '@/content/landing-copy';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--bg-oled)] px-6 py-16 text-white/70 md:px-8">
      <div className="mx-auto w-full max-w-7xl text-center">
        <p className="text-xs tracking-[0.08em]">
          {LANDING_COPY.footer.meta}
        </p>
      </div>
    </footer>
  );
}
