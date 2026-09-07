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
import { useEffect, useState, useCallback } from 'react'
import { getHomeConfig, type HomeConfig } from '@/services/home-config'
import { getActivePartnerLogos, type PartnerLogo } from '@/services/partner-logos'

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
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([])

  const loadHomeConfig = useCallback(async () => {
    const config = await getHomeConfig()
    setHomeConfig(config)
  }, [])

  const loadPartnerLogos = useCallback(async () => {
    const logos = await getActivePartnerLogos()
    setPartnerLogos(logos)
  }, [])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsReady(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    loadHomeConfig()
    loadPartnerLogos()
  }, [loadHomeConfig, loadPartnerLogos])

  useRealtime('home_config', () => {
    loadHomeConfig()
  })

  useRealtime('partner_logos', () => {
    loadPartnerLogos()
  })

  if (!isReady) {
    return <IndexLoader />
  }

  return (
    <div className="flex flex-col w-full">
      <Hero
        typewriterPauseSeconds={homeConfig?.typewriter_pause_seconds}
        typewriterTypingSpeed={homeConfig?.typewriter_typing_speed}
      />
      <Problems />
      <Benefits />
      <HowItWorks />
      <Features />
      <Segments />
      <Logos key={partnerLogos.length} />
      <SuccessCases />
      <SocialProof />
      <FinalCTA />
    </div>
  )
}

export default Index
