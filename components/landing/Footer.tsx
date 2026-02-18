import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-text-muted">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            {"MIT Sloan CTO Program \u00B7 Group 7 \u00B7 March 2026"}
          </span>
        </div>
        <div className="flex gap-6 text-xs text-text-muted/60">
          <span className="cursor-pointer transition-colors hover:text-text-muted">
            Privacy Policy
          </span>
          <span className="cursor-pointer transition-colors hover:text-text-muted">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  )
}
