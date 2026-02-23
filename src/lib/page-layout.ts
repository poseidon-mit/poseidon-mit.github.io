/**
 * Shared page layout constants.
 *
 * Every app-route page should use these on its main content container
 * to guarantee consistent max-width, horizontal padding, and centering.
 *
 * Usage:
 *   <motion.div className={cn(PAGE_CONTENT_CLASS, "flex flex-col gap-6")} style={PAGE_CONTENT_STYLE}>
 */

/** Tailwind classes for centering + responsive horizontal padding */
export const PAGE_CONTENT_CLASS = 'mx-auto w-full px-4 md:px-6 lg:px-8' as const

/** Inline style for max-width (1440px) */
export const PAGE_CONTENT_STYLE = { maxWidth: '1440px' } as const

/**
 * Page heading (h1) — consistent across all engine pages.
 *
 * Usage:
 *   <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>Title</h1>
 */
export const PAGE_HEADING_CLASS = 'text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white leading-tight' as const
export const PAGE_HEADING_STYLE = { fontFamily: 'var(--font-display)' } as const
