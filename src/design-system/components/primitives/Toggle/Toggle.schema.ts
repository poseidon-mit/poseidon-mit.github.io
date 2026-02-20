import { z } from 'zod'

export const TogglePropsSchema = z.object({
  checked: z.boolean().default(false),
  onChange: z.function().args(z.boolean()).returns(z.void()).optional(),
  label: z.string().optional(),
  ariaLabel: z.string().optional(),
  disabled: z.boolean().default(false),
  engine: z.enum(['dashboard', 'protect', 'grow', 'execute', 'govern']).optional(),
  className: z.string().optional(),
})

export type ToggleProps = z.input<typeof TogglePropsSchema>
