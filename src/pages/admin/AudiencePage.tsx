import { useState, useEffect, useMemo, useTransition } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  Users,
  Eye,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Layers,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { getAudienceHookVersion, HookVersionResponse } from '@/services/audience'

export interface AudienceEventRecord {
  id: string
  session_id: string
  visitor_id: string
  path: string
  section: string
  title: string
  blog_slug: string
  device_type: 'pc' | 'smartphone' | 'tablet' | string
  uf: string
  city: string
  country: string
  access_hour: number
  access_year_month: string
  access_date: string
  referrer: string
  created: string
}

// Cores da identidade visual ibisoft (tons de azul profundo, ciano, esmeralda, índigo)
const COLORS = {
  primary: '#0284c7', // Sky 600
  secondary: '#0ea5e9', // Sky 500
  accent: '#2563eb', // Blue 600
  emerald: '#10b981', // Emerald 500
  indigo: '#6366f1', // Indigo 500
  amber: '#f59e0b', // Amber 500
  slate: '#64748b', // Slate 500
  purple: '#8b5cf6', // Violet 500
}

const PIE_COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#818cf8', '#a855f7']

export default function AudiencePage() {
  const [events, setEvents] = useState<AudienceEventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [hookInfo, setHookInfo] = useState<HookVersionResponse | null>(null)
  const [, startTransition] = useTransition()

  // Filtros
  const [periodFilter, setPeriodFilter] = useState<'this-month' | '30-days' | '90-days' | 'all'>(
    '30-days',
  )
  const [ufFilter, setUfFilter] = useState<string>('all')
  const [deviceFilter, setDeviceFilter] = useState<string>('all')
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAudienceData = async () => {
    setLoading(true)
    try {
      // Buscar versão do hook
      const version = await getAudienceHookVersion()
      setHookInfo(version)

      // Buscar eventos salvos (máximo 5000 para análise analítica no browser)
      const records = await pb.collection('audience_events').getFullList<AudienceEventRecord>({
        sort: '-created',
        batch: 500,
      })
      setEvents(records)
    } catch (err) {
      console.error('[Audience] Falha ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudienceData()
  }, [])

  // Lista de UFs presentes nos dados para o filtro
  const availableUfs = useMemo(() => {
    const set = new Set<string>()
    events.forEach((e) => {
      if (e.uf) set.add(e.uf)
    })
    return Array.from(set).sort()
  }, [events])

  // Lista de Seções presentes nos dados para o filtro
  const availableSections = useMemo(() => {
    const set = new Set<string>()
    events.forEach((e) => {
      if (e.section) set.add(e.section)
    })
    return Array.from(set).sort()
  }, [events])

  // Filtragem dos eventos
  const filteredEvents = useMemo(() => {
    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = String(now.getMonth() + 1).padStart(2, '0')
    const currentYM = `${nowYear}-${nowMonth}`

    const cutoff30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const cutoff90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    return events.filter((ev) => {
      const evDate = new Date(ev.created || ev.access_date)

      // Filtro de período
      if (periodFilter === 'this-month') {
        if (ev.access_year_month !== currentYM) return false
      } else if (periodFilter === '30-days') {
        if (evDate < cutoff30Days) return false
      } else if (periodFilter === '90-days') {
        if (evDate < cutoff90Days) return false
      }

      // Filtro de UF
      if (ufFilter !== 'all' && ev.uf !== ufFilter) {
        return false
      }

      // Filtro de Dispositivo
      if (deviceFilter !== 'all' && ev.device_type !== deviceFilter) {
        return false
      }

      // Filtro de Seção
      if (sectionFilter !== 'all' && ev.section !== sectionFilter) {
        return false
      }

      // Filtro de Busca textual (página, post ou título)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchesPath = ev.path?.toLowerCase().includes(term)
        const matchesTitle = ev.title?.toLowerCase().includes(term)
        const matchesBlog = ev.blog_slug?.toLowerCase().includes(term)
        if (!matchesPath && !matchesTitle && !matchesBlog) {
          return false
        }
      }

      return true
    })
  }, [events, periodFilter, ufFilter, deviceFilter, sectionFilter, searchTerm])

  // KPIs Resumo
  const kpis = useMemo(() => {
    const totalVisits = filteredEvents.length
    const uniqueVisitors = new Set(filteredEvents.map((e) => e.visitor_id)).size
    const uniqueSessions = new Set(filteredEvents.map((e) => e.session_id)).size

    // Página mais visitada
    const pathCounts: Record<string, { count: number; title: string }> = {}
    filteredEvents.forEach((e) => {
      const key = e.path || '/'
      if (!pathCounts[key]) {
        pathCounts[key] = { count: 0, title: e.title || key }
      }
      pathCounts[key].count += 1
    })

    let topPage = '-'
    let topPageCount = 0
    Object.entries(pathCounts).forEach(([path, data]) => {
      if (data.count > topPageCount) {
        topPageCount = data.count
        topPage = path
      }
    })

    // Dispositivo predominante
    const devCounts = { pc: 0, smartphone: 0, tablet: 0 }
    filteredEvents.forEach((e) => {
      if (e.device_type === 'smartphone') devCounts.smartphone += 1
      else if (e.device_type === 'tablet') devCounts.tablet += 1
      else devCounts.pc += 1
    })

    const topDevice =
      devCounts.smartphone > devCounts.pc ? 'Smartphone' : devCounts.pc > 0 ? 'Desktop / PC' : '-'

    return {
      totalVisits,
      uniqueVisitors,
      uniqueSessions,
      topPage,
      topPageCount,
      topDevice,
    }
  }, [filteredEvents])

  // 1. Gráfico de Evolução Mês a Mês (com opção de comparar seções)
  const monthlyData = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    const sectionsSet = new Set<string>()

    filteredEvents.forEach((e) => {
      const ym = e.access_year_month || (e.created ? e.created.slice(0, 7) : '2026-09')
      const sec = e.section || 'Outros'
      sectionsSet.add(sec)

      if (!map[ym]) {
        map[ym] = { total: 0 }
      }
      map[ym].total = (map[ym].total || 0) + 1
      map[ym][sec] = (map[ym][sec] || 0) + 1
    })

    const sortedMonths = Object.keys(map).sort()
    return sortedMonths.map((ym) => {
      const [year, month] = ym.split('-')
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ]
      const label = `${monthNames[parseInt(month, 10) - 1] || month}/${year.slice(2)}`

      return {
        monthKey: ym,
        label,
        ...map[ym],
      }
    })
  }, [filteredEvents])

  // Seções mais frequentes para plotar linhas no gráfico mês a mês
  const topSectionsForLines = useMemo(() => {
    const secCounts: Record<string, number> = {}
    filteredEvents.forEach((e) => {
      const s = e.section || 'Outros'
      secCounts[s] = (secCounts[s] || 0) + 1
    })
    return Object.entries(secCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([s]) => s)
  }, [filteredEvents])

  // 2. Gráfico de Setor (Pizza): PC x Smartphone x Tablet
  const devicePieData = useMemo(() => {
    let pc = 0
    let smartphone = 0
    let tablet = 0

    filteredEvents.forEach((e) => {
      if (e.device_type === 'smartphone') smartphone += 1
      else if (e.device_type === 'tablet') tablet += 1
      else pc += 1
    })

    const total = pc + smartphone + tablet
    if (total === 0) return []

    return [
      { name: 'PC / Desktop', value: pc, percent: Math.round((pc / total) * 100) },
      { name: 'Smartphone', value: smartphone, percent: Math.round((smartphone / total) * 100) },
      { name: 'Tablet', value: tablet, percent: Math.round((tablet / total) * 100) },
    ].filter((item) => item.value > 0)
  }, [filteredEvents])

  // 3. Gráfico de Barras: Interesse por Seção
  const sectionBarData = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredEvents.forEach((e) => {
      const sec = e.section || 'Outros'
      counts[sec] = (counts[sec] || 0) + 1
    })

    return Object.entries(counts)
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [filteredEvents])

  // 4. Distribuição por Horário do Dia (0 a 23h)
  const hourlyData = useMemo(() => {
    const hours: number[] = Array.from({ length: 24 }, () => 0)
    filteredEvents.forEach((e) => {
      let h = e.access_hour
      if (typeof h !== 'number' || isNaN(h)) {
        if (e.created) {
          h = new Date(e.created).getHours()
        } else {
          h = 0
        }
      }
      if (h >= 0 && h <= 23) {
        hours[h] += 1
      }
    })

    return hours.map((count, hour) => ({
      hour: `${String(hour).padStart(2, '0')}h`,
      visitas: count,
    }))
  }, [filteredEvents])

  // 5. Ranking: Páginas Mais Visitadas
  const topPagesRanking = useMemo(() => {
    const map: Record<
      string,
      { path: string; title: string; section: string; count: number; visitors: Set<string> }
    > = {}
    filteredEvents.forEach((e) => {
      const path = e.path || '/'
      if (!map[path]) {
        map[path] = {
          path,
          title: e.title || path,
          section: e.section || 'Outros',
          count: 0,
          visitors: new Set(),
        }
      }
      map[path].count += 1
      if (e.visitor_id) {
        map[path].visitors.add(e.visitor_id)
      }
    })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [filteredEvents])

  // 6. Ranking: UFs Mais Presentes
  const topUfsRanking = useMemo(() => {
    const map: Record<string, { uf: string; count: number; visitors: Set<string> }> = {}
    filteredEvents.forEach((e) => {
      const uf = e.uf || 'PR'
      if (!map[uf]) {
        map[uf] = { uf, count: 0, visitors: new Set() }
      }
      map[uf].count += 1
      if (e.visitor_id) {
        map[uf].visitors.add(e.visitor_id)
      }
    })

    const total = filteredEvents.length || 1

    return Object.values(map)
      .map((item) => ({
        uf: item.uf,
        count: item.count,
        uniqueVisitors: item.visitors.size,
        percentage: Math.round((item.count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [filteredEvents])

  // 7. Posts do Blog Mais Lidos
  const topBlogPostsRanking = useMemo(() => {
    const map: Record<
      string,
      { slug: string; title: string; count: number; visitors: Set<string> }
    > = {}
    filteredEvents
      .filter((e) => e.blog_slug || e.path?.startsWith('/blog/'))
      .forEach((e) => {
        const slug = e.blog_slug || e.path.replace(/^\/blog\//, '').split('/')[0]
        if (!slug) return
        if (!map[slug]) {
          map[slug] = {
            slug,
            title: e.title?.replace('Post do Blog (', '').replace(')', '') || slug,
            count: 0,
            visitors: new Set(),
          }
        }
        map[slug].count += 1
        if (e.visitor_id) {
          map[slug].visitors.add(e.visitor_id)
        }
      })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [filteredEvents])

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-lexend">
              Audiência do Site
            </h1>
            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
              100% Anônimo &amp; LGPD
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Métricas de interesse dos visitantes, classificação geográfica por UF, horários e
            aparelhos usados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hookInfo ? (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Serviço ativo (v{hookInfo.version})</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Modo direto ativo</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAudienceData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-medium shrink-0">
              <Filter className="w-4 h-4 text-primary" />
              <span>Filtros analíticos:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 max-w-4xl">
              {/* Filtro Período */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Período
                </label>
                <Select
                  value={periodFilter}
                  onValueChange={(val: any) =>
                    startTransition(() => {
                      setPeriodFilter(val)
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">Mês Atual</SelectItem>
                    <SelectItem value="30-days">Últimos 30 dias</SelectItem>
                    <SelectItem value="90-days">Últimos 90 dias</SelectItem>
                    <SelectItem value="all">Todo o Histórico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro UF */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Estado (UF)
                </label>
                <Select
                  value={ufFilter}
                  onValueChange={(val) =>
                    startTransition(() => {
                      setUfFilter(val)
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Todas as UFs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as UFs</SelectItem>
                    {availableUfs.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Dispositivo */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Monitor className="w-3 h-3" /> Aparelho
                </label>
                <Select
                  value={deviceFilter}
                  onValueChange={(val) =>
                    startTransition(() => {
                      setDeviceFilter(val)
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Todos os aparelhos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Aparelhos</SelectItem>
                    <SelectItem value="pc">PC / Desktop</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Seção */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Seção
                </label>
                <Select
                  value={sectionFilter}
                  onValueChange={(val) =>
                    startTransition(() => {
                      setSectionFilter(val)
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Todas as seções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Seções</SelectItem>
                    {availableSections.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campo de Busca Livre */}
            <div className="relative min-w-[180px] lg:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar páginas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartões Resumo (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Visitas */}
        <Card className="hover:shadow-sm transition-shadow border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Visitas Registradas
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-lexend">
                  {kpis.totalVisits.toLocaleString('pt-BR')}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Total de navegações no filtro
            </p>
          </CardContent>
        </Card>

        {/* Visitantes Únicos */}
        <Card className="hover:shadow-sm transition-shadow border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Visitantes Únicos
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-lexend">
                  {kpis.uniqueVisitors.toLocaleString('pt-BR')}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Distintos e 100% anônimos
            </p>
          </CardContent>
        </Card>

        {/* Página Mais Visitada */}
        <Card className="hover:shadow-sm transition-shadow border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Página Mais Visitada
                </p>
                <h3
                  className="text-lg font-bold text-slate-900 mt-1 truncate font-lexend"
                  title={kpis.topPage}
                >
                  {kpis.topPage}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 truncate">
              {kpis.topPageCount} visualizações acumuladas
            </p>
          </CardContent>
        </Card>

        {/* Dispositivo Mais Usado */}
        <Card className="hover:shadow-sm transition-shadow border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aparelho Predominante
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-lexend">
                  {kpis.topDevice}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                {kpis.topDevice === 'Smartphone' ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Monitor className="w-5 h-5" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              Distribuição detalhada no gráfico abaixo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bloco 1: Evolução Mês a Mês (Linhas) & Gráfico de Pizza (Aparelhos) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico de Evolução Mês a Mês */}
        <Card className="lg:col-span-8 border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Evolução de Acessos Mês a Mês
                </CardTitle>
                <CardDescription className="text-xs">
                  Comparação de volume total e interesse por principais seções
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span className="text-xs text-slate-600 font-medium">Total de Visitas</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {monthlyData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                Nenhum acesso registrado no período selecionado.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Geral"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                    {topSectionsForLines.map((sec, idx) => {
                      const colors = [COLORS.emerald, COLORS.indigo, COLORS.amber, COLORS.purple]
                      return (
                        <Line
                          key={sec}
                          type="monotone"
                          dataKey={sec}
                          name={sec}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={1.8}
                          strokeDasharray="4 4"
                          dot={{ r: 3 }}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Setor (Pizza): PC x Smartphone x Tablet */}
        <Card className="lg:col-span-4 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Proporção de Dispositivos
            </CardTitle>
            <CardDescription className="text-xs">PC/Desktop × Smartphone × Tablet</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {devicePieData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                Sem dados de dispositivos.
              </div>
            ) : (
              <div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={devicePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {devicePieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val: any, name: any, item: any) => [
                          `${val} acessos (${item.payload.percent}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-2">
                  {devicePieData.map((d, idx) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className="font-medium text-slate-700">{d.name}</span>
                      </div>
                      <span className="text-slate-500 font-mono">
                        {d.value} ({d.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bloco 2: Barras de Interesse por Seção & Horário do Dia (0–23h) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Barras: Interesse por Seção */}
        <Card className="lg:col-span-7 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Interesse por Seção do Site
            </CardTitle>
            <CardDescription className="text-xs">
              Home, Soluções, Cases, Blog, Contato e Institucional
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {sectionBarData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                Sem acessos registrados para comparar seções.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectionBarData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <YAxis
                      dataKey="section"
                      type="category"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      width={110}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} visualizações`, 'Acessos']}
                    />
                    <Bar dataKey="count" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição por Horário do Dia (0-23h) */}
        <Card className="lg:col-span-5 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Distribuição por Horário (0h – 23h)
            </CardTitle>
            <CardDescription className="text-xs">
              Picos de visitação ao longo das horas do dia
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="hour"
                    stroke="#64748b"
                    fontSize={10}
                    interval={2}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} acessos`, 'Volume']}
                  />
                  <Bar dataKey="visitas" fill={COLORS.accent} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bloco 3: Tabelas de Rankings (Páginas, UFs e Blog) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ranking de Páginas Mais Visitadas */}
        <Card className="lg:col-span-6 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Páginas Mais Acessadas
            </CardTitle>
            <CardDescription className="text-xs">
              Top 10 URLs mais visitadas e total de visitantes únicos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Página / Rota</th>
                    <th className="py-2.5 px-3 font-semibold">Seção</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Acessos</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Únicos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topPagesRanking.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        Nenhum registro para exibir.
                      </td>
                    </tr>
                  ) : (
                    topPagesRanking.map((page, idx) => (
                      <tr key={page.path} className="hover:bg-slate-50/70 transition-colors">
                        <td
                          className="py-2.5 px-4 font-medium text-slate-900 truncate max-w-[200px]"
                          title={page.title || page.path}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {idx + 1}
                            </span>
                            <span className="truncate">{page.path}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <Badge
                            variant="secondary"
                            className="font-normal text-[10px] px-1.5 py-0"
                          >
                            {page.section}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          {page.count}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-500 font-mono">
                          {page.visitors.size}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ranking de UFs (Origem Geográfica Aproximada) */}
        <Card className="lg:col-span-6 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Regiões Geográficas (UFs que Mais Acessam)
            </CardTitle>
            <CardDescription className="text-xs">
              Geolocalização aproximada por IP do visitante (sem gravação de IP)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Estado (UF)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Acessos</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Visitantes</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Proporção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topUfsRanking.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        Nenhum registro para exibir.
                      </td>
                    </tr>
                  ) : (
                    topUfsRanking.map((item, idx) => (
                      <tr key={item.uf} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-semibold">{item.uf}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          {item.count}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500 font-mono">
                          {item.uniqueVisitors}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-600 w-8 text-right">
                              {item.percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bloco 4: Posts Mais Acessados do Blog (se houver acessos) */}
      {topBlogPostsRanking.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 font-lexend flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Artigos do Blog Mais Lidos
            </CardTitle>
            <CardDescription className="text-xs">
              Identificação exata de quais publicações despertaram maior interesse dos visitantes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Slug do Post</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Visualizações</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Leitores Únicos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topBlogPostsRanking.map((post, idx) => (
                    <tr key={post.slug} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-sky-700">/blog/{post.slug}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                        {post.count}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-500 font-mono">
                        {post.visitors.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nota LGPD e Arquitetura no Rodapé da Tela */}
      <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900">Privacidade e Diretrizes de Coleta (LGPD):</strong>
          <p className="mt-0.5">
            Esta ferramenta foi configurada para não coletar dados pessoais (como nome, CPF ou
            e-mail de visitantes). O endereço IP é utilizado temporariamente pelo servidor apenas
            para geolocalização por UF e é imediatamente descartado, nunca sendo registrado no banco
            de dados. Os dados são utilizados com propósito estritamente estatístico e estratégico
            de produto.
          </p>
        </div>
      </div>
    </div>
  )
}
