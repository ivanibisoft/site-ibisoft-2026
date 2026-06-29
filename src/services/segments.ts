import pb from '@/lib/pocketbase/client'

export interface Segment {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  image: string
  created: string
  updated: string
}

export const getSegmentImageUrl = (segment: Segment, thumb?: string): string | null => {
  if (!segment.image) return null
  const thumbParam = thumb ? `?thumb=${thumb}` : ''
  return `${pb.baseURL}/api/files/segments/${segment.id}/${segment.image}${thumbParam}`
}

export interface SegmentChallenge {
  id: string
  segment: string
  title: string
  description: string
  order: number
  created: string
  updated: string
}

export const getSegments = async () => {
  try {
    return await pb.collection('segments').getFullList<Segment>({
      sort: 'created',
    })
  } catch (error) {
    console.error('Error fetching segments:', error)
    return []
  }
}

export const getSegmentBySlug = async (slug: string) => {
  try {
    return await pb.collection('segments').getFirstListItem<Segment>(`slug="${slug}"`)
  } catch (error) {
    console.error(`Error fetching segment ${slug}:`, error)
    throw error
  }
}

export const getSegmentChallenges = async (segmentId: string) => {
  try {
    return await pb.collection('segment_challenges').getFullList<SegmentChallenge>({
      filter: `segment="${segmentId}"`,
      sort: 'order',
    })
  } catch (error) {
    console.error(`Error fetching challenges for segment ${segmentId}:`, error)
    return []
  }
}
