import { useState, useEffect, useCallback } from 'react'
import { countActiveBlogPosts } from '@/services/blog'
import useRealtime from '@/hooks/use-realtime'

export function useHasBlogPosts() {
  const [hasBlogPosts, setHasBlogPosts] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkBlogPosts = useCallback(async () => {
    try {
      const count = await countActiveBlogPosts()
      setHasBlogPosts(count > 0)
    } catch {
      setHasBlogPosts(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkBlogPosts()
  }, [checkBlogPosts])

  useRealtime('posts', () => {
    checkBlogPosts()
  })

  return { hasBlogPosts, loading }
}
