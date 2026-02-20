import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ToggleProps } from './Toggle.schema'

export function Toggle({
  checked = false,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  className,
}: ToggleProps) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? (label ? undefined : 'Toggle')}
      disabled={disabled}
      onClick={handleClick}
      className={twMerge(
        clsx(
          'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border',
          'transition-all duration-200 ease-in-out backdrop-blur-xl',
          checked
            ? 'border-cyan-300/80 bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.35)]'
            : 'border-white/15 bg-white/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
          disabled && 'cursor-not-allowed opacity-50',
        ),
        !label ? className : undefined,
      )}
    >
      <span
        className={clsx(
          'pointer-events-none inline-block h-5 w-5 rounded-full border border-cyan-200/60 bg-[#051126] shadow-[0_1px_2px_rgba(0,0,0,0.5)]',
          'transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-[24px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )

  if (!label) return toggle

  return (
    <label
      className={twMerge(
        clsx(
          'inline-flex items-center gap-2.5 select-none',
          disabled && 'cursor-not-allowed opacity-50',
        ),
        className,
      )}
    >
      {toggle}
      <span className="text-sm text-white/70">{label}</span>
    </label>
  )
}

Toggle.displayName = 'Toggle'
