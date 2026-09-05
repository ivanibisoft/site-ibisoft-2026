import pb from '@/lib/pocketbase/client'

export interface BlogPost {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
  category?: string
  image?: string
  read_time?: string
  published_at?: string
  is_active: boolean
  created: string
  updated: string
  collectionId?: string
}

export const getActiveBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    return await pb.collection('posts').getFullList<BlogPost>({
      filter: 'is_active = true',
      sort: '-created',
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export const countActiveBlogPosts = async (): Promise<number> => {
  try {
    const result = await pb.collection('posts').getList(1, 1, {
      filter: 'is_active = true',
    })
    return result.totalItems
  } catch (error) {
    console.error('Error counting blog posts:', error)
    return 0
  }
}

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await pb
      .collection('posts')
      .getFirstListItem<BlogPost>(`slug = "${slug.replace(/"/g, '\\"')}" && is_active = true`)
    return post
  } catch (error) {
    // If not found or inactive
    return null
  }
}

export const getRecentBlogPosts = async (excludeId?: string, limit = 3): Promise<BlogPost[]> => {
  try {
    const filter = excludeId ? `is_active = true && id != "${excludeId}"` : 'is_active = true'
    const result = await pb.collection('posts').getList<BlogPost>(1, limit, {
      filter,
      sort: '-created',
    })
    return result.items
  } catch (error) {
    console.error('Error fetching recent blog posts:', error)
    return []
  }
}

export const getBlogPostImageUrl = (post: BlogPost): string | null => {
  if (!post.image) return null
  return `${pb.baseURL}/api/files/${post.collectionId || 'posts'}/${post.id}/${post.image}`
}
