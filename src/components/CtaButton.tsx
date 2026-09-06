import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CtaButtonProps extends Omit<ButtonProps, 'asChild'> {
  /** Texto ou elementos filhos a serem exibidos dentro do botão */
  children: React.ReactNode
  /** Rota interna do React Router (ex: '/quero-conhecer') ou URL externa (ex: 'https://...') */
  to?: string
  /** Se o link deve abrir em nova aba quando `to` for fornecido */
  target?: string
  rel?: string
  /** Classes CSS adicionais para o contêiner do botão */
  className?: string
  /** Classes CSS customizadas para o ícone de seta */
  iconClassName?: string
  /** Se deve ocultar a seta (padrão: false, a seta é exibida e animada no hover) */
  showArrow?: boolean
}

/**
 * Componente padronizado de botão Call-to-Action (CTA).
 *
 * Reproduz o padrão visual estabelecido no botão "Quero ser um case de sucesso"
 * (v0.0.168), exibindo uma seta para a direita que desliza suavemente para a direita
 * quando o usuário passa o mouse (hover) sobre o botão.
 *
 * Respeita preferências de movimento reduzido (motion-reduce:transform-none)
 * e mantém ergonomia de toque em telas sensíveis ao toque (mobile).
 */
export const CtaButton = React.forwardRef<HTMLButtonElement, CtaButtonProps>(
  (
    {
      children,
      to,
      target,
      rel,
      className,
      iconClassName,
      showArrow = true,
      variant = 'default',
      size = 'lg',
      disabled,
      ...buttonProps
    },
    ref,
  ) => {
    const isExternal =
      to &&
      (to.startsWith('http://') ||
        to.startsWith('https://') ||
        to.startsWith('mailto:') ||
        to.startsWith('tel:'))

    const arrowElement = showArrow ? (
      <ArrowRight
        className={cn(
          'h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none',
          iconClassName,
        )}
        aria-hidden="true"
      />
    ) : null

    const content = (
      <span className="inline-flex items-center justify-center gap-2">
        <span>{children}</span>
        {arrowElement}
      </span>
    )

    // Se tiver destino de link, renderiza com asChild + Link ou <a>
    if (to && !disabled) {
      if (isExternal) {
        return (
          <Button
            asChild
            variant={variant}
            size={size}
            className={cn('group', className)}
            disabled={disabled}
            {...buttonProps}
          >
            <a
              href={to}
              target={target || '_blank'}
              rel={rel || 'noopener noreferrer'}
              className="inline-flex items-center justify-center gap-2"
            >
              <span>{children}</span>
              {arrowElement}
            </a>
          </Button>
        )
      }

      return (
        <Button
          asChild
          variant={variant}
          size={size}
          className={cn('group', className)}
          disabled={disabled}
          {...buttonProps}
        >
          <Link
            to={to}
            target={target}
            rel={rel}
            className="inline-flex items-center justify-center gap-2"
          >
            <span>{children}</span>
            {arrowElement}
          </Link>
        </Button>
      )
    }

    // Caso seja botão regular (type="button" | "submit" com onClick)
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('group', className)}
        disabled={disabled}
        {...buttonProps}
      >
        {content}
      </Button>
    )
  },
)

CtaButton.displayName = 'CtaButton'
