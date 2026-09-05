import React, { useState } from 'react'
import { MessageCircle, Linkedin, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface BlogPostShareButtonsProps {
  title: string
  slug?: string
  className?: string
  size?: 'default' | 'sm'
  compact?: boolean
}

export function BlogPostShareButtons({
  title,
  slug,
  className = '',
  size = 'sm',
  compact = false,
}: BlogPostShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const getArticleUrl = () => {
    if (!slug || !slug.trim()) {
      return typeof window !== 'undefined' ? `${window.location.origin}/blog` : ''
    }
    return typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${encodeURIComponent(slug.trim())}`
      : ''
  }

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = getArticleUrl()
    const fullTitle = title ? `${title} | Blog ibisoft` : 'Blog ibisoft'
    const text = encodeURIComponent(`Confira este artigo: "${fullTitle}"\n${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = encodeURIComponent(getArticleUrl())
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = getArticleUrl()

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      toast({
        title: 'Link copiado!',
        description: 'O link do artigo foi copiado para sua área de transferência.',
      })
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      toast({
        title: 'Não foi possível copiar',
        description: 'Selecione e copie o endereço.',
        variant: 'destructive',
      })
    }
  }

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleShareWhatsApp}
          className="h-7 w-7 rounded-full text-[#25D366] hover:text-[#20bd5c] hover:bg-[#25D366]/10 border-[#25D366]/30 hover:border-[#25D366] transition-colors"
          title="Compartilhar no WhatsApp"
        >
          <MessageCircle className="h-3.5 w-3.5 fill-current" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleShareLinkedIn}
          className="h-7 w-7 rounded-full text-[#0A66C2] hover:text-[#084e96] hover:bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:border-[#0A66C2] transition-colors"
          title="Compartilhar no LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5 fill-current" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="h-7 w-7 rounded-full transition-colors"
          title="Copiar link do artigo"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center flex-wrap gap-2 ${className}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleShareWhatsApp}
        className="rounded-full gap-1.5 text-xs h-8 px-3 text-[#25D366] hover:text-[#20bd5c] hover:bg-[#25D366]/10 border-[#25D366]/30 hover:border-[#25D366]"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="h-3.5 w-3.5 shrink-0 fill-current" />
        <span>WhatsApp</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleShareLinkedIn}
        className="rounded-full gap-1.5 text-xs h-8 px-3 text-[#0A66C2] hover:text-[#084e96] hover:bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:border-[#0A66C2]"
        title="Compartilhar no LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5 shrink-0 fill-current" />
        <span>LinkedIn</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleCopyLink}
        className="rounded-full gap-1.5 text-xs h-8 px-3"
        title="Copiar link do artigo"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-600 font-medium">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copiar link</span>
          </>
        )}
      </Button>
    </div>
  )
}
