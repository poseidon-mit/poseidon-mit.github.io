import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Bell, Settings2 } from "lucide-react";
import { Link, useRouter } from "@/router";
import { EmptyState } from "@/components/poseidon";
import { ListHeroBanner } from "@/components/poseidon/list-hero-banner";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { usePageTitle } from "@/hooks/use-page-title";
import { DEMO_THREAD } from "@/lib/demo-thread";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ENGINE_BADGE_CLASS } from "@/lib/engine-color-map";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface Notification {
  id: string;
  engine: "Protect" | "Grow" | "Execute" | "Govern";
  category: "security" | "growth" | "actions" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLink?: string;
}

const notifications: Notification[] = [
  {
    id: "N-001",
    engine: "Protect",
    category: "security",
    title: "Suspicious charge flagged",
    body: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()} charge from ${DEMO_THREAD.criticalAlert.counterparty} flagged for review.`,
    time: "Just now",
    read: false,
    actionLink: "/protect/alert-detail?alertId=THR-001",
  },
  {
    id: "N-002",
    engine: "Protect",
    category: "security",
    title: "Amazon Prime fee increase detected",
    body: "Amazon Prime annual fee increased $139 → $164 without prior notification.",
    time: "12m ago",
    read: false,
    actionLink: "/protect/alert-detail?alertId=THR-012",
  },
  {
    id: "N-003",
    engine: "Grow",
    category: "growth",
    title: `Emergency fund — $${DEMO_THREAD.liquidityReserve.current.toLocaleString()} saved`,
    body: `${DEMO_THREAD.liquidityReserve.percent}% toward your $${DEMO_THREAD.liquidityReserve.target.toLocaleString()} goal.`,
    time: "1h ago",
    read: false,
    actionLink: "/grow/goal",
  },
  {
    id: "N-004",
    engine: "Grow",
    category: "growth",
    title: "High-yield savings opportunity",
    body: "Moving idle cash to a high-yield savings account could earn you $900/year more in interest.",
    time: "2h ago",
    read: false,
    actionLink: "/grow/recommendation?id=GRW-001",
  },
  {
    id: "N-005",
    engine: "Execute",
    category: "actions",
    title: "Dispute package compiled",
    body: "Dispute package compiled for Apple Store Miami $1,299 charge — Awaiting your approval in Execute.",
    time: "3h ago",
    read: true,
    actionLink: "/execute/approval?actionId=EXE-002",
  },
  {
    id: "N-006",
    engine: "Execute",
    category: "actions",
    title: "2 actions awaiting your approval",
    body: "Savings transfer and card dispute expire in 18h.",
    time: "4h ago",
    read: true,
    actionLink: "/execute/queue",
  },
  {
    id: "N-007",
    engine: "Govern",
    category: "system",
    title: "Weekly audit report ready",
    body: `${DEMO_THREAD.decisionsAudited.toLocaleString()} decisions audited. 100% coverage maintained.`,
    time: "6h ago",
    read: true,
    actionLink: "/govern/audit",
  },
  {
    id: "N-008",
    engine: "Govern",
    category: "system",
    title: "Privacy check complete",
    body: "Zero data shared with AI training. All models run in zero-retention mode.",
    time: "8h ago",
    read: true,
    actionLink: "/govern",
  },
  {
    id: "N-009",
    engine: "Protect",
    category: "security",
    title: "Utility bill spike detected",
    body: "PG&E bill spike detected — $387.42, significantly above your 12-month average.",
    time: "6h ago",
    read: false,
    actionLink: "/protect/alert-detail?alertId=THR-007",
  },
  {
    id: "N-010",
    engine: "Protect",
    category: "security",
    title: "Unrecognized recurring charge",
    body: "Unrecognized recurring charge — DIGISRV*PREMIUM $9.99/mo flagged for review.",
    time: "8h ago",
    read: false,
    actionLink: "/protect/alert-detail?alertId=THR-006",
  },
  {
    id: "N-011",
    engine: "Grow",
    category: "growth",
    title: "401(k) employer match opportunity",
    body: "You may be leaving $1,500/yr in employer match on the table — increase 401(k) contribution to 8%.",
    time: "1d ago",
    read: false,
    actionLink: "/grow/recommendation?id=GRW-005",
  },
];

const engineBadgeCls = ENGINE_BADGE_CLASS;
const engineInitial: Record<string, string> = {
  Protect: "P",
  Grow: "G",
  Execute: "E",
  Govern: "G",
};

type CategoryFilter = "all" | "security" | "growth" | "actions" | "system";

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function Notifications() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } =
    getMotionPreset(prefersReducedMotion);
  usePageTitle("Notifications");
  const router = useRouter();

  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [readState, setReadState] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, n.read])),
  );

  const unreadCount = Object.values(readState).filter((r) => !r).length;
  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.category === filter);
  const sorted = [...filtered].sort((a, b) =>
    readState[a.id] === readState[b.id] ? 0 : readState[a.id] ? 1 : -1,
  );
  const categoryCounts = {
    security: notifications.filter((n) => n.category === "security").length,
    growth: notifications.filter((n) => n.category === "growth").length,
    actions: notifications.filter((n) => n.category === "actions").length,
    system: notifications.filter((n) => n.category === "system").length,
  };

  const markAllRead = () =>
    setReadState(Object.fromEntries(notifications.map((n) => [n.id, true])));
  const markRead = (id: string) =>
    setReadState((prev) => ({ ...prev, [id]: true }));
  const markReadByKeyboard = (
    event: KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      markRead(id);
    }
  };

  return (
    <div className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Banner */}
        <motion.div variants={fadeUpVariant}>
          <ListHeroBanner
            engine="dashboard"
            icon={Bell}
            engineLabel="Dashboard · Notifications"
            title="Notifications"
            subtitle={`${unreadCount} unread notifications across all engines`}
            backTo="/dashboard"
            backLabel="Back to Dashboard"
            stats={[
              { label: "Total", value: notifications.length },
              {
                label: "Unread",
                value: unreadCount,
                color: "var(--state-warning)",
              },
              { label: "Security", value: categoryCounts.security },
            ]}
          />
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
          {/* Main feed — full width */}
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-4">
            {/* Header controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </span>
                {unreadCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 engine-indicator-dashboard animate-pulse" />
                )}
              </div>
              <button
                onClick={markAllRead}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "!min-h-7 !px-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
                )}
              >
                Mark all read
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "all",
                  "security",
                  "growth",
                  "actions",
                  "system",
                ] as CategoryFilter[]
              ).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    `!min-h-[44px] rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all ${filter === t ? (t === "security" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : t === "growth" ? "border-violet-500/30 bg-violet-500/10 text-violet-400" : t === "actions" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : t === "system" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-white/15 bg-white/[0.08] text-foreground") : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"}`,
                  )}
                >
                  {t === "all"
                    ? `All (${notifications.length})`
                    : `${t} (${notifications.filter((n) => n.category === t).length})`}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div
              className="flex flex-col gap-2"
              aria-live="polite"
              aria-label="Notifications list"
            >
              {sorted.length === 0 && (
                <EmptyState
                  title="No notifications found"
                  description="Try another filter to view more updates."
                  icon={Bell}
                  accentColor="var(--engine-dashboard)"
                />
              )}
              {sorted.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "glass-list-card rounded-2xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-white/[0.05]",
                    !readState[notif.id]
                      ? "border-l-[3px] border-l-cyan-400 bg-white/[0.05]"
                      : "border-white/[0.06] bg-white/[0.03]",
                  )}
                  onClick={() => {
                    markRead(notif.id);
                    if (notif.actionLink) router.navigate(notif.actionLink);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      markRead(notif.id);
                      if (notif.actionLink) router.navigate(notif.actionLink);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${notif.title}. ${readState[notif.id] ? "Read" : "Unread"}. ${notif.time}`}
                >
                  {/* Unread dot */}
                  <div className="pt-1.5 w-2 shrink-0">
                    {!readState[notif.id] && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 engine-indicator-dashboard" />
                    )}
                  </div>

                  {/* Engine icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${engineBadgeCls[notif.engine]}`}
                  >
                    {engineInitial[notif.engine]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm ${!readState[notif.id] ? "font-semibold text-foreground" : "font-medium text-foreground/70"}`}
                    >
                      {notif.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground/60">
                        {notif.time}
                      </span>
                      {notif.actionLink && (
                        <Link
                          to={notif.actionLink}
                          className="text-xs font-medium text-[var(--engine-dashboard)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Menu button */}
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-muted-foreground hover:text-foreground text-lg leading-none shrink-0 !h-8 !min-h-8 !w-8 !px-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⋯
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences — collapsible bottom section */}
          <motion.details variants={fadeUpVariant} className="group mt-4">
            <summary className="flex items-center gap-2 cursor-pointer list-none text-muted-foreground hover:text-foreground transition-colors py-2">
              <Settings2
                className="h-4 w-4"
                style={{ color: "var(--engine-dashboard)" }}
              />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Alert Preferences &amp; Stats
              </span>
              <span className="text-xs text-muted-foreground/50 ml-auto group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="glass-list-card rounded-2xl p-5 flex flex-col gap-3">
                <div className="space-y-3">
                  {[
                    {
                      label: "Security alerts",
                      type: "Push + Email",
                      enabled: true,
                    },
                    {
                      label: "Growth insights",
                      type: "Push only",
                      enabled: true,
                    },
                    {
                      label: "Action updates",
                      type: "Push only",
                      enabled: true,
                    },
                    {
                      label: "System notices",
                      type: "Email digest",
                      enabled: false,
                    },
                  ].map((pref) => (
                    <div
                      key={pref.label}
                      className="flex items-center justify-between py-1 border-b border-white/[0.06] last:border-0"
                    >
                      <div>
                        <span className="text-sm font-medium text-foreground tracking-wide">
                          {pref.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          {pref.type}
                        </span>
                      </div>
                      <div
                        className={`w-9 h-5 rounded-full relative ${pref.enabled ? "bg-cyan-500 engine-indicator-dashboard" : "bg-white/[0.08]"}`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pref.enabled ? "left-4" : "left-0.5"}`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Digest frequency
                    </span>
                    <select className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[var(--engine-dashboard)]/40">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="glass-list-card rounded-2xl p-5 flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Stats
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Total today",
                      value: String(notifications.length),
                      color: "text-foreground",
                    },
                    {
                      label: "Unread",
                      value: String(unreadCount),
                      color: "text-amber-600 engine-text-execute",
                    },
                    {
                      label: "Security",
                      value: String(categoryCounts.security),
                      color: "text-emerald-600 engine-text-protect",
                    },
                    {
                      label: "Actioned (7d)",
                      value: "87%",
                      color: "text-cyan-600 engine-text-dashboard",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center py-1 border-b border-white/[0.06] last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {row.label}
                      </span>
                      <span
                        className={`text-sm font-mono tabular-nums ${row.color}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.details>
        </div>
      </motion.div>
    </div>
  );
}

export default Notifications;
