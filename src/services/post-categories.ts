import pb from '@/lib/pocketbase/client'

export interface PostCategory {
  id: string
  name: string
  order?: number
  is_active?: boolean
  created: string
  updated: string
  collectionId?: string
}

export const getPostCategories = async (): Promise<PostCategory[]> => {
  try {
    return await pb.collection('post_categories').getFullList<PostCategory>({
      sort: 'order,name',
    })
  } catch (error) {
    console.error('Error fetching post categories:', error)
    return []
  }
}

export const getActivePostCategories = async (): Promise<PostCategory[]> => {
  try {
    return await pb.collection('post_categories').getFullList<PostCategory>({
      filter: 'is_active = true',
      sort: 'order,name',
    })
  } catch (error) {
    console.error('Error fetching active post categories:', error)
    return []
  }
}

export const countPostsByCategoryName = async (categoryName: string): Promise<number> => {
  try {
    const safeName = categoryName.replace(/"/g, '\\"')
    const result = await pb.collection('posts').getList(1, 1, {
      filter: `category = "${safeName}"`,
    })
    return result.totalItems
  } catch (error) {
    console.error('Error counting posts by category:', error)
    return 0
  }
}
