import { Link } from 'react-router-dom'
import { Award, CheckCircle2, ExternalLink } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface InpiBadgeProps {
  /**
   * Variantes visuais espelhando DunsBadge:
   * - 'badge': formato selo compacto/médio (usado em home/credibilidade)
   * - 'card': formato em card com mais detalhes explicativos
   * - 'form': formato horizontal otimizado para topo/rodapé de formulário
   * - 'inline': formato minimalista com texto e ícone
   */
  variant?: 'badge' | 'card' | 'form' | 'inline'
  className?: string
  showTooltip?: boolean
  showExternalIcon?: boolean
}

export const INPI_PROCESS_NUMBER = '828485216'
const TOOLTIP_TEXT =
  'Marca registrada junto ao INPI (Instituto Nacional da Propriedade Industrial) sob Processo nº 828485216. Registro prorrogado e vigente até 08/11/2031. Clique para ver o certificado oficial.'

export function InpiBadge({
  variant = 'badge',
  className,
  showTooltip = true,
  showExternalIcon = false,
}: InpiBadgeProps) {
  const content = (() => {
    switch (variant) {
      case 'form':
        return (
          <div
            className={cn(
              'group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left w-full shadow-sm',
              className,
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Award className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[1px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500 fill-emerald-600/10" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Marca Registrada INPI
                  </span>
                  <span className="text-[10px] bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-full">
                    Oficial ✓
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium truncate sm:whitespace-normal">
                  Registro INPI Processo nº{' '}
                  <span className="font-bold text-slate-900">{INPI_PROCESS_NUMBER}</span>
                </p>
              </div>
            </div>
            <span className="text-xs text-primary font-medium shrink-0 group-hover:underline flex items-center gap-1 pl-2">
              <span className="hidden sm:inline">Ver certificado</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        )

      case 'card':
        return (
          <div
            className={cn(
              'group flex flex-col items-center sm:items-start text-center sm:text-left gap-3 p-5 rounded-2xl border border-border/80 bg-background/95 hover:border-primary/40 hover:shadow-md transition-all',
              className,
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Award className="h-6 w-6" />
                <span className="absolute -bottom-1 -right-1 bg-background rounded-full p-[1px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                  Marca Registrada INPI
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Processo nº {INPI_PROCESS_NUMBER}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Marca oficial registrada no Instituto Nacional da Propriedade Industrial. Registro
              prorrogado com vigência até 08/11/2031 (Classe NCL 42).
            </p>
            <span className="text-xs font-semibold text-primary group-hover:underline inline-flex items-center gap-1">
              Visualizar documento oficial <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        )

      case 'inline':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary transition-colors group',
              className,
            )}
          >
            <Award className="h-4 w-4 text-primary shrink-0" />
            <span>
              Marca registrada no INPI Processo nº{' '}
              <strong className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                {INPI_PROCESS_NUMBER}
              </strong>
            </span>
            <span className="inline-flex items-center justify-center text-emerald-600 font-bold ml-0.5">
              ✓
            </span>
          </span>
        )

      case 'badge':
      default:
        return (
          <div
            className={cn(
              'group inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-primary/25 bg-background shadow-sm hover:border-primary hover:shadow-md hover:bg-primary/5 transition-all text-left',
              className,
            )}
          >
            <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Award className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[1px]">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-500 fill-emerald-600/10" />
              </span>
            </div>
            <div className="flex flex-col leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  Marca Registrada INPI
                </span>
                <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Vigente
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium">
                Proc. <span className="font-semibold text-slate-800">{INPI_PROCESS_NUMBER}</span>
              </span>
            </div>
            {showExternalIcon && (
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors ml-auto shrink-0" />
            )}
          </div>
        )
    }
  })()

  const linkElement = (
    <Link
      to="/inpi"
      className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-transform active:scale-[0.99]"
      aria-label={`Marca Registrada INPI Processo nº ${INPI_PROCESS_NUMBER}. Clique para visualizar o certificado oficial.`}
    >
      {content}
    </Link>
  )

  if (!showTooltip) {
    return linkElement
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="max-w-xs text-xs font-normal text-center p-2.5 shadow-lg border-primary/20"
      >
        <p className="font-semibold mb-1 text-primary flex items-center justify-center gap-1">
          <Award className="h-3.5 w-3.5" /> Marca Registrada INPI
        </p>
        <p className="text-slate-200">{TOOLTIP_TEXT}</p>
      </TooltipContent>
    </Tooltip>
  )
}
