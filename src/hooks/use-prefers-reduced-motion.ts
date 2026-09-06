import { useEffect, useState } from 'react'

/**
 * Hook to detect if the user has requested reduced motion in their system preferences.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Set initial value
    setPrefersReducedMotion(mediaQueryList.matches)

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
      return () => mediaQueryList.removeEventListener('change', listener)
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener)
      return () => mediaQueryList.removeListener(listener)
    }
  }, [])

  return prefersReducedMotion
}
