import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Play, Presentation, Video } from 'lucide-react'
import { Link } from '@/router'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  // Pause modal video when dialog closes
  useEffect(() => {
    if (!videoOpen && modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
  }, [videoOpen])

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
        <span className="text-xl font-bold text-white tracking-tight">
          Poseidon
        </span>
        <Link
          to="/dashboard"
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          Launch App
        </Link>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <p className="text-sm text-white/60 uppercase tracking-wider font-medium">
          AI-Native Personal Finance
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mt-6 whitespace-pre-line">
          {'Your Money,\n'}
          <span className="text-blue-400">Orchestrated by AI</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl text-center mt-6">
          Poseidon unifies protection, growth, execution, and governance into
          one intelligent platform that coordinates your entire financial life.
        </p>

        {/* ── 4 Fixed Buttons ── */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-10">
          {/* 1. Explore Demo */}
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors min-w-[160px]"
          >
            <Play className="w-4 h-4" />
            Explore Demo
          </Link>

          {/* 2. Get Started */}
          <Link
            to="/dashboard"
            className="border border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors min-w-[160px]"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* 3. Presentation */}
          <Link
            to="/deck"
            className="border border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors min-w-[160px]"
          >
            <Presentation className="w-4 h-4" />
            Presentation
          </Link>

          {/* 4. Video */}
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="border border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors cursor-pointer min-w-[160px]"
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        </div>

        <p className="text-xs text-white/50 mt-8">
          MIT Capstone &middot; Bank-Level Security
        </p>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="h-7 w-4 rounded-full border border-current p-1">
            <div className="h-1.5 w-1 mx-auto animate-bounce rounded-full bg-current" />
          </div>
        </div>
      </div>

      {/* ── Video Modal ── */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black p-0 overflow-hidden">
          <DialogTitle className="sr-only">Poseidon Introduction Video</DialogTitle>
          <div style={{ aspectRatio: '16/9' }}>
            <video
              ref={modalVideoRef}
              autoPlay
              controls
              className="h-full w-full"
              poster="/videos/hero-theme-poster-v2.jpg"
            >
              <source src="/videos/hero-theme-desktop-v2.mp4" type="video/mp4" />
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
