export function LandingFooter() {
  return (
    <footer className="bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <a
          href="https://online.professionalprogramsmit.com/blended-professional-certificate-chief-technology-officer"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <img
            src="/mit-logo.png"
            alt="MIT Professional Education"
            className="h-10 w-auto opacity-60"
          />
        </a>
        <p className="text-white/30 text-xs">
          MIT CTO Program · Group 7 · &copy; 2026 Poseidon.AI
        </p>
      </div>
    </footer>
  )
}
