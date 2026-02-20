/**
 * Poseidon Design System v2 — Main barrel export.
 *
 * Import everything from '@/design-system' for a single entry point
 * to providers, primitives, and the AI-readable registry.
 */

// Providers
export { DesignSystemProvider } from './providers/DesignSystemProvider'
export { EffectProvider, useEffectPreset, EFFECT_PRESETS, EFFECT_PRESET_META, type EffectPreset } from './providers/EffectProvider'

// Primitives
export { Surface, type SurfaceProps } from './components/primitives/Surface'
export { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from './components/primitives/Button'
export { Badge, type BadgeProps } from './components/primitives/Badge'
export { Input, type InputProps } from './components/primitives/Input'
export { Toggle, type ToggleProps } from './components/primitives/Toggle'
export { Progress, type ProgressProps } from './components/primitives/Progress'
export { Avatar, type AvatarProps } from './components/primitives/Avatar'
export { Skeleton, type SkeletonProps } from './components/primitives/Skeleton'
export { Separator, type SeparatorProps } from './components/primitives/Separator'
export { ScrollArea, type ScrollAreaProps } from './components/primitives/ScrollArea'

// Composition
export { IconContainer, type IconContainerProps } from './components/composition/IconContainer'
export { SectionHeader, type SectionHeaderProps } from './components/composition/SectionHeader'
export { DetailRow, type DetailRowProps } from './components/composition/DetailRow'
export { StatCard, type StatCardProps } from './components/composition/StatCard'
export { DataTable, type DataTableProps } from './components/composition/DataTable'
export { NavigationLink, type NavigationLinkProps } from './components/composition/NavigationLink'
export { Modal, type ModalProps } from './components/composition/Modal'
export { BottomSheet, type BottomSheetProps } from './components/composition/BottomSheet'
export { DSToast, type DSToastProps } from './components/composition/Toast'
export { CommandPaletteItem, type CommandPaletteItemProps } from './components/composition/CommandPaletteItem'

// AI
export { AIInsightBanner, type AIInsightBannerProps } from './components/ai/AIInsightBanner'
export { AIThinking, type AIThinkingProps } from './components/ai/AIThinking'
export { ConfidenceRing, type ConfidenceRingProps } from './components/ai/ConfidenceRing'
export { FactorBar, type FactorBarProps } from './components/ai/FactorBar'
export { TypewriterText, type TypewriterTextProps } from './components/ai/TypewriterText'

// Data-viz
export { SparkLine, type SparkLineProps } from './components/data-viz/SparkLine'
export { DSAreaChart, type DSAreaChartProps } from './components/data-viz/AreaChart'
export { DSBarChart, type DSBarChartProps } from './components/data-viz/BarChart'
export { RingProgress, type RingProgressProps } from './components/data-viz/RingProgress'
export { HeatMap, type HeatMapProps } from './components/data-viz/HeatMap'

// Effects
export { GlassPanel, type GlassPanelProps } from './components/effects/GlassPanel'
export { GlowBorder, type GlowBorderProps } from './components/effects/GlowBorder'
export { NeuralBackground, type NeuralBackgroundProps } from './components/effects/NeuralBackground'
export { PulsingOrb, type PulsingOrbProps } from './components/effects/PulsingOrb'
export { AuroraGradient, type AuroraGradientProps } from './components/effects/AuroraGradient'
export { GridOverlay, type GridOverlayProps } from './components/effects/GridOverlay'

// Registry
export { componentCatalog, type ComponentName, type ComponentCategory } from './registry/catalog'
