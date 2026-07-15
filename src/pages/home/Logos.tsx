import { useRef, useEffect, useState, useMemo } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { ThumbsUp, CheckCircle2, Building2 } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  getActivePartnerLogos,
  getLogoUrl,
  type PartnerLogoWithExpand,
} from '@/services/partner-logos'
import { getSegments, type Segment } from '@/services/segments'

const FALLBACK_LOGOS = [
  'google',
  'microsoft',
  'apple',
  'amazon',
  'facebook',
  'netflix',
  'spotify',
  'tesla',
  'ibm',
  'oracle',
  'intel',
  'cisco',
  'hp',
  'dell',
  'adobe',
  'salesforce',
  'sap',
  'vmware',
  'nvidia',
]

export function Logos() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))
  const [logos, setLogos] = useState<PartnerLogoWithExpand[]>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [selectedSegment, setSelectedSegment] = useState<string>('all')

  useEffect(() => {
    getActivePartnerLogos().then(setLogos)
    getSegments().then(setSegments)
  }, [])

  const useFallback = logos.length === 0

  const segmentsWithLogos = useMemo(() => {
    if (useFallback) return []
    return segments.filter((s) => logos.some((l) => l.segment === s.id))
  }, [segments, logos, useFallback])

  const filteredLogos = useMemo(() => {
    if (useFallback || selectedSegment === 'all') return logos
    return logos.filter((l) => l.segment === selectedSegment)
  }, [logos, selectedSegment, useFallback])

  const items = useFallback
    ? FALLBACK_LOGOS.map((name, i) => ({
        id: `fb-${i}`,
        name,
        url: `https://img.usecurling.com/i?q=${name}&color=multicolor&shape=fill`,
      }))
    : filteredLogos.map((l) => ({ id: l.id, name: l.name, url: getLogoUrl(l) }))

  const showFilter = !useFallback && segmentsWithLogos.length > 0
  const showEmptyState = !useFallback && filteredLogos.length === 0

  return (
    <section className="py-20 bg-background overflow-hidden border-t border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-primary">
            Empresas que aprovaram o nosso sistema
          </h2>
          <div
            className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 border border-primary/10 shadow-sm flex-shrink-0"
            aria-label="Selo de Aprovação"
          >
            <ThumbsUp className="h-6 w-6 md:h-7 md:w-7 text-primary" strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-[2px]">
              <CheckCircle2
                className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-500 fill-green-600/10 dark:fill-green-500/10"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="flex justify-center mb-10 px-2">
            <ToggleGroup
              type="single"
              value={selectedSegment}
              onValueChange={(val) => {
                setSelectedSegment(val || 'all')
              }}
              className="flex flex-wrap justify-center gap-2"
            >
              <ToggleGroupItem
                value="all"
                aria-label="Todos os segmentos"
                className="rounded-full px-4 py-2 text-sm font-medium"
              >
                Todos
              </ToggleGroupItem>
              {segmentsWithLogos.map((seg) => (
                <ToggleGroupItem
                  key={seg.id}
                  value={seg.id}
                  aria-label={seg.title}
                  className="rounded-full px-4 py-2 text-sm font-medium"
                >
                  {seg.title}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" strokeWidth={1.5} />
            <p className="text-lg text-muted-foreground">
              Nenhum parceiro encontrado para este segmento
            </p>
          </div>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            <Carousel
              key={selectedSegment}
              opts={{
                align: 'start',
                loop: true,
                dragFree: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="flex items-center -ml-16 md:-ml-24 lg:-ml-32">
                {items.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-16 md:pl-24 lg:pl-32 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 shrink-0"
                  >
                    <div className="flex items-center justify-center p-6 md:p-10 lg:p-14 group">
                      <img
                        src={item.url}
                        alt={`Logo ${item.name}`}
                        className="h-16 md:h-20 lg:h-24 w-auto object-contain max-w-[180px] md:max-w-[220px] opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 animate-fade-in"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  )
}
