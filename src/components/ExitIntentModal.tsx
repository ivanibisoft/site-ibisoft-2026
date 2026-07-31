import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift, CheckCircle2, Loader2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { useAutoFocus } from '@/hooks/use-auto-focus'

export function ExitIntentModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const { toast } = useToast()
  const nameRef = useRef<HTMLInputElement>(null)

  useAutoFocus(nameRef, { enabled: open && !isSuccess, delay: 200, retries: 10 })

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        const hasSeen = sessionStorage.getItem('exitIntentShown')
        if (!hasSeen) {
          setOpen(true)
          sessionStorage.setItem('exitIntentShown', 'true')
        }
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const handleSubmit = async () => {
    const newErrors: { name?: string; email?: string } = {}
    if (name.trim().length < 2) newErrors.name = 'Nome deve ter no mínimo 2 caracteres'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido'
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await pb.collection('leads').create({
        name: name.trim(),
        email: email.trim(),
        message: 'Lead capturado via modal de exit intent',
        source_page: 'exit-intent',
        status: 'new',
      })
      setIsSuccess(true)
      toast({
        title: 'Cadastro realizado!',
        description: 'Entraremos em contato em breve.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: 'Tente novamente mais tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) {
      setTimeout(() => {
        setIsSuccess(false)
        setName('')
        setEmail('')
        setErrors({})
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] text-center p-8"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          nameRef.current?.focus()
        }}
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-900">Tudo certo!</h4>
            <p className="text-slate-600 max-w-xs">
              Recebemos seu cadastro. Nossa equipe entrará em contato em breve.
            </p>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <DialogTitle className="text-2xl font-display text-center">
                Espere! Antes de ir...
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                Ganhe uma consultoria de diagnóstico sem custo para entender como a ibisoft pode
                transformar seu negócio.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="text-left">
                <Input
                  ref={nameRef}
                  placeholder="Seu nome"
                  className="h-12"
                  aria-label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit()
                  }}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="text-left">
                <Input
                  placeholder="Seu melhor e-mail corporativo"
                  className="h-12"
                  aria-label="E-mail corporativo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit()
                  }}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <Button
                size="lg"
                className="w-full font-semibold"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Resgatar Agora'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Não enviamos spam. Cancele quando quiser.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
