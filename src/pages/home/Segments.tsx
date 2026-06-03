import { Link } from 'react-router-dom'
import { SEGMENTS } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

export function Segments() {
  const targetSegmentIds = [
    'atacadista-distribuidora',
    'comercio-exterior',
    'servicos',
    'industria',
    'genetica-animal',
  ]

  const filteredSegments = SEGMENTS.filter((s) => targetSegmentIds.includes(s.id))

  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
    freezeOnceVisible: true,
  })

  return (
    <section
      ref={sectionRef}
      className={cn(
        'py-24 bg-secondary/20 border-y border-border/50 shadow-[inset_0_40px_40px_-40px_rgba(0,0,0,0.03)]',
        isVisible ? 'animate-fade-in-up' : 'opacity-0',
      )}
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Para quem é o nosso ERP?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16">
          {filteredSegments.map((seg) => (
            <Card
              key={seg.id}
              className="border-none shadow-md hover:shadow-lg transition-shadow text-center group bg-background"
            >
              <CardContent className="p-6 pt-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <seg.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-bold text-foreground">{seg.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold">
            <Link to="/quero-conhecer">Agendar Demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
