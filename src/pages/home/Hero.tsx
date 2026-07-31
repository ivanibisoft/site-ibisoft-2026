import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getActiveHeroMessages, type HeroMessage } from '@/services/hero-messages'
import { useRealtime } from '@/hooks/use-realtime'

interface HeroProps {
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl: string | null
}

const ROTATION_INTERVAL = 4000

const MESSAGE_CLASS =
  'text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-[1.2] text-white drop-shadow-lg'

export function Hero({ heroImageUrl }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [messages, setMessages] = useState<HeroMessage[]>([])
  const [activePhrase, setActivePhrase] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const loadMessages = useCallback(async () => {
    const data = await getActiveHeroMessages()
    setMessages(data)
    setActivePhrase((prev) => (prev >= data.length ? 0 : prev))
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

  useEffect(() => {
    if (isPaused || messages.length <= 1) {
      clearTimer()
      return
    }
    timerRef.current = setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % messages.length)
    }, ROTATION_INTERVAL)
    return clearTimer
  }, [isPaused, clearTimer, messages.length])

  useEffect(() => () => clearTimer(), [clearTimer])

  const showImage = heroImageUrl && !imageError

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

      <div className="relative z-10 container mx-auto flex h-full min-h-[320px] md:min-h-[480px] lg:min-h-[600px] items-end pb-10 md:pb-16 px-4 md:px-6">
        <div className="max-w-2xl w-full animate-fade-in-up">
          <div className="relative min-h-[100px] md:min-h-[120px] lg:min-h-[140px]">
            {messages.map((msg, index) => {
              const isActive = index === activePhrase
              return (
                <p
                  key={msg.id}
                  className={cn(
                    'absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    MESSAGE_CLASS,
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none',
                  )}
                  aria-hidden={!isActive}
                >
                  {msg.text}
                </p>
              )
            })}
          </div>

          {messages.length > 1 && (
            <div className="flex items-center gap-2 py-6">
              {messages.map((_, index) => (
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

          {messages.length <= 1 && <div className="py-6" />}

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
