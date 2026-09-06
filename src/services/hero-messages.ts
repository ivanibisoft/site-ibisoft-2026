import pb from '@/lib/pocketbase/client'

export interface HeroMessage {
  id: string
  text: string
  order: number
  is_active: boolean
  image?: string
  created: string
  updated: string
}

export const getHeroMessageImageUrl = (message: HeroMessage, thumb?: string): string | null => {
  if (!message.image) return null
  const thumbParam = thumb ? `?thumb=${thumb}` : ''
  return `${pb.baseURL}/api/files/hero_messages/${message.id}/${message.image}${thumbParam}`
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
