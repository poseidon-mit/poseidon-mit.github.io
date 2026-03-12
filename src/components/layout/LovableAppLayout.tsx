import { useState } from "react";
import { Link, useRouter  } from "@/router";
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  FileText,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { DemoBanner } from "@/components/shared/DemoBanner";

const navItems = [
  { path: "/lovable/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "cyan" as const },
  { path: "/lovable/protect", label: "Protect", icon: Shield, color: "green" as const },
  { path: "/lovable/grow", label: "Grow", icon: TrendingUp, color: "purple" as const },
  { path: "/lovable/execute", label: "Execute", icon: Zap, color: "yellow" as const },
  { path: "/lovable/govern", label: "Govern", icon: FileText, color: "blue" as const },
];

type NavColor = "cyan" | "green" | "purple" | "yellow" | "blue";

const activeBgMap: Record<NavColor, string> = {
  cyan: "bg-cyan-500/15 text-cyan-400 shadow-[inset_0_0_20px_rgba(0,240,255,0.06)]",
  green: "bg-green-500/15 text-green-400 shadow-[inset_0_0_20px_rgba(34,197,94,0.06)]",
  purple: "bg-purple-500/15 text-purple-400 shadow-[inset_0_0_20px_rgba(139,92,246,0.06)]",
  yellow: "bg-amber-500/15 text-amber-400 shadow-[inset_0_0_20px_rgba(234,179,8,0.06)]",
  blue: "bg-blue-500/15 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.06)]",
};

const activeBottomNavMap: Record<NavColor, string> = {
  cyan: "text-cyan-400",
  green: "text-green-400",
  purple: "text-purple-400",
  yellow: "text-amber-400",
  blue: "text-blue-400",
};

const activeGlowMap: Record<NavColor, string> = {
  cyan: "shadow-[0_0_12px_rgba(0,240,255,0.3)]",
  green: "shadow-[0_0_12px_rgba(34,197,94,0.3)]",
  purple: "shadow-[0_0_12px_rgba(139,92,246,0.3)]",
  yellow: "shadow-[0_0_12px_rgba(234,179,8,0.3)]",
  blue: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
};

export function LovableAppLayout({ children }: { children?: React.ReactNode }) {
  const { path, search } = useRouter();
  const searchParams = new URLSearchParams(search);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDemo = searchParams.get("demo") === "true";

  const isActive = (targetPath: string) => path.startsWith(targetPath);

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {isDemo && <DemoBanner />}

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col bg-[#0d1526]/80 backdrop-blur-xl border-r border-white/[0.06] z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">🔱</span>
          <span className="text-lg font-bold text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">Poseidon.AI</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? `${activeBgMap[item.color]} font-semibold`
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="border-t border-white/[0.06] my-3" />

          {/* Chat link */}
          <Link
            to="/lovable/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              isActive("/lovable/chat")
                ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </Link>
        </nav>

        {/* User avatar */}
        <div className="border-t border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold ring-1 ring-cyan-500/30">
              SF
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Shinji Fujiwara</p>
              <p className="text-xs text-white/40 truncate">VP Engineering</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 inset-x-0 bg-[#0d1526]/90 backdrop-blur-xl border-b border-white/[0.06] z-30">
        {isDemo && <DemoBanner />}
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">🔱</span>
            <span className="text-base font-bold text-cyan-400">Poseidon.AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/60"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile sheet overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 w-72 bg-[#0d1526]/95 backdrop-blur-xl z-50 shadow-2xl shadow-black/50 border-r border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">🔱</span>
                <span className="text-lg font-bold text-cyan-400">Poseidon.AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-white/40"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? `${activeBgMap[item.color]} font-semibold`
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-white/[0.06] my-3" />
              <Link
                to="/lovable/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive("/lovable/chat")
                    ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Chat
              </Link>
            </nav>
            <div className="absolute bottom-0 inset-x-0 border-t border-white/[0.06] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold ring-1 ring-cyan-500/30">
                  SF
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">Shinji Fujiwara</p>
                  <p className="text-xs text-white/40 truncate">VP Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main
        className={`min-h-screen md:ml-60 ${
          isDemo ? "pt-14 md:pt-0" : "pt-14 md:pt-0"
        } pb-20 md:pb-0`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-[#0d1526]/90 backdrop-blur-xl border-t border-white/[0.06] z-30"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 transition-all ${
                  active ? `${activeBottomNavMap[item.color]} ${activeGlowMap[item.color]}` : "text-white/30"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
