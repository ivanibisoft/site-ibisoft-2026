import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = decodeURIComponent(hash.replace('#', ''))
    let attempts = 0
    const maxAttempts = 20

    const tryScroll = () => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (attempts < maxAttempts) {
        attempts += 1
        setTimeout(tryScroll, 100)
      }
    }

    // Primeira tentativa em timeout para aguardar a renderização inicial
    const timer = setTimeout(tryScroll, 100)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}
