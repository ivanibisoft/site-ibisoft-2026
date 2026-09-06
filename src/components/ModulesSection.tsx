import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getModules, type Module } from '@/services/modules'
import { useRealtime } from '@/hooks/use-realtime'

export function ModulesSection() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  const loadModules = async () => {
    const data = await getModules()
    setModules(data)
    setLoading(false)
  }

  useEffect(() => {
    loadModules()
  }, [])

  useRealtime('modules', () => {
    loadModules()
  })

  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Layers className="h-4 w-4" /> Módulos do Sistema
          </div>
          <h2 className="text-3xl font-bold mb-4">Conheça os Módulos do ERP ibisoft</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma visão geral dos módulos que compõem nosso sistema de gestão, numerados em sequência
            lógica para facilitar o seu entendimento.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const IconComponent =
                module.icon && (Icons as any)[module.icon] ? (Icons as any)[module.icon] : Icons.Box

              return (
                <Link key={module.id} to={`/funcionalidades/${module.slug}`}>
                  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 group h-full flex flex-col justify-between">
                    <div className="absolute -top-3 -right-3 text-8xl font-bold text-primary/5 select-none pointer-events-none leading-none">
                      {index + 1}
                    </div>
                    <CardHeader className="relative z-10 pb-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                        {module.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {module.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-accent mt-4">
                        Saiba mais{' '}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
