import pb from '@/lib/pocketbase/client'

export interface HeroMessage {
  id: string
  text: string
  order: number
  is_active: boolean
  created: string
  updated: string
}

export const getActiveHeroMessages = async (): Promise<HeroMessage[]> => {
  try {
    return await pb.collection('hero_messages').getFullList<HeroMessage>({
      filter: 'is_active = true',
      sort: 'order',
    })
  } catch (error) {
    console.error('Error fetching hero messages:', error)
    return []
  }
}
