import type React from 'react'
import { z } from 'zod'

export const ButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'ghost', 'danger', 'outline', 'glass']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  engine: z.enum(['dashboard', 'protect', 'grow', 'execute', 'govern']).optional(),
  loading: z.boolean().default(false),
  springPress: z.boolean().default(true),
  fullWidth: z.boolean().default(false),
  icon: z.any().optional(),
  iconPosition: z.enum(['left', 'right']).default('left'),
  className: z.string().optional(),
  children: z.any(),
  disabled: z.boolean().optional(),
  type: z.enum(['button', 'submit', 'reset']).default('button'),
})

export type ButtonProps = z.input<typeof ButtonPropsSchema> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
