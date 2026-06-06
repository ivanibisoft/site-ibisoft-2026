import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, MessageSquare, Briefcase, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {user?.name || user?.email}
        </h2>
        <p className="text-gray-500 text-lg">
          Este é o seu painel de controle para gerenciar o conteúdo do site da ibisoft.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Controle de Leads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Monitore leads do formulário em tempo real.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Segmentos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Atualize a copy e os desafios de cada setor.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cases de Sucesso</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Cadastre novas histórias de clientes.</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Sistema Seguro</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-primary/80">Acesso protegido pelas regras do PocketBase.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
