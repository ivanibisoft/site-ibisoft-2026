import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Loader2, HelpCircle } from 'lucide-react'
import * as Icons from 'lucide-react'
import {
  getSegmentBySlug,
  getSegmentChallenges,
  type Segment as SegmentType,
  type SegmentChallenge,
} from '@/services/segments'
import useRealtime from '@/hooks/use-realtime'

export default function Segment() {
  const { slug } = useParams()
  const [segment, setSegment] = useState<SegmentType | null>(null)
  const [challenges, setChallenges] = useState<SegmentChallenge[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!slug) return
    try {
      setLoading(true)
      const seg = await getSegmentBySlug(slug)
      setSegment(seg)

      const chals = await getSegmentChallenges(seg.id)
      setChallenges(chals)
    } catch (err) {
      console.error('Failed to load segment data:', err)
      setSegment(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug])

  useRealtime(
    'segment_challenges',
    () => {
      if (segment?.id) {
        getSegmentChallenges(segment.id).then(setChallenges).catch(console.error)
      }
    },
    !!segment?.id,
  )

  if (loading) {
    return (
      <div className="container py-24 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!segment) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Segmento não encontrado</h1>
        <p className="text-muted-foreground mb-8">
          O segmento que você está procurando não existe ou foi removido.
        </p>
        <Link to="/">
          <Button variant="outline">Voltar para a página inicial</Button>
        </Link>
      </div>
    )
  }

  const Icon = (Icons as any)[segment.icon] || HelpCircle

  return (
    <div className="animate-fade-in">
      <section className="bg-muted py-20 border-b">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Icon className="h-4 w-4" /> Soluções por Segmento
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              ERP para <span className="text-secondary">{segment.title}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {segment.description}
            </p>
            <Link to={`/quero-conhecer?segmento=${segment.slug}`}>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Falar com Especialista do Setor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={`https://img.usecurling.com/p/800/600?q=${segment.title.split(' ')[0]}&color=blue`}
              alt={segment.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Como a ibisoft resolve seus desafios
          </h2>
          {challenges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {challenges.map((challenge, index) => {
                const num = challenge.order || index + 1
                const cleanTitle = challenge.title.replace(/^\d+\.\s*/, '')

                return (
                  <div
                    key={challenge.id}
                    className="flex gap-5 p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <CheckCircle2 className="h-7 w-7 text-accent shrink-0 mt-1" />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-xl mb-3 leading-tight text-primary">
                        {num}. {cleanTitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Nenhum desafio cadastrado para este segmento ainda.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
