import { useEffect, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Environment-Aware Middleware
 * Distinguishes between the public view and the administrative edit mode.
 * Ensures that security checks (like 403s on public routes) do not block
 * the mounting of the primary editor interface.
 */
export const EditorMiddleware = ({ children }: Props) => {
  useEffect(() => {
    const isEditor = typeof window !== 'undefined' && window.self !== window.top

    if (isEditor) {
      // In editor mode, we want to ensure the app doesn't crash on 403s
      // globally suppress unhandled 403/401 promise rejections that might bubble up
      const handleRejection = (event: PromiseRejectionEvent) => {
        if (event.reason && typeof event.reason === 'object') {
          const status = event.reason.status || event.reason.statusCode
          if (status === 403 || status === 401) {
            console.warn(
              '[EditorMiddleware] Suppressed 403/401 error in editor mode to maintain shell stability:',
              event.reason,
            )
            event.preventDefault()
          }
        }
      }

      window.addEventListener('unhandledrejection', handleRejection)

      return () => {
        window.removeEventListener('unhandledrejection', handleRejection)
      }
    }
  }, [])

  return <>{children}</>
}
