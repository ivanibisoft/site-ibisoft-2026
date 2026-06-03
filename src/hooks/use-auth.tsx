import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

const getStoredUser = () => {
  if (!pb.authStore.isValid) return null

  const isSuperuser =
    pb.authStore.isSuperuser ||
    // @ts-expect-error - legacy admin support
    pb.authStore.isAdmin ||
    pb.authStore.model?.collectionName === '_superusers' ||
    pb.authStore.record?.collectionName === '_superusers'

  if (isSuperuser) return { id: 'admin', isSuperuser: true, ...pb.authStore.record }

  if (pb.authStore.record) return pb.authStore.record
  return null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(getStoredUser())
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(getStoredUser())
      setIsAuthenticated(pb.authStore.isValid)
    })

    if (pb.authStore.isValid) {
      const isSuperuser =
        pb.authStore.isSuperuser ||
        // @ts-expect-error - legacy admin support
        pb.authStore.isAdmin ||
        pb.authStore.model?.collectionName === '_superusers' ||
        pb.authStore.record?.collectionName === '_superusers'

      if (isSuperuser) {
        // Superusers (like the editor) cannot refresh their tokens via the `users` collection.
        // Attempting to do so returns 403 and clears the session, which crashes administrative data fetching.
        setLoading(false)
      } else {
        // In the editor, an invalid token might still cause a 403 on refresh
        // We ensure that we catch it gracefully so the UI doesn't break
        pb.collection('users')
          .authRefresh()
          .catch((error) => {
            console.warn(
              'Session refresh failed. This is expected if testing public access in editor:',
              error,
            )
            pb.authStore.clear()
          })
          .finally(() => setLoading(false))
      }
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password })
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
