import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface TypewriterTextProps {
  phrases: string[]
  currentIndex: number
  isPaused?: boolean
  onPhraseComplete?: (index: number) => void
  onAdvance?: () => void
  /**
   * Average speed in characters per second. Default 50 (middle of 40-60 chars/s range).
   */
  charactersPerSecond?: number
  /**
   * Pause time in milliseconds once full phrase is typed before advancing or pausing.
   */
  pauseAfterComplete?: number
  className?: string
  cursorClassName?: string
}

export function TypewriterHero({
  phrases,
  currentIndex,
  isPaused = false,
  onAdvance,
  charactersPerSecond = 50,
  pauseAfterComplete = 2800,
  className,
  cursorClassName,
}: TypewriterTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Track displayed character count for current typing phrase
  const [charCount, setCharCount] = useState(0)

  // State for the phrase that is currently animating / being typed
  const [displayIndex, setDisplayIndex] = useState(currentIndex)

  // State for the previous phrase to keep visible while the next is typing / transitioning
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)

  // Whether the current phrase has completed typing
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // Calculate typing delay per character in ms (~20ms for 50 chars/sec)
  const charDelay = Math.max(12, Math.round(1000 / charactersPerSecond))

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused

  const currentPhrase = phrases[displayIndex] || ''
  const previousPhrase = previousIndex !== null ? phrases[previousIndex] : null

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
  }

  // Handle external change of currentIndex (e.g. user clicked pagination dot or parent rotated)
  useEffect(() => {
    if (currentIndex !== displayIndex) {
      clearAllTimers()
      // Store current display as previous so it stays visible while new one begins typing
      setPreviousIndex(displayIndex)
      setDisplayIndex(currentIndex)
      setCharCount(0)
      setIsTypingComplete(false)
    }
  }, [currentIndex, displayIndex])

  // Typing effect loop
  useEffect(() => {
    // If reduced motion is preferred, show full text immediately without typing animation
    if (prefersReducedMotion) {
      setCharCount(currentPhrase.length)
      setIsTypingComplete(true)
      setPreviousIndex(null)

      if (phrases.length > 1 && onAdvance && !isPaused) {
        advanceTimerRef.current = setTimeout(() => {
          if (!isPausedRef.current) {
            onAdvance()
          }
        }, pauseAfterComplete + 2000)
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
      setPreviousIndex(null)

      // Only schedule auto-advance if we have more than 1 phrase, an onAdvance callback, and not hovered/paused
      if (phrases.length > 1 && onAdvance && !isPaused) {
        advanceTimerRef.current = setTimeout(() => {
          if (!isPausedRef.current) {
            onAdvance()
          }
        }, pauseAfterComplete)
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
    prefersReducedMotion,
    phrases.length,
    onAdvance,
    pauseAfterComplete,
    isPaused,
  ])

  // Handle unpause when phrase was already completed
  useEffect(() => {
    if (
      !isPaused &&
      isTypingComplete &&
      phrases.length > 1 &&
      onAdvance &&
      !advanceTimerRef.current
    ) {
      const waitTime = prefersReducedMotion ? pauseAfterComplete + 2000 : pauseAfterComplete
      advanceTimerRef.current = setTimeout(() => {
        if (!isPausedRef.current) {
          onAdvance()
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
    isTypingComplete,
    phrases.length,
    onAdvance,
    pauseAfterComplete,
    prefersReducedMotion,
  ])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  const typedText = currentPhrase.slice(0, charCount)
  // Determine if previous phrase should be visible (e.g. during initial typing phase)
  const showPreviousPhrase =
    previousPhrase !== null &&
    previousPhrase !== currentPhrase &&
    !prefersReducedMotion &&
    charCount < Math.floor(currentPhrase.length * 0.6)

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

      {/* Previous phrase layer: stays softly visible as background while next phrase starts typing */}
      {showPreviousPhrase && (
        <p
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none',
            className,
            // Fade out smoothly as charCount progresses
            charCount === 0 ? 'opacity-80' : 'opacity-25',
          )}
          aria-hidden="true"
        >
          {previousPhrase}
        </p>
      )}

      {/* Active typing layer */}
      <p
        className={cn('absolute inset-0 select-text', className)}
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{typedText}</span>
        {/* Blinking cursor */}
        <span
          className={cn(
            'inline-block align-baseline ml-0.5 w-[3px] h-[0.9em] bg-accent rounded-sm animate-typewriter-cursor select-none',
            prefersReducedMotion ? 'hidden' : 'inline-block',
            cursorClassName,
          )}
          aria-hidden="true"
        />
      </p>
    </div>
  )
}
