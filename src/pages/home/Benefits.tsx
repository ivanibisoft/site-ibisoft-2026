import { Link } from 'react-router-dom'
import { Eye, Settings, TrendingDown, Maximize } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const BENEFITS = [
  {
    icon: Eye,
    title: 'Visão completa do negócio',
  },
  {
    icon: Settings,
    title: 'Automação de processos',
  },
  {
    icon: TrendingDown,
    title: 'Redução de custos',
  },
  {
    icon: Maximize,
    title: 'Escalabilidade para crescer',
  },
]

export function Benefits() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Por que usar nosso ERP?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {BENEFITS.map((benefit, idx) => (
            <Card
              key={idx}
              className="bg-background shadow-elevation border-none hover:shadow-hover transition-all duration-300 group"
            >
              <CardHeader className="items-center text-center pb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <CardTitle className="text-xl leading-tight">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="hidden" />
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold">
            <Link to="/quero-conhecer">Solicitar demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
