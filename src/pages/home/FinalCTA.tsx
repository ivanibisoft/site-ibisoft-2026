import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

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
          <div className="bg-slate-800 rounded-2xl p-8 lg:p-12 shadow-2xl border border-slate-700">
            <h3 className="text-2xl font-semibold mb-6">Nossos Contatos</h3>
            <div className="space-y-6">
              <a
                href="https://www.google.com/maps/@-25.4081498,-49.2539782,3a,75y,352.41h,96.45t/data=!3m7!1e1!3m5!1sfUkJfLguGL6BeJeJTA_V_A!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-6.453825593429272%26panoid%3DfUkJfLguGL6BeJeJTA_V_A%26yaw%3D352.4080766992003!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-700/50 transition-colors group cursor-pointer"
                aria-label="Abrir localização no Google Maps"
              >
                <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                    Nosso Endereço
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Cond. Opus One Cabral
                    <br />
                    Rua Dr. Manoel Pedro, 365 - Cj 401
                    <br />
                    Bairro Cabral - Curitiba / PR
                    <br />
                    CEP: 80035-030
                  </p>
                </div>
              </a>

              <div className="flex items-start space-x-4 p-4 rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Telefone</h4>
                  <p className="text-slate-400 text-sm">
                    (41) 3027-2003
                    <br />
                    (41) 99116-6264 WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">E-mail</h4>
                  <p className="text-slate-400 text-sm">contato@ibisoft.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
