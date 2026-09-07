import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { CtaButton } from '@/components/CtaButton'
import {
  getActiveHeroMessages,
  getHeroMessageImageUrl,
  type HeroMessage,
} from '@/services/hero-messages'
import { useRealtime } from '@/hooks/use-realtime'
import { TypewriterHero } from '@/components/home/TypewriterHero'

interface HeroProps {
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl: string | null
  typewriterPauseSeconds?: number
  typewriterTypingSpeed?: number
}

const RESUME_DELAY = 1000

const MESSAGE_CLASS =
  'text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-[1.2] text-white drop-shadow-lg'

export function Hero({
  heroImageUrl: _heroImageUrl,
  heroTitle,
  typewriterPauseSeconds,
  typewriterTypingSpeed,
}: HeroProps) {
  const [messages, setMessages] = useState<HeroMessage[]>([])
  const [activePhrase, setActivePhrase] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [failedImageUrls, setFailedImageUrls] = useState<Record<string, boolean>>({})

  // Two-tempo transition state for message content and image:
  // Phase 'visible': current message and image are 100% visible
  // Phase 'fading-out': current message and image fade out to 0% opacity
  // Phase 'empty': gap interval (~200ms) where nothing is visible
  const [transitionPhase, setTransitionPhase] = useState<'visible' | 'fading-out' | 'empty'>(
    'visible',
  )

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

  // Determine image for the currently active message:
  // Only use image attached in the database, without default/fallback image.
  // Message without image = only gradient background.
  const activeImageUrl = useMemo(() => {
    if (messages.length > 0 && activePhrase < messages.length) {
      const activeMsg = messages[activePhrase]
      if (activeMsg?.image) {
        const msgImageUrl = getHeroMessageImageUrl(activeMsg)
        if (msgImageUrl && !failedImageUrls[msgImageUrl]) {
          return msgImageUrl
        }
      }
    }
    return null
  }, [messages, activePhrase, failedImageUrls])

  const activeAlt = useMemo(() => {
    if (messages.length > 0 && activePhrase < messages.length) {
      const activeMsg = messages[activePhrase]
      if (activeMsg?.text) {
        return activeMsg.text
      }
    }
    return heroTitle || 'Gestão empresarial com ERP ibisoft'
  }, [messages, activePhrase, heroTitle])

  // Preload next image if available
  useEffect(() => {
    if (messages.length <= 1) return
    const nextIndex = (activePhrase + 1) % messages.length
    const nextMsg = messages[nextIndex]
    if (nextMsg?.image) {
      const nextUrl = getHeroMessageImageUrl(nextMsg)
      if (nextUrl && !failedImageUrls[nextUrl]) {
        const preloadImg = new Image()
        preloadImg.src = nextUrl
      }
    }
  }, [activePhrase, messages, failedImageUrls])

  const handleAdvance = useCallback(() => {
    setActivePhrase((prev) => (prev + 1) % phraseList.length)
  }, [phraseList.length])

  // Validate and apply fallbacks for typewriter parameters:
  // Pause: 1 to 15 seconds (default 3 seconds -> 3000 ms)
  const resolvedPauseSeconds =
    typeof typewriterPauseSeconds === 'number' &&
    !Number.isNaN(typewriterPauseSeconds) &&
    typewriterPauseSeconds >= 1 &&
    typewriterPauseSeconds <= 15
      ? typewriterPauseSeconds
      : 3
  const pauseAfterCompleteMs = Math.round(resolvedPauseSeconds * 1000)

  // Speed: 10 to 120 cps (default 35 cps)
  const resolvedTypingSpeed =
    typeof typewriterTypingSpeed === 'number' &&
    !Number.isNaN(typewriterTypingSpeed) &&
    typewriterTypingSpeed >= 10 &&
    typewriterTypingSpeed <= 120
      ? typewriterTypingSpeed
      : 35

  // Image visibility controlled strictly by transition phase:
  // Visible only when phase is 'visible' and there is an active image URL.
  // During 'fading-out', it animates to opacity-0.
  // During 'empty', it has opacity-0.
  const isImageVisible = transitionPhase === 'visible' && Boolean(activeImageUrl)

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
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

      {/* Hero Image Layer: Single image element, NEVER overlapped with another */}
      {activeImageUrl && (
        <img
          key={activeImageUrl}
          src={activeImageUrl}
          alt={activeAlt}
          className={cn(
            'absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ease-in-out pointer-events-none',
            isImageVisible ? 'opacity-100' : 'opacity-0',
          )}
          onError={() => {
            setFailedImageUrls((prev) => ({ ...prev, [activeImageUrl]: true }))
          }}
        />
      )}

      {/* Decorative overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 hero-grid-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto flex h-full min-h-[320px] md:min-h-[480px] lg:min-h-[600px] items-end pb-10 md:pb-16 px-4 md:px-6">
        <div className="max-w-2xl w-full animate-fade-in-up">
          <div className="relative min-h-[100px] md:min-h-[120px] lg:min-h-[140px]">
            <TypewriterHero
              phrases={phraseList}
              currentIndex={activePhrase}
              isPaused={isPaused}
              onAdvance={handleAdvance}
              charactersPerSecond={resolvedTypingSpeed}
              pauseAfterComplete={pauseAfterCompleteMs}
              fadeOutDuration={300}
              emptyDuration={200}
              onTransitionPhaseChange={setTransitionPhase}
              className={MESSAGE_CLASS}
            />
          </div>

          {phraseList.length > 1 && (
            <div className="flex items-center gap-2 py-6">
              {phraseList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== activePhrase) {
                      setActivePhrase(index)
                    }
                  }}
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
            <CtaButton
              to="/quero-conhecer"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-accent hover:bg-accent/90 text-white shadow-lg"
            >
              Solicitar demonstração
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
