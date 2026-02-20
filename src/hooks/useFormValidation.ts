import { useCallback, useMemo, useState } from 'react'

export interface ValidationRule {
  required?: string
  pattern?: { value: RegExp; message: string }
  minLength?: { value: number; message: string }
}

export type ValidationRules<T extends object> = {
  [K in keyof T]?: ValidationRule
}

function toInputString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

export function useFormValidation<T extends object>(rules: ValidationRules<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const validateField = useCallback(
    (field: keyof T, values: T): string | undefined => {
      const rule = rules[field]
      if (!rule) return undefined

      const value = toInputString(values[field]).trim()

      if (rule.required && value.length === 0) return rule.required
      if (rule.minLength && value.length < rule.minLength.value) return rule.minLength.message
      if (rule.pattern && !rule.pattern.value.test(value)) return rule.pattern.message
      return undefined
    },
    [rules],
  )

  const validate = useCallback(
    (values: T): boolean => {
      const nextErrors: Partial<Record<keyof T, string>> = {}

      for (const field of Object.keys(rules) as Array<keyof T>) {
        const error = validateField(field, values)
        if (error) nextErrors[field] = error
      }

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    },
    [rules, validateField],
  )

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const getFieldA11yProps = useCallback(
    (field: keyof T) => {
      const fieldName = String(field)
      return {
        'aria-invalid': Boolean(errors[field]),
        'aria-describedby': errors[field] ? `${fieldName}-error` : undefined,
      }
    },
    [errors],
  )

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  return {
    errors,
    setErrors,
    validate,
    validateField,
    clearFieldError,
    getFieldA11yProps,
    hasErrors,
  }
}
