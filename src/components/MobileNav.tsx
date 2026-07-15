import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSegments, type Segment } from '@/services/segments'
import { getModules, type Module } from '@/services/modules'
import useRealtime from '@/hooks/use-realtime'
import { WHATSAPP_URL } from '@/lib/constants'
import * as Icons from 'lucide-react'

export function MobileNav() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [segments, setSegments] = useState<Segment[]>([])
  const [modules, setModules] = useState<Module[]>([])

  const loadData = async () => {
    try {
      const segData = await getSegments()
      setSegments(segData)
    } catch (err) {
      console.error('Failed to load segments:', err)
    }

    try {
      const modData = await getModules()
      setModules(modData)
    } catch (err) {
      console.error('Failed to load modules:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('segments', () => {
    getSegments().then(setSegments).catch(console.error)
  })
  useRealtime('modules', () => {
    getModules().then(setModules).catch(console.error)
  })

  const handleLinkClick = () => setIsOpen(false)

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col p-0">
        <div className="p-6 pb-2">
          <SheetTitle className="text-left mb-2">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navegação principal do site</SheetDescription>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="flex flex-col space-y-4 pb-6">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="text-lg font-medium hover:text-primary transition-colors py-2"
            >
              Início
            </Link>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="segmentos" className="border-b-0">
                <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline hover:text-primary">
                  Segmentos
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-3 pl-4 pt-2">
                    {segments.map((item) => {
                      const Icon = (Icons as any)[item.icon] || Icons.HelpCircle
                      return (
                        <Link
                          key={item.id}
                          to={`/segmentos/${item.slug}`}
                          onClick={handleLinkClick}
                          className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="funcionalidades" className="border-b-0">
                <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline hover:text-primary">
                  Funcionalidades
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-3 pl-4 pt-2">
                    {modules.map((item) => {
                      const Icon =
                        item.icon && (Icons as any)[item.icon]
                          ? (Icons as any)[item.icon]
                          : Icons.Box
                      return (
                        <Link
                          key={item.id}
                          to={`/funcionalidades/${item.slug}`}
                          onClick={handleLinkClick}
                          className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sobre" className="border-b-0">
                <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline hover:text-primary">
                  Sobre Nós
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-3 pl-4 pt-2">
                    <Link
                      to="/sobre#historia"
                      onClick={handleLinkClick}
                      className="text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      Nossa História
                    </Link>
                    <Link
                      to="/sobre#logomarca"
                      onClick={handleLinkClick}
                      className="text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      Nossa Marca
                    </Link>
                    <Link
                      to="/sobre#lideranca"
                      onClick={handleLinkClick}
                      className="text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      Liderança
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              to="/sobre-erp"
              onClick={handleLinkClick}
              className="text-lg font-medium hover:text-primary transition-colors py-2"
            >
              Sobre ERP
            </Link>

            <Link
              to="/contato"
              onClick={handleLinkClick}
              className="text-lg font-medium hover:text-primary transition-colors py-2"
            >
              Contato
            </Link>

            <div className="pt-4 flex flex-col gap-3">
              <Button asChild className="w-full font-semibold" size="lg" onClick={handleLinkClick}>
                <Link to="/quero-conhecer">Quero conhecer</Link>
              </Button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] text-white hover:bg-[#20bd5c] transition-colors h-11 px-8 font-medium shadow-sm"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                <span>Conversar pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
