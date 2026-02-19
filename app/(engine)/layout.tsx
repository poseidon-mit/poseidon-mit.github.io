import { AppShellNav } from "@/components/shell/AppShellNav"

export default function EngineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <AppShellNav />
      <div className="lg:pl-16 pb-16 lg:pb-0">
        {children}
      </div>
    </div>
  )
}
