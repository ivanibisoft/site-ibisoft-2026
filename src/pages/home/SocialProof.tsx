import { useRef } from 'react'
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

const TESTIMONIALS = [
  {
    name: 'Carlos Eduardo',
    company: 'Atacadão Central',
    text: 'O ERP transformou a maneira como gerenciamos nosso estoque. Reduzimos perdas em 30% já nos primeiros três meses e a visibilidade operacional melhorou drasticamente.',
    image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
  },
  {
    name: 'Mariana Silva',
    company: 'TechSolutions',
    text: 'A integração financeira e fiscal nos poupou incontáveis horas de trabalho manual. A equipe de suporte da ibisoft é excepcional e sempre nos ajuda prontamente.',
    image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
  },
  {
    name: 'Roberto Mendes',
    company: 'Indústria Alpha',
    text: 'Escalabilidade era nosso maior desafio. Com este sistema, conseguimos dobrar nossa produção sem perder o controle dos custos e mantendo a qualidade.',
    image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=3',
  },
  {
    name: 'Ana Luiza',
    company: 'Global Import Export',
    text: 'A visão completa do negócio que o dashboard oferece mudou nossa forma de tomar decisões estratégicas. O fluxo de caixa nunca foi tão previsível e seguro.',
    image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=4',
  },
  {
    name: 'Fernando Costa',
    company: 'AgroGenética Pecuária',
    text: 'Controlar a rastreabilidade nunca foi tão simples. O sistema atende perfeitamente às especificidades do nosso setor com um nível de detalhes incrível.',
    image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=5',
  },
  {
    name: 'Juliana Martins',
    company: 'Serviços Express',
    text: 'Automatizar a emissão de notas fiscais e boletos foi um divisor de águas. Não imagino nossa rotina sem o sistema hoje, ganhamos muita agilidade no faturamento.',
    image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=6',
  },
]

export function SocialProof() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

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
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="h-full bg-background border-border/60 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300">
                      <CardContent className="p-8 flex flex-col h-full text-left">
                        <div className="mb-8 flex-grow">
                          <p className="text-foreground/80 leading-relaxed text-[15px]">
                            "{testimonial.text}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4 pt-6 border-t border-border/50 mt-auto">
                          <Avatar className="h-12 w-12 border border-border/50">
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            <AvatarFallback className="bg-primary/5 text-primary font-medium">
                              {testimonial.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">
                              {testimonial.company}
                            </p>
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
