import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { COLLECTIONS } from '@/config/admin-collections'
import { KeyRound, Activity } from 'lucide-react'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Selecione uma coleção, métrica de audiência ou configuração para gerenciar
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Link to="/admin/audiencia">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-sky-200 bg-sky-50/40 h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-sky-600/10 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate text-sky-950">Audiência</p>
                <p className="text-xs text-muted-foreground">Métricas, UFs &amp; Dispositivos</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        {COLLECTIONS.map((col) => {
          const Icon = col.icon
          return (
            <Link key={col.name} to={`/admin/${col.name}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{col.label}</p>
                    <p className="text-xs text-muted-foreground">{col.singularLabel}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        <Link to="/admin/alterar-senha">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-primary/40 bg-primary/5 h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">Alterar Senha</p>
                <p className="text-xs text-muted-foreground">Segurança da Conta</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
