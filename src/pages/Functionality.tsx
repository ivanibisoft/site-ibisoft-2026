import { useEffect, useState } from 'react'
import { useParams, Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Settings2, Menu } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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

  useEffect(() => {
    getModules().then(setAllModules).catch(console.error)
  }, [])

  useEffect(() => {
    async function load() {
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
    }
    load()
  }, [slug])

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
      <div className="flex min-h-[calc(100vh-72px)] bg-slate-50 items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Módulo não encontrado</h2>
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-white shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Funcionalidades
          </h2>
          <NavItems />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Mobile Header Menu Trigger */}
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
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
            <div className="container relative z-10 max-w-4xl mx-auto px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8 backdrop-blur-sm border border-white/10">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">
                {moduleData.name}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl">
                O sistema de ERP 'ibisoft Empresas' foi desenvolvido com o objetivo de fornecer uma
                solução completa e integrada para a gestão empresarial.
              </p>
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

          {/* ERP Overview Sections */}
          <section className="py-16 bg-white border-b border-border">
            <div className="container max-w-4xl mx-auto px-6 space-y-16">
              {/* Gestão Integrada e Eficiente */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-primary">
                  Gestão Integrada e Eficiente
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="shadow-none bg-slate-50 border-none">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                        <Icons.Network className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        Informações Relevantes
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Todas as informações relevantes ao negócio são geradas, disponibilizadas e
                        avaliadas pelos colaboradores de maneira rápida e eficiente. Isso
                        proporciona uma visão simples e completa das informações, essenciais para a
                        tomada de decisões pelos gestores.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none bg-slate-50 border-none">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                        <Icons.BarChart3 className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">Tomada de Decisões</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Com dados precisos e atualizados, os gestores podem tomar decisões
                        informadas e estratégicas, resultando em melhores resultados para todos os
                        departamentos da empresa, tanto nas atividades operacionais quanto nas
                        gerenciais e estratégicas.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Modelo Multi-Empresa */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-primary">Modelo Multi-Empresa</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="shadow-none bg-slate-50 border-none">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                        <Icons.Building2 className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        Visão Individual e Geral
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        O sistema permite uma visão individual de cada empresa do grupo, bem como
                        uma visão geral de todas as empresas administradas. Isso facilita o controle
                        e a análise de desempenho de cada unidade de negócio.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none bg-slate-50 border-none">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                        <Icons.ShieldCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        Controle Simplificado
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        O modelo funcional do 'ibisoft Empresas' permite controlar de maneira
                        simples as informações comerciais, financeiras e de estoques de cada empresa
                        individualmente e do grupo como um todo.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Benefícios para Todos os Departamentos */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-primary">
                  Benefícios para Todos os Departamentos
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-secondary/10 text-secondary">
                        <Icons.Cog className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">Operacional</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Melhoria na eficiência das operações diárias, com processos automatizados e
                        integrados.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-secondary/10 text-secondary">
                        <Icons.PieChart className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">Gerencial</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ferramentas de análise e relatórios detalhados que auxiliam na gestão e no
                        planejamento estratégico.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-secondary/10 text-secondary">
                        <Icons.Target className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">Estratégico</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Visão holística do negócio, permitindo a identificação de oportunidades e a
                        mitigação de riscos.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recursos Adicionais */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-primary">Recursos Adicionais</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent-foreground">
                        <Icons.LayoutDashboard className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">
                        Interface Intuitiva
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Interface amigável e intuitiva, facilitando a adoção e o uso do sistema por
                        todos os colaboradores.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent-foreground">
                        <Icons.Sliders className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">Customização</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Possibilidade de customização para atender às necessidades específicas de
                        cada empresa.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-border">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent-foreground">
                        <Icons.Headset className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">
                        Suporte e Atualizações
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Suporte técnico especializado e atualizações constantes para garantir que o
                        sistema esteja sempre alinhado com as melhores práticas do mercado.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section className="py-16"></section>
        </main>
      </div>
    </div>
  )
}
