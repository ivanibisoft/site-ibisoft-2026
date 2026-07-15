import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WHATSAPP_URL } from '@/lib/constants'

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 rounded-full shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 animate-bounce md:animate-none',
        'bg-[#25D366] text-white hover:bg-[#20bd5c] focus:ring-[#25D366]',
        'h-12 px-5 md:h-14 md:px-6',
      )}
      aria-label="Conversar pelo WhatsApp"
    >
      <MessageCircle className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
      <span className="font-medium text-sm md:text-base whitespace-nowrap">
        Conversar pelo WhatsApp
      </span>
    </a>
  )
}
