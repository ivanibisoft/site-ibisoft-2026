import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Building2, Lightbulb, UserCircle2, ShieldCheck, ArrowRight, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CnpjLink } from '@/components/CnpjLink'
import { getTeamMembers } from '@/services/team_members'
import pb from '@/lib/pocketbase/client'
import ivanPhoto from '@/assets/ivan-2-7b6a6.jpg'
import ibisoftLogo from '@/assets/logo-ibisoft-r-4b810.jpg'
import { useSiteAssets } from '@/hooks/use-site-assets'

export default function About() {
  const location = useLocation()
  const [ceo, setCeo] = useState<any>(null)
  const { getAssetUrl } = useSiteAssets()
  const ceoPhotoUrl = getAssetUrl('foto-ceo')
  const logoIbisoftRUrl = getAssetUrl('logo-ibisoft-r') || ibisoftLogo
  const historyImageUrl =
    getAssetUrl('imagem-sobre-1') ||
    'https://img.usecurling.com/p/800/600?q=office%20team&color=blue'

  useEffect(() => {
    getTeamMembers()
      .then((members) => {
        const ceoMember = members.find(
          (m) => m.role === 'CEO' || m.role === 'Fundador e CEO' || m.order === 1,
        )
        if (ceoMember) setCeo(ceoMember)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/600?q=abstract%20blue%20waves&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Sobre a ibisoft</h1>
          <p className="text-lg text-primary-foreground/80">
            Transformando a gestão de pequenas e médias empresas através de tecnologia inteligente e
            resultados escaláveis.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section id="historia" className="py-24 scroll-mt-20">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Building2 className="h-4 w-4" /> Nossa História
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Quatro Décadas Transformando a Gestão no Brasil
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Nascida em Curitiba — cidade referência em inovação e sustentabilidade — a ibisoft
              Tecnologia da Informação iniciou sua trajetória em 1985. Surgimos em um momento
              decisivo de abertura do mercado de informática, com o propósito de suprir a crescente
              demanda por processamento de dados e desenvolvimento de softwares de alta performance.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Desde então, nossa evolução tem sido constante. O que começou como um suporte técnico
              especializado transformou-se em um ecossistema completo de soluções de gestão. Hoje,
              desenvolvemos softwares que vão desde Sistemas de Gestão de Negócios (ERP) robustos
              até ferramentas específicas, desenhadas para atender às particularidades de cada
              modelo de negócio.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Nossa missão é clara: democratizar o acesso à tecnologia de ponta. Acreditamos que
              pequenas e médias empresas dos setores de comércio, indústria e serviços merecem
              decidir com base em dados precisos e em tempo real. Na ibisoft, não entregamos apenas
              software; entregamos o diferencial competitivo necessário para impulsionar a
              eficiência e o crescimento sustentável dos nossos clientes.
            </p>

            {/* Bloco de credibilidade: DUNS Registered e Cartão CNPJ */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 block">
                      Idoneidade Empresarial Reconhecida Globalmente
                    </span>
                    <span className="text-muted-foreground">
                      A ibisoft possui a certificação internacional{' '}
                      <strong>D&amp;B D-U-N-S® Registered</strong> sob o Nº{' '}
                      <strong className="text-slate-900">905539672</strong>, assegurando nossa
                      solidez e transparência no mercado corporativo.
                    </span>
                  </div>
                </div>
                <Link
                  to="/duns"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0 group"
                >
                  Ver certificado{' '}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Card Cartão CNPJ */}
              <CnpjLink variant="card" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={historyImageUrl}
              alt="Nossa História"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Onde a Terra Encontra a Tecnologia */}
      <section id="logomarca" className="py-24 bg-muted/30 scroll-mt-20 border-y border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Lightbulb className="h-4 w-4" /> Identidade Visual
          </div>
          <h2 className="text-3xl font-bold mb-12">Onde a Terra Encontra a Tecnologia</h2>

          <div className="bg-background p-8 md:p-12 rounded-3xl shadow-xl border border-border flex flex-col items-center transition-all hover:shadow-2xl">
            <div className="mb-10">
              <img
                src={logoIbisoftRUrl}
                alt="Logomarca ibisoft"
                className="w-full max-w-xs md:max-w-sm h-auto object-contain mx-auto"
              />
            </div>
            <div className="max-w-2xl text-left space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                O nome ibisoft nasce de um encontro simbólico entre as raízes do Brasil e o futuro
                da inovação. 'ibi', em tupi-guarani, significa terra ou chão — a base sólida de onde
                tudo cresce e se sustenta.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ao unir essa essência à tecnologia do software, criamos a 'Terra do Software'. Nossa
                marca representa o compromisso de construir soluções robustas e confiáveis,
                respeitando nossas origens enquanto impulsionamos a modernidade. Para nós, a
                tecnologia só faz sentido quando está conectada ao que é essencial: a base do seu
                negócio.
              </p>

              {/* Card Marca Registrada INPI */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 block">
                      Marca Registrada no INPI
                    </span>
                    <span className="text-muted-foreground">
                      A marca <strong>ibisoft</strong> é oficialmente registrada junto ao Instituto
                      Nacional da Propriedade Industrial sob o Processo nº{' '}
                      <strong className="text-slate-900">828485216</strong> (Classe NCL 42), com
                      registro prorrogado e vigente até 08/11/2031.
                    </span>
                  </div>
                </div>
                <Link
                  to="/inpi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0 group"
                >
                  Ver certificado{' '}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso CEO */}
      <section id="lideranca" className="py-24 scroll-mt-20">
        <div className="container max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <UserCircle2 className="h-4 w-4" /> Liderança
          </div>
          <h2 className="text-3xl font-bold mb-12">Nosso CEO</h2>

          {ceo ? (
            <div className="grid md:grid-cols-5 gap-8 items-center bg-card rounded-3xl p-8 md:p-12 shadow-elevation border border-border">
              <div className="md:col-span-2">
                <img
                  src={ceoPhotoUrl || (ceo.photo ? pb.files.getUrl(ceo, ceo.photo) : ivanPhoto)}
                  alt={`Foto de ${ceo.name}`}
                  className="w-full rounded-2xl shadow-lg border-4 border-background"
                />
              </div>
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-display">{ceo.name}</h3>
                  <p className="text-accent font-medium">Fundador e CEO</p>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-accent pl-4">
                  "Acreditamos que a tecnologia não deve ser um obstáculo, mas sim a ponte para o
                  crescimento contínuo. Nosso compromisso diário é entregar não apenas um software,
                  mas uma verdadeira vantagem competitiva estruturada para nossos parceiros."
                </p>
                <div className="pt-4">
                  <p className="text-muted-foreground whitespace-pre-line">{ceo.bio}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse bg-muted rounded-3xl h-[400px]"></div>
          )}
        </div>
      </section>
    </div>
  )
}
