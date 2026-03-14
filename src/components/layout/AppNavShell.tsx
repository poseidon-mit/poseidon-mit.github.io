import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Bell, Settings } from "lucide-react";
import { Link, useRouter } from "@/router";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { usePWA } from "@/hooks/usePWA";
import { useRouteWarmup } from "@/hooks/useRouteWarmup";
import { Button } from "@/components/ui/button";
import { TalkToMoneyFab } from "@/components/ui/TalkToMoneyFab";
import { type EngineName } from "@/lib/engine-tokens";
import { cn } from "@/lib/utils";
import { BREADCRUMB_MAP } from "@/lib/breadcrumb-registry";
import {
  Sidebar,
  NAV_ITEMS,
  ENGINE_ITEMS,
  TONE_CLASSES,
} from "../navigation/Sidebar";
import { TopBar } from "../navigation/TopBar";
import { useDemoExecute } from "@/lib/demo-state/provider";
import { useDismissedAlerts } from "@/pages/protect/useDismissedAlerts";
import { CANONICAL_UNIVERSE } from "@/domain/poseidon-universe/canonical";

/* ─── Helpers ────────────────────────────────────────────── */
function getActiveSection(path: string) {
  return NAV_ITEMS.find(
    (item) => path === item.path || path.startsWith(item.path + "/"),
  );
}

function getActiveEngine(path: string): EngineName | undefined {
  const section = getActiveSection(path);
  if (!section || section.group === "system") return undefined;
  return section.engine;
}

const SHELL_HEADING_PATHS = new Set([
  "/dashboard",
  "/protect",
  "/grow",
  "/execute",
  "/govern",
  "/settings",
]);

const LazyCommandPalette = lazy(async () => {
  const module = await import("./CommandPalette");
  return { default: module.CommandPalette };
});

function scrollShellViewportToTop(
  main: HTMLElement | null,
  behavior: ScrollBehavior = "auto",
) {
  if (main) {
    if (typeof main.scrollTo === "function") {
      main.scrollTo({ top: 0, left: 0, behavior });
    } else {
      main.scrollTop = 0;
      main.scrollLeft = 0;
    }
  }

  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, left: 0, behavior });
  }
}

export function AppNavShell({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const activeSection = useMemo(() => getActiveSection(path), [path]);
  const activeEngine = useMemo(() => getActiveEngine(path), [path]);
  const breadcrumbs = useMemo(
    () => BREADCRUMB_MAP[path] ?? ["Unknown"],
    [path],
  );
  const shellHeading = useMemo(() => {
    if (!SHELL_HEADING_PATHS.has(path)) return undefined;
    return activeSection?.label ?? breadcrumbs[breadcrumbs.length - 1] ?? "";
  }, [activeSection?.label, breadcrumbs, path]);
  const { navigate, pendingPath, showPendingIndicator } = useRouter();
  const {
    isOpen: isPaletteOpen,
    open: openPalette,
    close: closePalette,
  } = useCommandPalette();
  const { isPresentation } = usePresentationMode();
  const { isOffline } = usePWA();
  const executeState = useDemoExecute();
  const activeTone = activeSection?.tone;
  const activeToneClasses = activeTone ? TONE_CLASSES[activeTone] : undefined;
  const mainRef = useRef<HTMLElement | null>(null);
  useRouteWarmup(path);

  const pendingExecuteCount = useMemo(
    () =>
      Object.values(executeState.actionStates).filter(
        (entry) => entry.status === "pending",
      ).length,
    [executeState],
  );
  const { dismissed } = useDismissedAlerts();
  const activeProtectCount = useMemo(
    () =>
      CANONICAL_UNIVERSE.entities.protectThreats.filter(
        (t) =>
          (t.severity === "Critical" || t.severity === "High") &&
          !dismissed.has(t.id),
      ).length,
    [dismissed],
  );
  const mobileBadges: Record<string, number> = useMemo(
    () => ({
      "/protect": activeProtectCount,
      "/execute": pendingExecuteCount,
    }),
    [activeProtectCount, pendingExecuteCount],
  );

  useEffect(() => {
    closePalette();
  }, [path, closePalette]);

  useLayoutEffect(() => {
    scrollShellViewportToTop(mainRef.current, "auto");
  }, [path]);

  const handleBottomNavTap = useCallback(
    (itemPath: string) => {
      if (path.startsWith(itemPath)) {
        scrollShellViewportToTop(mainRef.current, "smooth");
      }
    },
    [path],
  );

  return (
    <div className="app-bg-oled flex h-[100dvh] overflow-hidden selection:bg-cyan-500/20 theme-precision lg:h-auto lg:min-h-screen lg:overflow-visible">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      {isPaletteOpen ? (
        <Suspense fallback={null}>
          <LazyCommandPalette isOpen={isPaletteOpen} onClose={closePalette} />
        </Suspense>
      ) : null}

      {/* ── Desktop Sidebar ── */}
      <Sidebar
        path={path}
        pendingPath={pendingPath}
        showPendingIndicator={showPendingIndicator}
      />

      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-[280px]">
        {/* ── Desktop TopBar ── */}
        <TopBar
          breadcrumbs={breadcrumbs}
          activeToneClasses={activeToneClasses}
          activeEngine={activeEngine}
          isOffline={isOffline}
          isPresentation={isPresentation}
          onOpenPalette={openPalette}
          pendingPath={pendingPath}
          showPendingIndicator={showPendingIndicator}
        />

        {/* ── Mobile top header ── */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#08080D]/90 px-3 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 w-full items-center justify-between gap-2">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-1.5 min-w-0"
              aria-label="Poseidon home"
            >
              <img
                src="/logo.png"
                alt=""
                width="40"
                height="40"
                className="h-10 w-10 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                aria-hidden="true"
              />
              <span className="hidden min-[430px]:inline text-sm font-semibold tracking-widest text-foreground">
                Poseidon
              </span>
            </Link>
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center justify-center">
                <li className="truncate px-1 text-center text-sm font-medium text-foreground">
                  {shellHeading ? (
                    <h1 className="truncate text-sm font-medium text-foreground">
                      {shellHeading}
                    </h1>
                  ) : (
                    (activeSection?.label ?? "")
                  )}
                </li>
              </ol>
            </nav>
            <div className="flex items-center justify-end gap-1">
              <Link
                to="/settings"
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
                  path === "/settings"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
                {showPendingIndicator && pendingPath?.startsWith("/settings") ? (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white/70 animate-pulse" aria-hidden="true" />
                ) : null}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative !h-11 !min-h-11 !w-11 rounded-lg !px-0 text-muted-foreground"
                onClick={() => navigate("/dashboard/notifications")}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main
          id="main-content"
          role="main"
          ref={mainRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:overflow-visible lg:pb-0"
        >
          <div className="min-h-full">{children}</div>
        </main>
      </div>

      <TalkToMoneyFab />

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/5 bg-[#08080D]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Mobile navigation"
      >
        {ENGINE_ITEMS.map((item) => {
          const isActive =
            path === item.path || path.startsWith(item.path + "/");
          const Icon = item.icon;
          const tone = TONE_CLASSES[item.tone];
          return (
            <Link
              key={item.path}
              to={item.path}
              prefetch="intent"
              className={cn(
                "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-150",
                isActive ? "text-white" : "text-white/25",
              )}
              onClick={() => handleBottomNavTap(item.path)}
              aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "h-1 w-1 rounded-full transition-opacity duration-150",
                    tone.indicator,
                    isActive || (showPendingIndicator && pendingPath?.startsWith(item.path))
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                  aria-hidden="true"
                />
              <div className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
