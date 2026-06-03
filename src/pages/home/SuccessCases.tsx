import { useRef, useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFeaturedCases } from '@/services/cases'
import pb from '@/lib/pocketbase/client'

export function SuccessCases() {
  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    getFeaturedCases().then(setCases).catch(console.error)
  }, [])

  if (cases.length === 0) return null

  const getLogo = (category: string) => {
    const map: Record<string, string> = {
      Distribuição: 'https://img.usecurling.com/i?q=distribution&color=blue&shape=fill',
      Agronegócio: 'https://img.usecurling.com/i?q=agriculture&color=green&shape=fill',
      Indústria: 'https://img.usecurling.com/i?q=industry&color=gray&shape=fill',
      'Comércio Exterior': 'https://img.usecurling.com/i?q=globe&color=cyan&shape=outline',
      Serviços: 'https://img.usecurling.com/i?q=technology&color=blue&shape=outline',
    }
    return map[category] || 'https://img.usecurling.com/i?q=business&color=gray&shape=fill'
  }

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
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4 py-4">
              {cases.map((caseItem) => (
                <CarouselItem key={caseItem.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="h-full bg-card border-border/60 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 flex flex-col text-left group">
                      <CardHeader className="pb-4">
                        <div className="h-12 w-auto mb-6 flex items-center justify-start">
                          <img
                            src={
                              caseItem.image
                                ? pb.files.getUrl(caseItem, caseItem.image)
                                : getLogo(caseItem.category)
                            }
                            alt={`Logo ${caseItem.client_name}`}
                            className="h-10 w-auto object-contain max-w-[120px] grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                        </div>
                        <CardTitle className="text-xl leading-tight text-foreground">
                          {caseItem.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                        <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 flex-grow">
                          {caseItem.description}
                        </p>
                        <p className="text-sm font-medium text-accent mt-auto">
                          {caseItem.client_name}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 h-10 w-10 border-border shadow-sm hover:bg-accent hover:text-white hover:border-accent transition-colors" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 h-10 w-10 border-border shadow-sm hover:bg-accent hover:text-white hover:border-accent transition-colors" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
