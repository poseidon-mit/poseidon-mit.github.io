/**
 * Type declarations for @radix-ui/react-slider
 *
 * Stub declarations allowing AutonomyDial.tsx to compile.
 * Replace with real types when the package is installed:
 *   npm install @radix-ui/react-slider
 */
declare module '@radix-ui/react-slider' {
  import * as React from 'react'

  interface SliderProps extends React.HTMLAttributes<HTMLSpanElement> {
    value?: number[]
    defaultValue?: number[]
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    dir?: 'ltr' | 'rtl'
    inverted?: boolean
    onValueChange?: (value: number[]) => void
    onValueCommit?: (value: number[]) => void
    name?: string
    'aria-label'?: string
  }

  interface SliderTrackProps extends React.HTMLAttributes<HTMLSpanElement> {}
  interface SliderRangeProps extends React.HTMLAttributes<HTMLSpanElement> {}
  interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement> {}

  export const Root: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<HTMLSpanElement>>
  export const Track: React.ForwardRefExoticComponent<SliderTrackProps & React.RefAttributes<HTMLSpanElement>>
  export const Range: React.ForwardRefExoticComponent<SliderRangeProps & React.RefAttributes<HTMLSpanElement>>
  export const Thumb: React.ForwardRefExoticComponent<SliderThumbProps & React.RefAttributes<HTMLSpanElement>>
}
