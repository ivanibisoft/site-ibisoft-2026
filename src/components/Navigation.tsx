import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { getSegments, type Segment } from '@/services/segments'
import { getModules, type Module } from '@/services/modules'
import useRealtime from '@/hooks/use-realtime'
import * as Icons from 'lucide-react'

export function Navigation() {
  const location = useLocation()
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

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(location.pathname.startsWith('/segmentos') && 'text-accent bg-accent/10')}
          >
            Segmentos
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {segments.map((item) => {
                const Icon = (Icons as any)[item.icon] || Icons.HelpCircle
                return (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    icon={Icon}
                    to={`/segmentos/${item.slug}`}
                  >
                    {item.description}
                  </ListItem>
                )
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              location.pathname.startsWith('/funcionalidades') && 'text-accent bg-accent/10',
            )}
          >
            Funcionalidades
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:w-[600px] md:grid-cols-2 lg:w-[900px] lg:grid-cols-3 max-h-[80vh] overflow-y-auto">
              {modules.map((item) => {
                const Icon =
                  item.icon && (Icons as any)[item.icon] ? (Icons as any)[item.icon] : Icons.Box
                return (
                  <ListItem
                    key={item.id}
                    title={item.name}
                    icon={Icon}
                    to={`/funcionalidades/${item.slug}`}
                  />
                )
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === '/sobre-erp' && 'text-accent bg-accent/10',
            )}
          >
            <Link to="/sobre-erp">Sobre ERP</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(location.pathname === '/sobre' && 'text-accent bg-accent/10')}
          >
            Sobre Nós
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px]">
              <ListItem to="/sobre#historia" title="Nossa História">
                Conheça a trajetória da ibisoft no mercado.
              </ListItem>
              <ListItem to="/sobre#logomarca" title="Nossa Marca">
                O significado por trás da nossa identidade.
              </ListItem>
              <ListItem to="/sobre#lideranca" title="Liderança">
                Palavra do CEO e visão de futuro.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; icon?: React.ElementType }
>(({ className, title, icon: Icon, children, to, ...props }, ref) => {
  const location = useLocation()
  const isActive = typeof to === 'string' && location.pathname === to

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
          className={cn(
            'group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent',
            isActive && 'bg-accent/10 text-accent',
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive
                    ? 'text-accent'
                    : 'text-muted-foreground group-hover:text-accent group-focus:text-accent',
                )}
              />
            )}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          {children && (
            <p
              className={cn(
                'line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5',
                Icon && 'ml-7',
              )}
            >
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
