import { useMemo } from 'react'
import { useRouter } from '@/router'

export function useDetailParam(key: string): string | null {
  const { search } = useRouter()
  return useMemo(() => new URLSearchParams(search).get(key), [search, key])
}
