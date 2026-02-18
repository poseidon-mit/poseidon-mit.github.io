import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-[#1ae3c7] to-[#0ea5e9] text-[#0B1221] font-semibold hover:opacity-90',
  ghost:
    'border border-white/10 text-white/80 hover:bg-white/5',
  soft:
    'bg-accent-teal/10 text-teal-300 hover:bg-accent-teal/20',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      onClick={handleClick}
      className={[
        'relative inline-flex items-center justify-center rounded-xl transition-all focus:outline-none',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        loading ? 'text-transparent' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <span
          aria-label="Loading"
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            className="h-4 w-4 animate-spin text-current"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}

export default Button;
