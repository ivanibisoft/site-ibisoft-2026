import { useEffect, useRef, RefObject } from 'react'

interface AutoFocusOptions {
  enabled?: boolean
  delay?: number
  retries?: number
  persist?: boolean
  persistDuration?: number
}

export function useAutoFocus<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: AutoFocusOptions = {},
) {
  const {
    enabled = true,
    delay = 100,
    retries = 8,
    persist = true,
    persistDuration = 3000,
  } = options

  const userInteractedRef = useRef(false)
const blurHandlerRef = useRef<(() => void) | null>(null)
const blurTargetRef = useRef<HTMLElement | null>(null)  const blurTargetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    userInteractedRef.current = false
    let retryCount = 0
    let retryTimer: ReturnType<typeof setTimeout>
    let persistTimer: ReturnType<typeof setTimeout>
    let blurLossTimer: ReturnType<typeof setTimeout>
    let rafId: number

    const handlePointerDown = () => {
      userInteractedRef.current = true
    }

    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false
      const tag = el.tagName.toLowerCase()
      return tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button'
    }

    const attemptFocus = () => {
      const el = targetRef.current
      if (!el) {
        if (retryCount < retries) {
          retryCount++
          retryTimer = setTimeout(() => {
            rafId = requestAnimationFrame(attemptFocus)
          }, delay * retryCount)
        }
        return
      }

      const rect = el.getBoundingClientRect()
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      if (!isVisible) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      rafId = requestAnimationFrame(() => {
        el.focus()

        if (document.activeElement === el) {
          if (persist) {
            const onBlur = () => {
              if (userInteractedRef.current) return
              clearTimeout(blurLossTimer)
              blurLossTimer = setTimeout(() => {
                const active = document.activeElement
                if (!userInteractedRef.current && !isInteractive(active)) {
                  targetRef.current?.focus()
                }
              }, 50)
            }
            blurHandlerRef.current = onBlur
            blurTargetRef.current = el
            el.addEventListener('blur', onBlur)
            persistTimer = setTimeout(() => {
              if (blurTargetRef.current) {
                blurTargetRef.current.removeEventListener('blur', onBlur)
              }
              blurHandlerRef.current = null
              blurTargetRef.current = null
            }, persistDuration)
          }
        } else if (retryCount < retries) {
          retryCount++
          retryTimer = setTimeout(() => {
            rafId = requestAnimationFrame(attemptFocus)
          }, delay * retryCount)
        }
      })
    }

    document.addEventListener('pointerdown', handlePointerDown, { once: true })
    const initialTimer = setTimeout(() => {
      rafId = requestAnimationFrame(attemptFocus)
    }, delay)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      clearTimeout(initialTimer)
      clearTimeout(retryTimer)
      clearTimeout(persistTimer)
      clearTimeout(blurLossTimer)
      cancelAnimationFrame(rafId)
      if (blurHandlerRef.current && blurTargetRef.current) {
        blurTargetRef.current.removeEventListener('blur', blurHandlerRef.current)
      }
      blurHandlerRef.current = null
      blurTargetRef.current = null
    }
  }, [enabled, delay, retries, persist, persistDuration, targetRef])
}
