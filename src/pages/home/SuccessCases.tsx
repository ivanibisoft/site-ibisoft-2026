import { useRef, useEffect, useState, useCallback } from 'react'
import { Trophy } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { getCases, getCaseImageUrl, type CaseItem } from '@/services/cases'
import { useRealtime } from '@/hooks/use-realtime'

export function SuccessCases() {
  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))
  const [cases, setCases] = useState<CaseItem[]>([])

  const fetchCases = useCallback(() => {
    getCases().then(setCases).catch(console.error)
  }, [])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  useRealtime('cases', fetchCases)

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

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <Carousel
            opts={{
              align: 'start',
              loop: cases.length > 1,
            }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
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
                <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 h-10 w-10 border-border shadow-sm hover:bg-accent hover:text-white hover:border-accent transition-colors" />
                <CarouselNext className="hidden md:flex -right-4 lg:-right-6 h-10 w-10 border-border shadow-sm hover:bg-accent hover:text-white hover:border-accent transition-colors" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  )
}
