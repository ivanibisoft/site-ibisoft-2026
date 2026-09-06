import { Link } from 'react-router-dom'
import { Linkedin, MapPin, Phone, ShieldCheck, Award } from 'lucide-react'
import ibisoftLogo from '@/assets/botao_ibisoft_2_sem_fundo-74482.png'
import { SEGMENTS, WHATSAPP_URL } from '@/lib/constants'
import { CnpjLink } from '@/components/CnpjLink'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSiteAssets } from '@/hooks/use-site-assets'
import { useHasBlogPosts } from '@/hooks/use-has-blog-posts'

export function Footer() {
  const { getAssetUrl } = useSiteAssets()
  const { hasBlogPosts } = useHasBlogPosts()
  const logoUrl = getAssetUrl('logo-principal') || ibisoftLogo
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
                href="https://www.linkedin.com/in/ivan-ibisoft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
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
              {hasBlogPosts && (
                <li>
                  <Link to="/blog" className="text-sm hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              )}
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

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-slate-500">
            <CnpjLink variant="badge" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/duns"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/60 hover:bg-primary/10 text-slate-700 hover:text-primary transition-all font-medium border border-slate-300/70 hover:border-primary/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Ver Certificado D-U-N-S Registered Nº 905539672"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Certificada D-U-N-S Nº{' '}
                    <strong className="text-slate-900 group-hover:text-primary">905539672</strong>
                  </span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-xs text-xs font-normal text-center p-2.5 shadow-lg border-primary/20"
              >
                <p className="font-semibold mb-1 text-primary flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> D&amp;B D-U-N-S® Registered
                </p>
                <p className="text-slate-200">
                  Certificação internacional de idoneidade empresarial da Dun &amp; Bradstreet.
                  Clique para ver o certificado.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/inpi"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/60 hover:bg-primary/10 text-slate-700 hover:text-primary transition-all font-medium border border-slate-300/70 hover:border-primary/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Ver Certificado de Marca Registrada no INPI Processo nº 828485216"
                >
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Marca registrada no INPI{' '}
                    <strong className="text-slate-900 group-hover:text-primary">828485216</strong>
                  </span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-xs text-xs font-normal text-center p-2.5 shadow-lg border-primary/20"
              >
                <p className="font-semibold mb-1 text-primary flex items-center justify-center gap-1">
                  <Award className="h-3.5 w-3.5" /> Marca Registrada INPI
                </p>
                <p className="text-slate-200">
                  Marca oficial registrada no INPI sob Processo nº 828485216. Vigência até
                  08/11/2031. Clique para ver o certificado.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:justify-start gap-1 sm:gap-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} ibisoft Tecnologia da Informação. Todos os direitos
              reservados.
            </p>
            <span className="hidden sm:inline text-slate-400" aria-hidden="true">
              -
            </span>
            <Link
              to="/admin"
              className="hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
