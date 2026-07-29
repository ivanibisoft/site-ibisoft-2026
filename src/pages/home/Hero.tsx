import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface HeroProps {
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
}

export function Hero({ heroTitle, heroSubtitle, heroImageUrl }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [heroImageUrl])

  const showImage = heroImageUrl && !imageError

  return (
    <section className="relative overflow-hidden bg-primary pt-20 pb-32 text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90"></div>
      <div className="absolute inset-0 hero-grid-pattern opacity-10"></div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1]">
            {heroTitle}
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium leading-relaxed">
            {heroSubtitle}
          </p>

          <p className="text-lg text-primary-foreground/70 leading-relaxed max-w-xl">
            Mais do que um sistema de ERP, oferecemos vantagem competitiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold group"
            >
              <Link to="/quero-conhecer">Solicitar demonstração</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white"
            ></Button>
          </div>
        </div>

        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-2 min-h-[300px]">
            {showImage && (
              <img
                src={heroImageUrl!}
                alt="Dashboard ERP ibisoft"
                className={`rounded-xl w-full h-auto object-cover transition-opacity duration-700 ${
                  imageLoaded ? 'opacity-90 hover:opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-2 rounded-xl hero-image-placeholder animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
