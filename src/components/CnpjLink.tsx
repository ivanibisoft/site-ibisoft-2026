import { ExternalLink, Building2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CNPJ_NUMBER, CNPJ_RECEITA_FEDERAL_URL, CNPJ_TOOLTIP_TEXT } from '@/lib/constants'

export interface CnpjLinkProps {
  /**
   * Variantes visuais:
   * - 'inline': formato sutil para texto/rodapé (ex: "CNPJ: 78.761.285/0001-70")
   * - 'badge': formato selo compacto (espelhando DunsBadge / InpiBadge)
   * - 'card': formato em card com mais detalhes explicativos
   */
  variant?: 'inline' | 'badge' | 'card'
  className?: string
  showLabel?: boolean
  showExternalIcon?: boolean
  showTooltip?: boolean
}

export function CnpjLink({
  variant = 'inline',
  className,
  showLabel = true,
  showExternalIcon = false,
  showTooltip = true,
}: CnpjLinkProps) {
  const content = (() => {
    switch (variant) {
      case 'card':
        return (
          <div
            className={cn(
              'group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left w-full shadow-sm',
              className,
            )}
          >
            <div className="flex items-start gap-3 min-w-0">
              <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-slate-900 block">
                  Cadastro Nacional da Pessoa Jurídica (CNPJ)
                </span>
                <span className="text-muted-foreground">
                  A ibisoft está regularmente inscrita sob o CNPJ{' '}
                  <strong className="text-slate-900">{CNPJ_NUMBER}</strong> perante a Receita
                  Federal do Brasil.
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0 group">
              Consultar Cartão CNPJ
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        )

      case 'badge':
        return (
          <div
            className={cn(
              'group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 hover:bg-primary/10 text-slate-700 hover:text-primary transition-all font-medium border border-slate-300/70 hover:border-primary/30',
              className,
            )}
          >
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>
              {showLabel && 'CNPJ: '}
              <strong className="text-slate-900 group-hover:text-primary font-semibold">
                {CNPJ_NUMBER}
              </strong>
            </span>
            {showExternalIcon && (
              <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )

      case 'inline':
      default:
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors underline decoration-slate-300 hover:decoration-primary underline-offset-4 cursor-pointer group',
              className,
            )}
          >
            <span>
              {showLabel && 'CNPJ: '}
              <span className="font-medium text-slate-600 group-hover:text-primary transition-colors">
                {CNPJ_NUMBER}
              </span>
            </span>
            {showExternalIcon && (
              <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors ml-0.5 shrink-0" />
            )}
          </span>
        )
    }
  })()

  const linkElement = (
    <a
      href={CNPJ_RECEITA_FEDERAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-transform active:scale-[0.99]"
      aria-label={`Consultar Cartão CNPJ ${CNPJ_NUMBER} na Receita Federal do Brasil (abre em nova aba)`}
    >
      {content}
    </a>
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
          <Building2 className="h-3.5 w-3.5" /> Cartão CNPJ • Receita Federal
        </p>
        <p className="text-slate-200">{CNPJ_TOOLTIP_TEXT}</p>
      </TooltipContent>
    </Tooltip>
  )
}
