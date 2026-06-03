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
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

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

  // Resilient data-fetching strategy:
  // We ensure the auth token state is fully resolved before mounting
  // the homepage components to prevent concurrent 403 errors during token refresh
  useEffect(() => {
    if (!loading) {
      // Add a tiny delay to ensure PocketBase auth store is fully propagated
      // to the child components' micro-tasks.
      const timer = setTimeout(() => setIsReady(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading, isAuthenticated])

  if (!isReady) {
    return <IndexLoader />
  }

  return (
    <div className="flex flex-col w-full">
      <Hero />
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
