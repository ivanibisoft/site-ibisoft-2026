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
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-primary">
      {showImage && (
        <img
          src={heroImageUrl!}
          alt="Gestão empresarial com ERP ibisoft"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

      <div className="absolute inset-0 hero-grid-pattern opacity-10" />

      <div className="relative z-10 container mx-auto flex min-h-[85vh] items-center px-4 md:px-6">
        <div className="max-w-2xl space-y-6 py-20 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display leading-[1.1] text-white drop-shadow-lg">
            {heroTitle}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-md">
            {heroSubtitle}
          </p>

          <p className="text-lg text-white/70 leading-relaxed max-w-xl drop-shadow-md">
            Mais do que um sistema de ERP, oferecemos vantagem competitiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-accent hover:bg-accent/90 text-white shadow-lg group"
            >
              <Link to="/quero-conhecer">Solicitar demonstração</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
