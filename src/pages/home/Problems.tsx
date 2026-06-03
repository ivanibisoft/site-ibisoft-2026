import { Link } from 'react-router-dom'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PROBLEMS = [
  'Controles usando planilhas',
  'Falta de controle financeiro',
  'Estoque desorganizado',
  'Erros fiscais',
]

export function Problems() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Sua empresa enfrenta esses problemas?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {PROBLEMS.map((problem, idx) => (
            <Card
              key={idx}
              className="border-destructive/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <XCircle className="h-8 w-8 text-destructive shrink-0" />
                <span className="text-lg font-medium">{problem}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center shadow-xl animate-fade-in-up flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-2xl md:text-3xl font-bold">
            <CheckCircle2 className="h-10 w-10 text-accent shrink-0" />
            <span>Nosso ERP resolve tudo isso</span>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold">
            <Link to="/quero-conhecer">Eliminar erros e retrabalho</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
