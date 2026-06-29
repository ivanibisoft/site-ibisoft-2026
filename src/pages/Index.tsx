import { Hero } from './home/Hero'
import { Problems } from './home/Problems'
import { Benefits } from './home/Benefits'
import { HowItWorks } from './home/HowItWorks'
import { Features } from './home/Features'
import { Logos } from './home/Logos'
import { SuccessCases } from './home/SuccessCases'
import { SocialProof } from './home/SocialProof'
import { Segments } from './home/Segments'
import { FinalCTA } from './home/FinalCTA'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { getHomeConfig, getHeroImageUrl, type HomeConfig } from '@/services/home-config'

const IndexLoader = () => (
  <div className="flex flex-col w-full min-h-screen p-8 space-y-8 animate-pulse bg-background">
    <Skeleton className="h-[70vh] w-full rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </div>
  </div>
)

const Index = () => {
  const { loading, isAuthenticated } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null)

  const loadHomeConfig = async () => {
    const config = await getHomeConfig()
    setHomeConfig(config)
  }

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsReady(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    loadHomeConfig()
  }, [])

  useRealtime('home_config', () => {
    loadHomeConfig()
  })

  if (!isReady) {
    return <IndexLoader />
  }

  const heroImageUrl = homeConfig ? getHeroImageUrl(homeConfig, '800x600') : null
  const heroTitle =
    homeConfig?.hero_title ||
    'Gestão completa da sua empresa com um ERP simples, integrado e escalável'
  const heroSubtitle =
    homeConfig?.hero_subtitle ||
    'Controle financeiro, estoque, vendas, fiscal e muito mais em um único sistema'

  return (
    <div className="flex flex-col w-full">
      <Hero heroTitle={heroTitle} heroSubtitle={heroSubtitle} heroImageUrl={heroImageUrl} />
      <Problems />
      <Benefits />
      <HowItWorks />
      <Features />
      <Segments />
      <Logos />
      <SuccessCases />
      <SocialProof />
      <FinalCTA />
    </div>
  )
}

export default Index
