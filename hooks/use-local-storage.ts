"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Persists a piece of state to localStorage. Safe for SSR: reads the
 * default value on the server and hydrates from storage after mount.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        setValue(JSON.parse(raw) as T)
      }
    } catch {
      // Ignore malformed storage; fall back to default.
    } finally {
      setHydrated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage might be unavailable (e.g. Safari private mode quota).
    }
  }, [key, value, hydrated])

  const reset = useCallback(() => setValue(defaultValue), [defaultValue])

  return [value, setValue, { hydrated, reset }] as const
}
