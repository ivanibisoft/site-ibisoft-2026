import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary pt-20 pb-32 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/1080?q=abstract%20blue%20waves&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1]">
            Gestão completa da sua empresa com um ERP{' '}
            <span className="text-accent">simples, integrado e escalável</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium leading-relaxed">
            Controle financeiro, estoque, vendas, fiscal e muito mais em um único sistema
          </p>

          <p className="text-lg text-primary-foreground/70 leading-relaxed max-w-xl">
            Mais do que um sistema de ERP, oferecemos vantagem competitiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold group"
            >
              <Link to="/quero-conhecer">Solicitar demonstração</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white"
            ></Button>
          </div>
        </div>

        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-white/5 backdrop-blur-sm p-2">
            <img
              src="https://img.usecurling.com/p/800/600?q=dashboard%20analytics&color=blue"
              alt="Dashboard ERP ibisoft"
              className="rounded-xl w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
