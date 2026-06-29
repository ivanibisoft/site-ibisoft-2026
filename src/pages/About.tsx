import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Building2, Lightbulb, UserCircle2 } from 'lucide-react'
import { getTeamMembers } from '@/services/team_members'
import pb from '@/lib/pocketbase/client'
import ivanPhoto from '@/assets/ivan-2-7b6a6.jpg'

export default function About() {
  const location = useLocation()
  const [ceo, setCeo] = useState<any>(null)

  useEffect(() => {
    getTeamMembers()
      .then((members) => {
        const ceoMember = members.find((m) => m.role === 'CEO')
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
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nossa missão é clara: democratizar o acesso à tecnologia de ponta. Acreditamos que
              pequenas e médias empresas dos setores de comércio, indústria e serviços merecem
              decidir com base em dados precisos e em tempo real. Na ibisoft, não entregamos apenas
              software; entregamos o diferencial competitivo necessário para impulsionar a
              eficiência e o crescimento sustentável dos nossos clientes.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://img.usecurling.com/p/800/600?q=office%20team&color=blue"
              alt="Nossa História"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nossa Logomarca */}
      <section id="logomarca" className="py-24 bg-muted/30 scroll-mt-20 border-y border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Lightbulb className="h-4 w-4" /> Identidade Visual
          </div>
          <h2 className="text-3xl font-bold mb-12">Nossa Logomarca</h2>

          <div className="bg-background p-8 md:p-12 rounded-3xl shadow-xl border border-border flex flex-col items-center transition-all hover:shadow-2xl">
            <div className="bg-primary text-white p-4 md:p-6 rounded-xl font-display font-bold text-4xl md:text-6xl tracking-tighter mb-10 shadow-lg">
              ibi<span className="text-accent">soft</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl">
              <div>
                <h3 className="font-bold text-xl mb-3 text-primary">Solidez e Confiança</h3>
                <p className="text-muted-foreground">
                  O tom azul escuro primário reflete a estabilidade corporativa, a segurança dos
                  dados e a base sólida que nosso ERP fornece às operações diárias de nossos
                  parceiros.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-accent">Inovação e Agilidade</h3>
                <p className="text-muted-foreground">
                  O destaque em tom ciano representa a modernidade, a interface intuitiva e a
                  inovação tecnológica contínua que impulsiona os resultados de quem utiliza nossa
                  plataforma.
                </p>
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
                  src={
                    ceo.photo === 'ivan-2-7b6a6.jpg'
                      ? ivanPhoto
                      : ceo.photo
                        ? pb.files.getUrl(ceo, ceo.photo)
                        : 'https://img.usecurling.com/ppl/large?gender=male&seed=42'
                  }
                  alt={`Foto de ${ceo.name}`}
                  className="w-full rounded-2xl shadow-lg border-4 border-background"
                />
              </div>
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-display">{ceo.name}</h3>
                  <p className="text-accent font-medium">{ceo.role}</p>
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
