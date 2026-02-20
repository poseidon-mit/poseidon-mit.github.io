import { z } from 'zod'
import type { ElementType, ReactNode } from 'react'

export const SurfacePropsSchema = z.object({
  variant: z.enum(['glass', 'elevated', 'sunken', 'inset', 'transparent']).default('glass'),
  engine: z.enum(['protect', 'grow', 'execute', 'govern']).optional(),
  glow: z.boolean().default(false),
  interactive: z.boolean().default(false),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  as: z.any().optional(),
  className: z.string().optional(),
  children: z.any(),
})

export type SurfaceProps = {
  variant?: 'glass' | 'elevated' | 'sunken' | 'inset' | 'transparent'
  engine?: 'protect' | 'grow' | 'execute' | 'govern'
  glow?: boolean
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: ElementType
  className?: string
  children?: ReactNode
} & {
  [key: string]: any
}
