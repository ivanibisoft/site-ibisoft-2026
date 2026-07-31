import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroProps {
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
}

const ROTATION_INTERVAL = 4000

export function Hero({ heroTitle, heroSubtitle, heroImageUrl }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [activePhrase, setActivePhrase] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const phrases = [
    {
      text: heroTitle,
      className:
        'text-3xl md:text-4xl lg:text-5xl font-bold font-display leading-[1.1] text-white drop-shadow-lg',
      as: 'h1' as const,
    },
    {
      text: heroSubtitle,
      className: 'text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-md',
      as: 'p' as const,
    },
    {
      text: 'Mais do que um sistema de ERP, oferecemos vantagem competitiva.',
      className: 'text-lg text-white/70 leading-relaxed max-w-xl drop-shadow-md',
      as: 'p' as const,
    },
  ]

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [heroImageUrl])

  useEffect(() => {
    if (isPaused) {
      clearTimer()
      return
    }
    timerRef.current = setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % phrases.length)
    }, ROTATION_INTERVAL)
    return clearTimer
  }, [isPaused, clearTimer, phrases.length])

  useEffect(() => () => clearTimer(), [clearTimer])

  const showImage = heroImageUrl && !imageError

  const handleDotClick = (index: number) => {
    setActivePhrase(index)
  }

  return (
    <section
      className="relative w-full overflow-hidden min-h-[320px] md:min-h-[480px] lg:min-h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

      {showImage && (
        <img
          src={heroImageUrl!}
          alt="Gestão empresarial com ERP ibisoft"
          className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

      <div className="absolute inset-0 hero-grid-pattern opacity-10" />

      <div className="relative z-10 container mx-auto flex h-full min-h-[200px] items-center px-4 md:px-6">
        <div className="max-w-2xl w-full py-10 md:py-16 animate-fade-in-up">
          <div className="relative min-h-[180px] md:min-h-[200px] lg:min-h-[220px]">
            {phrases.map((phrase, index) => {
              const isActive = index === activePhrase
              const Tag = phrase.as
              return (
                <Tag
                  key={index}
                  className={cn(
                    'absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    phrase.className,
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none',
                  )}
                  aria-hidden={!isActive}
                >
                  {phrase.text}
                </Tag>
              )
            })}
          </div>

          <div className="flex items-center gap-2 py-6">
            {phrases.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Frase ${index + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === activePhrase ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60',
                )}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-accent hover:bg-accent/90 text-white shadow-lg group"
            >
              <Link to="/quero-conhecer">Solicitar demonstração</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
