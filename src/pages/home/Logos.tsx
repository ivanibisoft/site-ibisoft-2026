import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { ThumbsUp, CheckCircle2 } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const LOGOS = [
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

        <div className="relative max-w-6xl mx-auto">
          {/* Fading gradients for smooth edge appearance */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          <Carousel
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
            <CarouselContent className="flex items-center -ml-4 md:-ml-8">
              {LOGOS.map((logo, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-8 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 shrink-0"
                >
                  <div className="flex items-center justify-center p-2 group">
                    <img
                      src={`https://img.usecurling.com/i?q=${logo}&color=multicolor&shape=fill`}
                      alt={`Logo ${logo}`}
                      className="h-10 md:h-12 w-auto object-contain max-w-[120px] opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
