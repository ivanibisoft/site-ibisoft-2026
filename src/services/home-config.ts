import pb from '@/lib/pocketbase/client'

export interface HomeConfig {
  id: string
  typewriter_pause_seconds?: number
  typewriter_typing_speed?: number
  created: string
  updated: string
}

export const getHomeConfig = async (): Promise<HomeConfig | null> => {
  try {
    const list = await pb.collection('home_config').getFullList<HomeConfig>({
      sort: 'created',
    })
    return list[0] || null
  } catch (error) {
    console.error('Error fetching home config:', error)
    return null
  }
}
