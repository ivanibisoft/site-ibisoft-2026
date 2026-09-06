import { useRef, useEffect, useState, useCallback } from 'react'
import { Trophy } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { CtaButton } from '@/components/CtaButton'
import { getCases, getCaseImageUrl, type CaseItem } from '@/services/cases'
import { useRealtime } from '@/hooks/use-realtime'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

export function SuccessCases() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      active: !prefersReducedMotion,
    }),
  )
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const [cases, setCases] = useState<CaseItem[]>([])

  const fetchCases = useCallback(() => {
    getCases().then(setCases).catch(console.error)
  }, [])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  useRealtime('cases', fetchCases)

  // Atualizar contagem de snaps e índice selecionado
  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setCurrentIndex(carouselApi.selectedScrollSnap())
  }, [])

  const onInitOrReInit = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setSnapCount(carouselApi.scrollSnapList().length)
    setCurrentIndex(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return

    onInitOrReInit(api)
    api.on('reInit', onInitOrReInit)
    api.on('select', onSelect)

    return () => {
      api.off('reInit', onInitOrReInit)
      api.off('select', onSelect)
    }
  }, [api, onInitOrReInit, onSelect])

  // Função para agendar retomada automática do autoplay
  const scheduleAutoplayResume = useCallback(() => {
    if (prefersReducedMotion) return
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      try {
        const autoplayPlugin = api?.plugins()?.autoplay as { play?: () => void } | undefined
        if (autoplayPlugin && typeof autoplayPlugin.play === 'function') {
          autoplayPlugin.play()
        }
      } catch {
        // Ignora caso api já tenha sido desmontada
      }
    }, 2500)
  }, [api, prefersReducedMotion])

  // Ouvir pointerUp e pointerCancel no embla para garantir retomada pós arrasto touch/mouse
  useEffect(() => {
    if (!api) return

    const handlePointerUp = () => {
      scheduleAutoplayResume()
    }

    api.on('pointerUp', handlePointerUp)

    return () => {
      api.off('pointerUp', handlePointerUp)
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [api, scheduleAutoplayResume])

  // Atualizar plugin caso preferência de movimento mude
  useEffect(() => {
    const autoplayPlugin = api?.plugins()?.autoplay as
      | { stop?: () => void; play?: () => void }
      | undefined
    if (prefersReducedMotion) {
      autoplayPlugin?.stop?.()
    } else {
      autoplayPlugin?.play?.()
    }
  }, [api, prefersReducedMotion])

  if (cases.length === 0) return null

  return (
    <section id="cases-de-sucesso" className="py-24 bg-background text-center scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Cases de sucesso
          </h2>
          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" aria-hidden="true" />
        </div>

        <div className="relative max-w-6xl mx-auto px-2 sm:px-10 md:px-12 lg:px-16">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: cases.length > 1,
            }}
            plugins={[plugin.current]}
            className="w-full relative"
            onMouseEnter={() => {
              if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
              plugin.current.stop()
            }}
            onMouseLeave={() => {
              scheduleAutoplayResume()
            }}
          >
            <CarouselContent className="-ml-4 py-4">
              {cases.map((caseItem) => {
                const imageUrl = getCaseImageUrl(caseItem)
                return (
                  <CarouselItem key={caseItem.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <Card className="h-full bg-card border-border/60 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 flex flex-col text-left group overflow-hidden">
                        {imageUrl && (
                          <div className="w-full h-48 sm:h-52 overflow-hidden bg-muted/40 flex items-center justify-center p-4 border-b border-border/40">
                            <img
                              src={imageUrl}
                              alt="Case de sucesso"
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <CardContent className="flex flex-col flex-grow p-6">
                          <p className="text-muted-foreground text-[15px] leading-relaxed whitespace-pre-line">
                            {caseItem.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            {cases.length > 1 && (
              <>
                <CarouselPrevious
                  onClick={() => {
                    scheduleAutoplayResume()
                  }}
                  aria-label="Ver case anterior"
                  className="flex left-0 sm:-left-3 md:-left-4 lg:-left-6 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/90 md:bg-background border-border shadow-md hover:bg-accent hover:text-white hover:border-accent transition-all backdrop-blur-sm"
                />
                <CarouselNext
                  onClick={() => {
                    scheduleAutoplayResume()
                  }}
                  aria-label="Ver próximo case"
                  className="flex right-0 sm:-right-3 md:-right-4 lg:-right-6 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/90 md:bg-background border-border shadow-md hover:bg-accent hover:text-white hover:border-accent transition-all backdrop-blur-sm"
                />
              </>
            )}
          </Carousel>

          {snapCount > 1 && (
            <div
              className="flex items-center justify-center gap-2 mt-6 flex-wrap"
              role="tablist"
              aria-label="Navegar entre cases de sucesso"
            >
              {Array.from({ length: snapCount }).map((_, index) => {
                const isActive = currentIndex === index
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Ir para o case ${index + 1} de ${snapCount}`}
                    onClick={() => {
                      api?.scrollTo(index)
                      scheduleAutoplayResume()
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? 'w-7 bg-primary'
                        : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                  />
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <CtaButton
            to="/quero-conhecer"
            size="lg"
            className="w-full sm:w-auto h-14 px-10 text-base font-semibold"
          >
            Quero ser um case de sucesso
          </CtaButton>
        </div>
      </div>
    </section>
  )
}
