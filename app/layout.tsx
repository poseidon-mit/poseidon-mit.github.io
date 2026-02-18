import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poseidon.AI — Safer satisfying money decisions",
  description:
    "Four AI engines working together. Every decision explainable, auditable, and reversible. MIT Sloan CTO Program.",
}

export const viewport: Viewport = {
  themeColor: "#0B1221",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-deepest font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
