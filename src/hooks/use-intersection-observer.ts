import { useEffect, useState, useRef, RefObject } from 'react'

interface UseIntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverArgs = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isIntersecting, setIntersecting] = useState<boolean>(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        if (freezeOnceVisible && isElementIntersecting) {
          setIntersecting(true)
          observer.unobserve(node)
        } else if (!freezeOnceVisible) {
          setIntersecting(isElementIntersecting)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return [ref, isIntersecting]
}
