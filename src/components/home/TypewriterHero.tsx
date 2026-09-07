import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

export interface TypewriterHeroProps {
  phrases: string[]
  currentIndex: number
  isPaused?: boolean
  onPhraseComplete?: (index: number) => void
  onAdvance?: () => void
  /**
   * Average speed in characters per second. Default 35.
   */
  charactersPerSecond?: number
  /**
   * Pause time in milliseconds once full phrase is typed before advancing or pausing.
   */
  pauseAfterComplete?: number
  /**
   * Time in ms for the fade-out of the old phrase before switching to the next.
   */
  fadeOutDuration?: number
  /**
   * Blank gap duration in ms between old phrase fade-out and next phrase typing start.
   */
  emptyDuration?: number
  /**
   * Optional callback when an exit transition begins (e.g. to synchronize image fade-out).
   */
  onTransitionPhaseChange?: (phase: 'visible' | 'fading-out' | 'empty') => void
  className?: string
  cursorClassName?: string
}

export function TypewriterHero({
  phrases,
  currentIndex,
  isPaused = false,
  onAdvance,
  charactersPerSecond = 35,
  pauseAfterComplete = 3000,
  fadeOutDuration = 300,
  emptyDuration = 200,
  onTransitionPhaseChange,
  className,
  cursorClassName,
}: TypewriterHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Track displayed character count for current typing phrase
  const [charCount, setCharCount] = useState(0)

  // State for the phrase that is currently being displayed/typed
  const [displayIndex, setDisplayIndex] = useState(currentIndex)

  // Transition phase: 'visible' (typing or typed), 'fading-out' (fading out), 'empty' (blank gap)
  const [phase, setPhase] = useState<'visible' | 'fading-out' | 'empty'>('visible')

  // Whether the current phrase has completed typing
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // Validate and clamp/fallback charactersPerSecond and pauseAfterComplete
  const safeSpeed =
    typeof charactersPerSecond === 'number' &&
    !Number.isNaN(charactersPerSecond) &&
    charactersPerSecond >= 10 &&
    charactersPerSecond <= 120
      ? charactersPerSecond
      : 35

  const safePauseMs =
    typeof pauseAfterComplete === 'number' &&
    !Number.isNaN(pauseAfterComplete) &&
    pauseAfterComplete >= 1000 &&
    pauseAfterComplete <= 15000
      ? pauseAfterComplete
      : 3000

  // Calculate typing delay per character in ms (~28-29ms for 35 chars/sec)
  const charDelay = Math.max(8, Math.round(1000 / safeSpeed))

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused

  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

  const onTransitionPhaseChangeRef = useRef(onTransitionPhaseChange)
  onTransitionPhaseChangeRef.current = onTransitionPhaseChange

  const currentPhrase = phrases[displayIndex] || ''

  // Notify parent of phase change
  const updatePhase = (newPhase: 'visible' | 'fading-out' | 'empty') => {
    setPhase(newPhase)
    onTransitionPhaseChangeRef.current?.(newPhase)
  }

  // Clean up all timers helper
  const clearAllTimers = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }
  }

  // Two-step advance routine:
  // Step 1: Fade out current phrase completely (no ghost/old text underneath)
  // Step 2: Empty gap with nothing visible
  // Step 3: Trigger onAdvance (or switch index) and start typing next
  const triggerTwoStepAdvance = () => {
    clearAllTimers()

    if (prefersReducedMotion) {
      // In reduced motion, skip fade-out animation and advance directly
      onAdvanceRef.current?.()
      return
    }

    // 1. Fade out completely
    updatePhase('fading-out')

    transitionTimerRef.current = setTimeout(() => {
      // 2. Empty interval (nothing visible)
      updatePhase('empty')
      setCharCount(0)
      setIsTypingComplete(false)

      transitionTimerRef.current = setTimeout(() => {
        // 3. Inform parent to advance index
        onAdvanceRef.current?.()
      }, emptyDuration)
    }, fadeOutDuration)
  }

  // Handle external change of currentIndex (e.g. user clicked pagination dot or onAdvance fired)
  useEffect(() => {
    if (currentIndex !== displayIndex) {
      clearAllTimers()

      if (phase === 'empty') {
        // Already cleared out! Just switch index and start typing visible
        setDisplayIndex(currentIndex)
        setCharCount(0)
        setIsTypingComplete(false)
        updatePhase('visible')
      } else if (prefersReducedMotion) {
        setDisplayIndex(currentIndex)
        setCharCount(phrases[currentIndex]?.length || 0)
        setIsTypingComplete(true)
        updatePhase('visible')
      } else {
        // Direct manual jump (e.g. clicked pagination dot while visible):
        // Run full two-step exit before showing new phrase!
        updatePhase('fading-out')
        transitionTimerRef.current = setTimeout(() => {
          updatePhase('empty')
          setCharCount(0)
          setIsTypingComplete(false)
          setDisplayIndex(currentIndex)

          transitionTimerRef.current = setTimeout(() => {
            updatePhase('visible')
          }, emptyDuration)
        }, fadeOutDuration)
      }
    }
  }, [
    currentIndex,
    displayIndex,
    phase,
    prefersReducedMotion,
    phrases,
    emptyDuration,
    fadeOutDuration,
  ])

  // Typing effect loop
  useEffect(() => {
    // Only type if in visible phase
    if (phase !== 'visible') {
      return
    }

    // If reduced motion is preferred, show full text immediately without typing animation
    if (prefersReducedMotion) {
      setCharCount(currentPhrase.length)
      setIsTypingComplete(true)

      if (phrases.length > 1 && onAdvance && !isPaused) {
        advanceTimerRef.current = setTimeout(() => {
          if (!isPausedRef.current) {
            triggerTwoStepAdvance()
          }
        }, safePauseMs + 2000)
      }
      return () => {
        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current)
          advanceTimerRef.current = null
        }
      }
    }

    if (!currentPhrase) {
      return
    }

    // If typing is in progress
    if (charCount < currentPhrase.length) {
      typingTimerRef.current = setTimeout(() => {
        setCharCount((prev) => prev + 1)
      }, charDelay)

      return () => {
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current)
          typingTimerRef.current = null
        }
      }
    } else {
      // Completed typing full phrase
      setIsTypingComplete(true)

      // Only schedule auto-advance if we have more than 1 phrase, an onAdvance callback, and not hovered/paused
      if (phrases.length > 1 && onAdvance && !isPaused) {
        advanceTimerRef.current = setTimeout(() => {
          if (!isPausedRef.current) {
            triggerTwoStepAdvance()
          }
        }, safePauseMs)
      }

      return () => {
        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current)
          advanceTimerRef.current = null
        }
      }
    }
  }, [
    charCount,
    currentPhrase,
    charDelay,
    phase,
    prefersReducedMotion,
    phrases.length,
    onAdvance,
    safePauseMs,
    isPaused,
  ])

  // Handle unpause when phrase was already completed
  useEffect(() => {
    if (
      !isPaused &&
      phase === 'visible' &&
      isTypingComplete &&
      phrases.length > 1 &&
      onAdvance &&
      !advanceTimerRef.current &&
      !transitionTimerRef.current
    ) {
      const waitTime = prefersReducedMotion ? safePauseMs + 2000 : safePauseMs
      advanceTimerRef.current = setTimeout(() => {
        if (!isPausedRef.current) {
          triggerTwoStepAdvance()
        }
      }, waitTime)
    }

    return () => {
      if (isPaused && advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current)
        advanceTimerRef.current = null
      }
    }
  }, [
    isPaused,
    phase,
    isTypingComplete,
    phrases.length,
    onAdvance,
    safePauseMs,
    prefersReducedMotion,
  ])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  const typedText = currentPhrase.slice(0, charCount)

  return (
    <div className="relative w-full">
      {/* Ghost element: renders all phrases stacked invisibly in normal flow so the tallest sets the container height without layout shifts */}
      <div
        className="grid grid-cols-1 grid-rows-1 invisible pointer-events-none select-none"
        aria-hidden="true"
      >
        {phrases.map((phrase, idx) => (
          <div key={idx} className={cn('col-start-1 row-start-1', className)}>
            {phrase}
            <span className="inline-block w-[3px] ml-1 opacity-0">&nbsp;</span>
          </div>
        ))}
      </div>

      {/* Active typing layer: smoothly fades out completely during exit, hidden during empty phase, visible during typing */}
      <p
        className={cn(
          'absolute inset-0 select-text transition-opacity duration-300 ease-in-out',
          phase === 'visible' ? 'opacity-100' : 'opacity-0 pointer-events-none',
          className,
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{phase === 'empty' ? '' : typedText}</span>
        {/* Blinking cursor */}
        <span
          className={cn(
            'inline-block align-baseline ml-0.5 w-[3px] h-[0.9em] bg-accent rounded-sm animate-typewriter-cursor select-none',
            prefersReducedMotion || phase !== 'visible' ? 'hidden' : 'inline-block',
            cursorClassName,
          )}
          aria-hidden="true"
        />
      </p>
    </div>
  )
}
