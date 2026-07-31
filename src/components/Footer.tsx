import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, MapPin, Phone } from 'lucide-react'
import ibisoftLogo from '@/assets/botao_ibisoft_2_sem_fundo-74482.png'
import dunsPdf from '@/assets/ibisoft-tecnologia-duns-number-905539672-3e6be.pdf'
import { SEGMENTS, WHATSAPP_URL } from '@/lib/constants'
import { useSiteAssets } from '@/hooks/use-site-assets'

export function Footer() {
  const { getAssetUrl } = useSiteAssets()
  const logoUrl = getAssetUrl('logo-principal') || ibisoftLogo
  const dunsUrl = getAssetUrl('certificado-duns') || dunsPdf
  return (
    <footer className="bg-slate-50 text-slate-600 py-12 lg:py-16 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand and Description */}
          <div className="flex flex-col">
            <div className="w-fit mb-6">
              <img src={logoUrl} alt="ibisoft" className="h-10 object-contain" />
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-xs">
              Transformando desafios complexos em soluções tecnológicas inovadoras. Sua parceira
              estratégica em TI para impulsionar resultados e garantir o sucesso do seu negócio.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/sobre-erp" className="text-sm hover:text-primary transition-colors">
                  Sobre ERP
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-sm hover:text-primary transition-colors">
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Segments */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6">Segmentos</h3>
            <ul className="space-y-4">
              {SEGMENTS.filter((s) => s.id !== 'outros').map((segment) => (
                <li key={segment.id}>
                  <Link
                    to={`/segmentos/${segment.title === 'Atacadista e Distribuidora' ? 'atacadista-e-distribuidora' : segment.id}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {segment.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6">Fale Conosco</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.google.com/maps/@-25.4081498,-49.2539782,3a,75y,352.41h,96.45t/data=!3m7!1e1!3m5!1sfUkJfLguGL6BeJeJTA_V_A!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-6.453825593429272%26panoid%3DfUkJfLguGL6BeJeJTA_V_A%26yaw%3D352.4080766992003!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-start space-x-3 text-sm group hover:text-primary transition-colors cursor-pointer"
                  aria-label="Abrir localização no Google Maps"
                >
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  <span>
                    Cond. Opus One Cabral
                    <br />
                    Rua Dr. Manoel Pedro, 365 - Cj 401
                    <br />
                    Bairro Cabral
                    <br />
                    Curitiba / PR
                    <br />
                    CEP: 80035-030
                  </span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                <span>
                  (41) 3027-2003
                  <br />
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    (41) 99116-6264 WhatsApp
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} ibisoft Tecnologia da Informação. Todos os direitos
              reservados.
            </p>
            <p className="text-xs text-slate-400 text-center md:text-left">
              CNPJ: 78.761.285/0001-70 | DUNS:{' '}
              <a
                href={dunsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Ver Certificado DUNS"
              >
                905539672
              </a>
              {' | '}
              <Link
                to="/admin"
                className="hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Admin
              </Link>
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500"></div>
        </div>
      </div>
    </footer>
  )
}
