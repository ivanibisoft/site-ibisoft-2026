import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Icons from 'lucide-react'
import {
  getModules,
  getModuleHierarchy,
  type Module,
  type ResourceGroup,
  type Resource,
} from '@/services/modules'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useRealtime } from '@/hooks/use-realtime'

export default function Functionality() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [allModules, setAllModules] = useState<Module[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [data, setData] = useState<{
    moduleData: Module
    groups: ResourceGroup[]
    resources: Resource[]
  } | null>(null)

  const loadAllModules = useCallback(async () => {
    try {
      const modules = await getModules()
      setAllModules(modules)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadAllModules()
  }, [loadAllModules])

  const loadData = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    try {
      const result = await getModuleHierarchy(slug)
      setData(result)
    } catch (err) {
      console.error(err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('modules', (e) => {
    if (e.action === 'update') {
      setData((prev) => {
        if (prev && e.record.id === prev.moduleData.id) {
          return { ...prev, moduleData: e.record as unknown as Module }
        }
        return prev
      })
      loadAllModules()
    } else if (e.action === 'delete') {
      setData((prev) => {
        if (prev && e.record.id === prev.moduleData.id) {
          return null
        }
        return prev
      })
      loadAllModules()
    } else if (e.action === 'create') {
      loadAllModules()
    }
  })

  useRealtime('resource_groups', () => {
    loadData()
  })

  useRealtime('resources', () => {
    loadData()
  })

  const NavItems = () => (
    <nav className="space-y-1">
      {allModules.map((mod) => {
        const ModIcon = mod.icon && (Icons as any)[mod.icon] ? (Icons as any)[mod.icon] : Icons.Box
        return (
          <NavLink
            key={mod.id}
            to={`/funcionalidades/${mod.slug}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
              )
            }
          >
            <ModIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{mod.name}</span>
          </NavLink>
        )
      })}
    </nav>
  )

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] bg-slate-50">
        <aside className="hidden md:block w-72 border-r border-border bg-white p-6 shrink-0">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8 space-y-8 max-w-4xl mx-auto w-full">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </main>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] bg-slate-50 items-center justify-center w-full">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Funcionalidade não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            O módulo que você tentou acessar não existe ou foi removido.
          </p>
          <Link to="/">
            <Button>Voltar para o início</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { moduleData, groups, resources } = data
  const Icon =
    moduleData.icon && (Icons as any)[moduleData.icon] ? (Icons as any)[moduleData.icon] : Icons.Box

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-slate-50 items-stretch">
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-white shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Funcionalidades
          </h2>
          <NavItems />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <div className="md:hidden sticky top-[72px] z-20 bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Icon className="h-5 w-5" />
            <span className="truncate">{moduleData.name}</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Menu className="h-4 w-4" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle>Módulos</SheetTitle>
                <SheetDescription className="sr-only">
                  Navegação de módulos do sistema
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 animate-fade-in">
          <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
            <div className="container relative z-10 max-w-4xl mx-auto px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8 backdrop-blur-sm border border-white/10">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">
                {moduleData.name}
              </h1>
              <div className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl whitespace-pre-line">
                {moduleData.description}
              </div>
              <Link to="/quero-conhecer">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg"
                >
                  Agendar Demonstração do Módulo
                </Button>
              </Link>
            </div>
          </section>

          {groups.length > 0 && (
            <section className="py-16">
              <div className="container max-w-4xl mx-auto px-6 space-y-16">
                {groups.map((group) => {
                  const groupResources = resources.filter((r) => r.group === group.id)
                  if (groupResources.length === 0) return null

                  return (
                    <div key={group.id}>
                      <h2 className="text-2xl font-bold mb-8 text-primary">{group.name}</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        {groupResources.map((resource) => (
                          <Card key={resource.id} className="shadow-none border-border bg-white">
                            <CardHeader>
                              <CardTitle className="text-lg text-foreground">
                                {resource.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground leading-relaxed text-sm">
                                {resource.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
