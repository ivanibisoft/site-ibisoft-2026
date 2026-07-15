import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">
            {modules.map((mod) => {
              const IconComponent =
                mod.icon && (Icons as any)[mod.icon] ? (Icons as any)[mod.icon] : Icons.Box
              return (
                <Link key={mod.id} to={`/funcionalidades/${mod.slug}`} className="block h-full">
                  <Card className="flex flex-col items-center justify-center gap-4 p-6 text-center hover:border-accent/50 hover:shadow-md transition-all duration-200 group border-border h-full min-h-[140px]">
                    <div className="h-14 w-14 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <IconComponent className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                      {mod.name}
                    </span>
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
