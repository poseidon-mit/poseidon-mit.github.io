/**
 * PageSkeleton — lightweight skeleton fallback for route transitions.
 *
 * Replaces the full-screen RouteLoadingFallback during page-to-page navigation.
 * Shows pulsing card placeholders (hero-sized rect + 3 card rects).
 */

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-label="Loading page content">
      {/* Hero skeleton */}
      <div className="rounded-2xl bg-muted border border-border h-[200px] md:h-[260px]" />
      {/* Card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-muted border border-border h-[120px]" />
        <div className="rounded-2xl bg-muted border border-border h-[120px]" />
        <div className="rounded-2xl bg-muted border border-border h-[120px]" />
      </div>
    </div>
  )
}
