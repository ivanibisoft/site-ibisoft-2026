import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { COLLECTIONS } from '@/config/admin-collections'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Selecione uma coleção para gerenciar</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {COLLECTIONS.map((col) => {
          const Icon = col.icon
          return (
            <Link key={col.name} to={`/admin/${col.name}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
      </div>
    </div>
  )
}
