import { useRef, useEffect, useState, useCallback } from 'react'
import { Megaphone } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getActiveTestimonials, type Testimonial } from '@/services/testimonials'
import { useRealtime } from '@/hooks/use-realtime'

export function SocialProof() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const loadTestimonials = useCallback(async () => {
    const data = await getActiveTestimonials()
    setTestimonials(data)
  }, [])

  useEffect(() => {
    loadTestimonials()
  }, [loadTestimonials])

  useRealtime('testimonials', () => {
    loadTestimonials()
  })

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 bg-muted/20 text-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            O que nossos clientes dizem
          </h2>
          <Megaphone className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" aria-hidden="true" />
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
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="h-full bg-background border-border/60 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300">
                      <CardContent className="p-8 flex flex-col h-full text-left">
                        <div className="mb-8 flex-grow">
                          <p className="text-foreground/80 leading-relaxed text-[15px]">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4 pt-6 border-t border-border/50 mt-auto">
                          <Avatar className="h-12 w-12 border border-border/50">
                            <AvatarImage
                              src={`https://img.usecurling.com/ppl/medium?gender=${
                                Math.abs(
                                  testimonial.name.charCodeAt(0) -
                                    testimonial.name.charCodeAt(testimonial.name.length - 1),
                                ) % 2 === 0
                                  ? 'male'
                                  : 'female',
                              }&seed=${testimonial.id.slice(0, 6)}`}
                              alt={testimonial.name}
                            />
                            <AvatarFallback className="bg-primary/5 text-primary font-medium">
                              {testimonial.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            {testimonial.role && (
                              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                {testimonial.role}
                              </p>
                            )}
                          </div>
                        </div>
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
