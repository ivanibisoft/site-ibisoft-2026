import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { getSiteAssets, getAssetFileUrl, type SiteAsset } from '@/services/site-assets'
import { useRealtime } from '@/hooks/use-realtime'

interface SiteAssetsContextType {
  getAssetUrl: (slug: string) => string | null
  getAsset: (slug: string) => SiteAsset | null
  refresh: () => void
  loading: boolean
}

const SiteAssetsContext = createContext<SiteAssetsContextType | undefined>(undefined)

export const useSiteAssets = () => {
  const context = useContext(SiteAssetsContext)
  if (!context) throw new Error('useSiteAssets must be used within SiteAssetsProvider')
  return context
}

export const SiteAssetsProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Map<string, SiteAsset>>(new Map())
  const [loading, setLoading] = useState(true)

  const loadAssets = useCallback(async () => {
    const list = await getSiteAssets()
    const map = new Map<string, SiteAsset>()
    for (const asset of list) {
      map.set(asset.slug, asset)
    }
    setAssets(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  useRealtime('site_assets', () => {
    loadAssets()
  })

  const getAsset = useCallback(
    (slug: string): SiteAsset | null => assets.get(slug) || null,
    [assets],
  )

  const getAssetUrl = useCallback(
    (slug: string): string | null => {
      const asset = assets.get(slug)
      if (!asset || !asset.asset_file) return null
      return getAssetFileUrl(asset)
    },
    [assets],
  )

  return (
    <SiteAssetsContext.Provider value={{ getAssetUrl, getAsset, refresh: loadAssets, loading }}>
      {children}
    </SiteAssetsContext.Provider>
  )
}
