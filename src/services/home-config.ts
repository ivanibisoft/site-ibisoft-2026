import pb from '@/lib/pocketbase/client'

export interface HomeConfig {
  id: string
  hero_image: string
  hero_title: string
  hero_subtitle: string
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

export const getHeroImageUrl = (config: HomeConfig, thumb?: string): string | null => {
  if (!config.hero_image) return null
  const thumbParam = thumb ? `?thumb=${thumb}` : ''
  return `${pb.baseURL}/api/files/home_config/${config.id}/${config.hero_image}${thumbParam}`
}
