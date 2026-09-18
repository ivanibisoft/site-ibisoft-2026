import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/services/audience'

/**
 * Hook que escuta mudanças na rota da SPA e envia automaticamente
 * o registro anônimo de navegação para a ferramenta de audiência.
 */
export function useAudienceTracker() {
  const location = useLocation()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    // Evita duplicidade se a mesma rota for re-renderizada sem mudança de path
    const fullPath = location.pathname + location.search
    if (lastTracked.current === fullPath) {
      return
    }

    lastTracked.current = fullPath

    // Pequeno debounce para permitir que títulos da página sejam atualizados
    const timer = setTimeout(() => {
      trackPageView({ path: location.pathname })
    }, 200)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])
}
