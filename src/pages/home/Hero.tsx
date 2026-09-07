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

  // Two-tempo transition state for message content:
  // Phase 'visible': current message is visible / typing
  // Phase 'fading-out': current message fades out to 0% opacity
  // Phase 'empty': gap interval (~200ms) where no text is visible
  const [_textPhase, setTextPhase] = useState<'visible' | 'fading-out' | 'empty'>('visible')

  // Continuous cross-fade image transition state:
  // Maintain outgoing image (fading out) and incoming/current image (fading in)
  // so that hero is never left without an image during transitions.
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null)
  const [isCrossFading, setIsCrossFading] = useState(false)
  const crossFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setCurrentImageIndex((prev) => (data.length > 0 && prev >= data.length ? 0 : prev))
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
      if (crossFadeTimerRef.current) {
        clearTimeout(crossFadeTimerRef.current)
        crossFadeTimerRef.current = null
      }
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

  // Helper to extract valid image URL for a given message index
  const getImageUrlForIndex = useCallback(
    (index: number) => {
      if (messages.length > 0 && index >= 0 && index < messages.length) {
        const msg = messages[index]
        if (msg?.image) {
          const url = getHeroMessageImageUrl(msg)
          if (url && !failedImageUrls[url]) {
            return url
          }
        }
      }
      return null
    },
    [messages, failedImageUrls],
  )

  const getImageAltForIndex = useCallback(
    (index: number) => {
      if (messages.length > 0 && index >= 0 && index < messages.length) {
        const msg = messages[index]
        if (msg?.text) {
          return msg.text
        }
      }
      return heroTitle || 'Gestão empresarial com ERP ibisoft'
    },
    [messages, heroTitle],
  )

  // Trigger continuous cross-fade whenever active phrase/message changes
  const startCrossFadeTo = useCallback(
    (targetIndex: number) => {
      if (crossFadeTimerRef.current) {
        clearTimeout(crossFadeTimerRef.current)
        crossFadeTimerRef.current = null
      }

      const prevUrl = getImageUrlForIndex(currentImageIndex)
      const targetUrl = getImageUrlForIndex(targetIndex)

      // If target is same as current index and not currently cross-fading, nothing to do
      if (targetIndex === currentImageIndex && !isCrossFading) {
        return
      }

      // If neither has an image, or both resolve to the exact same image URL:
      if (prevUrl === targetUrl) {
        setCurrentImageIndex(targetIndex)
        setPreviousImageIndex(null)
        setIsCrossFading(false)
        return
      }

      // When transitioning from an existing image to another (or to/from null):
      // Keep old image visible underneath while the new image is shown.
      // previousImageIndex gets the outgoing image index.
      // currentImageIndex gets the incoming image index.
      setPreviousImageIndex(currentImageIndex)
      setCurrentImageIndex(targetIndex)
      setIsCrossFading(true)

      // Give browser a frame to commit initial opacity before triggering the cross-fade animation,
      // or rely on CSS transition duration (500ms).
      crossFadeTimerRef.current = setTimeout(() => {
        setPreviousImageIndex(null)
        setIsCrossFading(false)
        crossFadeTimerRef.current = null
      }, 600)
    },
    [currentImageIndex, isCrossFading, getImageUrlForIndex],
  )

  // Coordinate image transition when text starts fading out or when activePhrase changes
  const handleTransitionPhaseChange = useCallback(
    (phase: 'visible' | 'fading-out' | 'empty') => {
      setTextPhase(phase)

      // When text starts fading out, initiate image cross-fade immediately
      // so the next image starts appearing smoothly while the old is still present,
      // completely eliminating any image blackout during the text gap (~200ms).
      if (phase === 'fading-out' && messages.length > 1) {
        const nextIdx = (activePhrase + 1) % messages.length
        startCrossFadeTo(nextIdx)
      }
    },
    [activePhrase, messages.length, startCrossFadeTo],
  )

  // Also handle direct activePhrase changes (e.g. pagination dots clicks)
  useEffect(() => {
    if (activePhrase !== currentImageIndex) {
      startCrossFadeTo(activePhrase)
    }
  }, [activePhrase, currentImageIndex, startCrossFadeTo])

  // Preload all upcoming message images (especially the immediate next one)
  // so cross-fade begins without network latency, including the first transition.
  useEffect(() => {
    if (messages.length <= 1) return

    // Priority 1: Next immediate image
    const nextIndex = (activePhrase + 1) % messages.length
    const nextUrl = getImageUrlForIndex(nextIndex)
    if (nextUrl) {
      const preloadImg = new Image()
      preloadImg.src = nextUrl
    }

    // Priority 2: Preload other messages' images in idle/background
    messages.forEach((msg, idx) => {
      if (idx !== activePhrase && idx !== nextIndex && msg.image) {
        const url = getHeroMessageImageUrl(msg)
        if (url && !failedImageUrls[url]) {
          const img = new Image()
          img.src = url
        }
      }
    })
  }, [activePhrase, messages, getImageUrlForIndex, failedImageUrls])

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

  const currentImageUrl = getImageUrlForIndex(currentImageIndex)
  const currentImageAlt = getImageAltForIndex(currentImageIndex)

  const previousImageUrl =
    previousImageIndex !== null ? getImageUrlForIndex(previousImageIndex) : null
  const previousImageAlt =
    previousImageIndex !== null ? getImageAltForIndex(previousImageIndex) : ''

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

      {/* Hero Image Layers: Dual-layer continuous cross-fade
          - Previous image remains underneath and fades out smoothly.
          - Current/incoming image sits on top and fades in smoothly.
          - Guarantees there is NEVER a visual blackout/gap without an image during slide change.
          - No fallback images: messages without an image render only the gradient background.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Layer 1: Previous image (outgoing) remaining visible while new image enters */}
        {previousImageUrl && (
          <img
            key={`prev-${previousImageUrl}`}
            src={previousImageUrl}
            alt={previousImageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-contain object-center pointer-events-none transition-opacity duration-500 ease-in-out',
              // When an incoming image is fading in over it, the outgoing image fades out
              currentImageUrl && isCrossFading ? 'opacity-0' : 'opacity-100',
            )}
            onError={() => {
              setFailedImageUrls((prev) => ({ ...prev, [previousImageUrl]: true }))
            }}
          />
        )}

        {/* Layer 2: Current/incoming image fading in */}
        {currentImageUrl && (
          <img
            key={`curr-${currentImageUrl}`}
            src={currentImageUrl}
            alt={currentImageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-contain object-center pointer-events-none transition-opacity duration-500 ease-in-out',
              'opacity-100',
            )}
            onError={() => {
              setFailedImageUrls((prev) => ({ ...prev, [currentImageUrl]: true }))
            }}
          />
        )}
      </div>

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
              onTransitionPhaseChange={handleTransitionPhaseChange}
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
