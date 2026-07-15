import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { useRealtime } from '@/hooks/use-realtime'
import { getSegments, type Segment } from '@/services/segments'

const FALLBACK_ICONS = [
  'Building2',
  'Globe',
  'Wrench',
  'Factory',
  'Dna',
  'Tractor',
  'Truck',
  'ShoppingCart',
] as const

function resolveIcon(iconName: string, index: number): LucideIcon {
  const name = iconName || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
  const Icon = (Icons as Record<string, LucideIcon>)[name]
  return Icon || Icons.HelpCircle
}

export function Segments() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)

  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
    freezeOnceVisible: true,
  })

  const loadSegments = useCallback(async () => {
    try {
      const data = await getSegments()
      setSegments(data)
    } catch (err) {
      console.error('Failed to load segments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSegments()
  }, [loadSegments])

  useRealtime('segments', () => {
    loadSegments()
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : segments.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            Nenhum segmento disponível no momento.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16">
            {segments.map((seg, index) => {
              const Icon = resolveIcon(seg.icon, index)
              return (
                <Link
                  key={seg.id}
                  to={`/segmentos/${seg.slug}`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                >
                  <Card
                    className={cn(
                      'border-none shadow-md hover:shadow-xl transition-all duration-300',
                      'text-center group bg-background cursor-pointer',
                      'hover:-translate-y-1 hover:border-primary/20',
                    )}
                  >
                    <CardContent className="p-6 pt-8">
                      <div className="mx-auto h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                        <Icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {seg.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold">
            <Link to="/quero-conhecer">Agendar Demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
