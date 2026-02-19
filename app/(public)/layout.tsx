import { PublicTopBar } from "@/components/landing/PublicTopBar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <PublicTopBar />
      {children}
    </div>
  )
}
