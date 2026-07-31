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
import { Gift } from 'lucide-react'

export function ExitIntentModal() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = inputRef.current
        if (!input) return
        const rect = input.getBoundingClientRect()
        const isVisible =
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        if (!isVisible) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        input.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px] text-center p-8"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          inputRef.current?.focus()
        }}
      >
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
          <Input
            ref={inputRef}
            placeholder="Seu melhor e-mail corporativo"
            className="h-12"
            aria-label="E-mail corporativo"
            autoFocus
          />
          <Button size="lg" className="w-full font-semibold" onClick={() => setOpen(false)}>
            Resgatar Agora
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Não enviamos spam. Cancele quando quiser.</p>
      </DialogContent>
    </Dialog>
  )
}
