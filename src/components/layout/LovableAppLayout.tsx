import { useState } from "react";
import { Outlet, Link, useLocation, useSearchParams } from "react-router-dom";
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
  { path: "/lovable/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "cyan" },
  { path: "/lovable/protect", label: "Protect", icon: Shield, color: "green" },
  { path: "/lovable/grow", label: "Grow", icon: TrendingUp, color: "purple" },
  { path: "/lovable/execute", label: "Execute", icon: Zap, color: "yellow" },
  { path: "/lovable/govern", label: "Govern", icon: FileText, color: "blue" },
] as const;

type NavColor = (typeof navItems)[number]["color"];

const activeBgMap: Record<NavColor, string> = {
  cyan: "bg-cyan-50 text-cyan-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
  yellow: "bg-yellow-50 text-yellow-700",
  blue: "bg-blue-50 text-blue-700",
};

const activeBottomNavMap: Record<NavColor, string> = {
  cyan: "text-cyan-500",
  green: "text-green-500",
  purple: "text-purple-500",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
};

export function LovableAppLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDemo = searchParams.get("demo") === "true";

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen">
      {isDemo && <DemoBanner />}

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col bg-white border-r border-gray-200 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="text-2xl">🔱</span>
          <span className="text-lg font-bold text-cyan-600">Poseidon.AI</span>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? `${activeBgMap[item.color]} font-semibold`
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="border-t border-gray-200 my-3" />

          {/* Chat link */}
          <Link
            to="/lovable/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive("/lovable/chat")
                ? "bg-cyan-50 text-cyan-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </Link>
        </nav>

        {/* User avatar */}
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-semibold">
              SF
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Shinji Fujiwara</p>
              <p className="text-xs text-gray-500 truncate">VP Engineering</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 inset-x-0 bg-white border-b border-gray-200 z-30">
        {isDemo && <DemoBanner />}
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔱</span>
            <span className="text-base font-bold text-cyan-600">Poseidon.AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600"
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
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔱</span>
                <span className="text-lg font-bold text-cyan-600">Poseidon.AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-500"
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? `${activeBgMap[item.color]} font-semibold`
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 my-3" />
              <Link
                to="/lovable/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive("/lovable/chat")
                    ? "bg-cyan-50 text-cyan-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Chat
              </Link>
            </nav>
            <div className="absolute bottom-0 inset-x-0 border-t border-gray-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-semibold">
                  SF
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Shinji Fujiwara</p>
                  <p className="text-xs text-gray-500 truncate">VP Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main
        className={`bg-[#ECEAE5] min-h-screen md:ml-60 ${
          isDemo ? "pt-14 md:pt-0" : "pt-14 md:pt-0"
        } pb-20 md:pb-0`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30"
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
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 ${
                  active ? activeBottomNavMap[item.color] : "text-gray-400"
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
