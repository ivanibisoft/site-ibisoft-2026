import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getActiveHeroMessages, type HeroMessage } from '@/services/hero-messages'
import { useRealtime } from '@/hooks/use-realtime'
import { TypewriterHero } from '@/components/home/TypewriterHero'

interface HeroProps {
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl: string | null
}

const RESUME_DELAY = 1000

const MESSAGE_CLASS =
  'text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-[1.2] text-white drop-shadow-lg'

export function Hero({ heroImageUrl, heroTitle }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [messages, setMessages] = useState<HeroMessage[]>([])
  const [activePhrase, setActivePhrase] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const loadMessages = useCallback(async () => {
    const data = await getActiveHeroMessages()
    setMessages(data)
    setActivePhrase((prev) => (data.length > 0 && prev >= data.length ? 0 : prev))
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useRealtime('hero_messages', () => {
    loadMessages()
  })

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [heroImageUrl])

  useEffect(
    () => () => {
      clearResumeTimer()
    },
    [clearResumeTimer],
  )

  const phraseList = useMemo(() => {
    if (messages.length > 0) {
      return messages.map((m) => m.text)
    }
    if (heroTitle) {
      return [heroTitle]
    }
    return ['Gestão completa da sua empresa com um ERP simples, integrado e escalável']
  }, [messages, heroTitle])

  const handleAdvance = useCallback(() => {
    setActivePhrase((prev) => (prev + 1) % phraseList.length)
  }, [phraseList.length])

  const showImage = heroImageUrl && !imageError

  return (
    <section
      className="relative w-full overflow-hidden min-h-[320px] md:min-h-[480px] lg:min-h-[600px]"
      onMouseEnter={() => {
        clearResumeTimer()
        setIsPaused(true)
      }}
      onMouseLeave={() => {
        clearResumeTimer()
        resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY)
      }}
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

      <div className="relative z-10 container mx-auto flex h-full min-h-[320px] md:min-h-[480px] lg:min-h-[600px] items-end pb-10 md:pb-16 px-4 md:px-6">
        <div className="max-w-2xl w-full animate-fade-in-up">
          <div className="relative min-h-[100px] md:min-h-[120px] lg:min-h-[140px]">
            <TypewriterHero
              phrases={phraseList}
              currentIndex={activePhrase}
              isPaused={isPaused}
              onAdvance={handleAdvance}
              charactersPerSecond={50}
              pauseAfterComplete={2800}
              className={MESSAGE_CLASS}
            />
          </div>

          {phraseList.length > 1 && (
            <div className="flex items-center gap-2 py-6">
              {phraseList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhrase(index)}
                  aria-label={`Mensagem ${index + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === activePhrase ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60',
                  )}
                />
              ))}
            </div>
          )}

          {phraseList.length <= 1 && <div className="py-6" />}

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
