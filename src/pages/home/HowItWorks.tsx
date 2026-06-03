import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    num: '1',
    title: 'Diagnóstico do seu negócio',
  },
  {
    num: '2',
    title: 'Implantação assistida',
  },
  {
    num: '3',
    title: 'Treinamento da equipe',
  },
  {
    num: '4',
    title: 'Suporte contínuo',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Como funciona?</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-white/20 z-0"></div>

          {STEPS.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-white max-w-[200px]">{step.title}</h3>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-semibold">
            <Link to="/quero-conhecer">Começar agora mesmo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
