import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/constants'

export function FinalCTA() {
  return (
    <section
      className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden"
      id="contato"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Pronto para transformar a gestão da sua empresa?
            </h2>
            <p className="text-lg text-slate-300 max-w-lg">
              Fale com nossos especialistas e descubra como o ERP da ibisoft pode otimizar seus
              processos, reduzir custos e impulsionar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="text-base font-semibold">
                <Link to="/contato">
                  Falar com Especialista <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
