import pb from '@/lib/pocketbase/client'

export interface SiteAsset {
  id: string
  name: string
  slug: string
  asset_file: string
  alt_text: string
  mime_type: string
  created: string
  updated: string
}

export const getSiteAssets = async (): Promise<SiteAsset[]> => {
  try {
    return await pb.collection('site_assets').getFullList<SiteAsset>()
  } catch (error) {
    console.error('Error fetching site assets:', error)
    return []
  }
}

export const getSiteAssetBySlug = async (slug: string): Promise<SiteAsset | null> => {
  try {
    return await pb.collection('site_assets').getFirstListItem<SiteAsset>(`slug = "${slug}"`)
  } catch {
    return null
  }
}

export const getAssetFileUrl = (asset: SiteAsset): string => {
  return `${pb.baseURL}/api/files/site_assets/${asset.id}/${asset.asset_file}`
}
