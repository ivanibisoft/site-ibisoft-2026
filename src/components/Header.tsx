import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/Navigation'
import { MobileNav } from '@/components/MobileNav'
import logoImg from '../assets/botao_ibisoft_2_sem_fundo-74482.png'

export function Header() {
  const location = useLocation()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex w-40 items-center md:w-48 cursor-pointer"
          >
            <img
              src={logoImg}
              alt="Ibisoft Tecnologia"
              className="h-10 w-full object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-6 md:flex">
          <Navigation />
          <Button asChild className="hidden lg:flex font-semibold">
            <Link to="/quero-conhecer">Quero conhecer</Link>
          </Button>
        </div>

        <div className="flex md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
