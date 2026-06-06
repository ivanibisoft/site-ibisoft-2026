import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  LayoutDashboard,
  Users,
  MessageSquare,
  Box,
  Briefcase,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const { isAuthenticated, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
    { name: 'Módulos', href: '/admin/modules', icon: Box },
    { name: 'Segmentos', href: '/admin/segments', icon: Briefcase },
    { name: 'Cases', href: '/admin/cases', icon: FileText },
    { name: 'Equipe', href: '/admin/team', icon: Users },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm z-10">
        <div className="p-6 border-b flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">ibisoft Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <span
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair do sistema
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50/50 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
