import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import * as Icons from 'lucide-react'
import { getModules, type Module } from '@/services/modules'

export function Features() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getModules()
      .then((data) => {
        setModules(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
            Tudo que sua empresa precisa em um só lugar
          </h2>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {modules.map((mod) => {
              const IconComponent =
                mod.icon && (Icons as any)[mod.icon] ? (Icons as any)[mod.icon] : Icons.Box
              return (
                <Link key={mod.id} to={`/funcionalidades/${mod.slug}`} className="block h-full">
                  <Card className="hover:border-accent/50 transition-colors group border-border h-full">
                    <CardHeader className="pb-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <CardTitle className="text-lg">{mod.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{mod.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold">
            <Link to="/quero-conhecer">Quero usar na minha empresa</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
