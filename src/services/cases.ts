import pb from '@/lib/pocketbase/client'

export const getFeaturedCases = async () => {
  try {
    return await pb.collection('cases').getFullList({
      filter: 'featured = true',
      sort: '-created',
    })
  } catch (error) {
    console.error('Error fetching featured cases:', error)
    return []
  }
}
