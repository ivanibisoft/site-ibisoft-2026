import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { COLLECTIONS } from '@/config/admin-collections'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <nav className="space-y-1">
      <Link
        to="/admin"
        onClick={onNavigate}
        className={cn(
          'block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors',
          location.pathname === '/admin' && 'bg-accent text-accent-foreground',
        )}
      >
        Dashboard
      </Link>
      {COLLECTIONS.map((col) => {
        const Icon = col.icon
        const isActive = location.pathname.startsWith(`/admin/${col.name}`)
        return (
          <Link
            key={col.name}
            to={`/admin/${col.name}`}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors',
              isActive && 'bg-accent text-accent-foreground',
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {col.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 bg-card border-r p-4 hidden md:block shrink-0">
        <div className="mb-6">
          <Link to="/admin" className="text-lg font-bold">
            ibisoft Admin
          </Link>
        </div>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center px-4 gap-4 bg-card shrink-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4 overflow-y-auto">
              <div className="mb-6">
                <Link
                  to="/admin"
                  className="text-lg font-bold"
                  onClick={() => setMobileOpen(false)}
                >
                  ibisoft Admin
                </Link>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold hidden md:block">Painel Administrativo</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
