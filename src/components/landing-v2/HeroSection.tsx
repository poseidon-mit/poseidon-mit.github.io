import { useState } from 'react'
import { ArrowRight, Play, Presentation, Video } from 'lucide-react'
import { Link } from '@/router'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface HeroSectionProps {
  onGetStarted?: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Background video ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="/videos/hero-theme-poster-v2.jpg"
        >
          {/* Mobile-optimised source first */}
          <source
            src="/videos/hero-theme-mobile-v2.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src="/videos/hero-theme-desktop-v2.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.80) 100%)',
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span className="text-xl font-bold text-white tracking-tight">Poseidon</span>
        </div>
        <Link
          to="/dashboard"
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          Launch App
        </Link>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5">
          <span className="text-sm text-white/80 font-medium">MIT CTO Program · Group 7</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mt-6 whitespace-pre-line">
          {'Your Money,\n'}
          <span className="text-blue-400">Orchestrated by AI</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl text-center mt-6">
          Poseidon unifies protection, growth, execution, and governance into
          one intelligent platform that coordinates your entire financial life.
        </p>

        {/* ── Row 1: Primary actions ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors min-w-[160px]"
          >
            <Play className="w-4 h-4" />
            Explore Demo
          </Link>
          <button
            type="button"
            onClick={onGetStarted}
            className="border border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors min-w-[160px] cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Row 2: Secondary actions (ghost) ── */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link
            to="/deck"
            className="inline-flex items-center gap-2 border border-white/30 bg-white/5 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Presentation className="w-4 h-4" />
            Presentation
          </Link>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="inline-flex items-center gap-2 border border-white/30 bg-white/5 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        </div>

        {/* ── MIT Professional Education ── */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Built as part of
          </p>
          <a
            href="https://online.professionalprogramsmit.com/blended-professional-certificate-chief-technology-officer"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/mit-logo.png"
              alt="MIT Professional Education"
              className="h-12 w-auto opacity-70"
            />
          </a>
        </div>
      </div>

      {/* ── Video Modal ── */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black p-0 overflow-hidden">
          <DialogTitle className="sr-only">Poseidon Introduction Video</DialogTitle>
          <div style={{ aspectRatio: '16/9' }}>
            {videoOpen && (
              <iframe
                src="https://www.youtube.com/embed/ymwtd7X3CYI?autoplay=1"
                title="Poseidon Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                style={{ border: 0 }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
