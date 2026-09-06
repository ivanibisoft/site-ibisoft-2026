import { BookOpen, ArrowRight } from 'lucide-react'
import { CtaButton } from '@/components/CtaButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FUNNEL_STAGES } from '@/lib/erp-content'
import { ModulesSection } from '@/components/ModulesSection'

export default function SobreErp() {
  return (
    <div className="animate-fade-in">
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/600?q=library&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8">
            <BookOpen className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Guia Definitivo sobre ERP
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Tudo o que você precisa saber sobre Sistemas de Gestão Empresarial. Desde os conceitos
            básicos até as melhores práticas de implantação para dominar seu mercado.
          </p>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">A Jornada do Conhecimento ERP</h2>
            <p className="text-muted-foreground text-lg">
              Preparamos os conteúdos essenciais para guiar a sua empresa rumo à maturidade em
              gestão.
            </p>
          </div>

          <div className="space-y-16">
            {FUNNEL_STAGES.map((stage) => {
              const Icon = stage.icon
              return (
                <div key={stage.id} className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stage.title}</h3>
                      <p className="text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                    {stage.articles.map((article) => (
                      <Dialog key={article.id}>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 group h-full flex flex-col">
                            <CardHeader>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {article.title}
                              </CardTitle>
                              <CardDescription className="text-base mt-2">
                                {article.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-4 flex items-center text-sm font-medium text-accent">
                              Ler artigo completo{' '}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl leading-tight">
                              {article.title}
                            </DialogTitle>
                            <DialogDescription className="text-base pt-6 space-y-4 text-foreground/80 text-left">
                              {article.content.split('\n\n').map((p, i) => (
                                <p key={i} className="leading-relaxed">
                                  {p}
                                </p>
                              ))}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ModulesSection />

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Pronto para dar o próximo passo?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Agora que você já sabe como um ERP pode transformar o seu negócio, converse com um de
            nossos especialistas e descubra como a ibisoft se encaixa na sua realidade.
          </p>
          <div className="flex justify-center">
            <CtaButton
              to="/quero-conhecer"
              size="lg"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20"
            >
              Quero conhecer o ERP
            </CtaButton>
          </div>
        </div>
      </section>
    </div>
  )
}
