import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-white border border-white/20',
        claude: 'bg-blue-600/20 text-blue-300 border border-blue-400/30',
        gpt: 'bg-green-600/20 text-green-300 border border-green-400/30',
        gemini: 'bg-purple-600/20 text-purple-300 border border-purple-400/30',
        outline: 'border border-white/20 text-white',
        muted: 'bg-white/5 text-white/60 border border-white/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
