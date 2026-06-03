import { Link } from 'react-router-dom'
import { Trophy, ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

const CASES_DATA = [
  {
    id: 1,
    title: 'Expansão ágil com controle total',
    company: 'Distribuidora Central',
    logo: 'https://img.usecurling.com/i?q=distribution&color=blue&shape=fill',
    description:
      'A Distribuidora Central precisava expandir suas operações para 3 novos estados. Com o ERP ibisoft, conseguiram unificar o controle de estoque multissites e automatizar o faturamento, suportando o crescimento sem aumentar a equipe de backoffice.',
    metric: '+150% de pedidos processados',
    segment: 'Atacadista e Distribuidora',
  },
  {
    id: 2,
    title: 'Visibilidade e redução de perdas',
    company: 'AgroSul S/A',
    logo: 'https://img.usecurling.com/i?q=agriculture&color=green&shape=fill',
    description:
      'Enfrentando desafios com validade de produtos e rastreabilidade, a AgroSul implementou nosso módulo de gestão de lotes. O resultado foi imediato: redução drástica no desperdício e total conformidade com as exigências regulatórias.',
    metric: '98% de redução de perdas',
    segment: 'Genética Animal',
  },
  {
    id: 3,
    title: 'Integração contábil e fiscal ágil',
    company: 'Indústria Metálica Forte',
    logo: 'https://img.usecurling.com/i?q=industry&color=gray&shape=fill',
    description:
      'O fechamento mensal demorava mais de 15 dias devido a sistemas desconectados. A substituição pelo ERP ibisoft integrou o PCP ao financeiro e fiscal. Hoje, o fechamento é realizado com 100% de precisão nos impostos apurados.',
    metric: 'Fechamento fiscal 7x mais rápido',
    segment: 'Indústria',
  },
  {
    id: 4,
    title: 'Transformação do Comércio Exterior',
    company: 'Global Import',
    logo: 'https://img.usecurling.com/i?q=globe&color=cyan&shape=outline',
    description:
      'Gerenciar dezenas de processos de importação em planilhas causava atrasos aduaneiros constantes. O módulo Comex automatizou a geração de LIs e o cálculo de custo nacionalizado, aumentando a margem de lucro.',
    metric: 'Zero multas aduaneiras no ano',
    segment: 'Comércio Exterior',
  },
  {
    id: 5,
    title: 'Excelência na prestação de serviços',
    company: 'TechServ Soluções',
    logo: 'https://img.usecurling.com/i?q=technology&color=blue&shape=outline',
    description:
      'A medição de contratos e faturamento de horas trabalhadas era um gargalo. A automação permitiu que os técnicos registrassem horas via app, integrando diretamente com o faturamento automático no final do mês.',
    metric: 'Faturamento 100% automatizado',
    segment: 'Serviços',
  },
  {
    id: 6,
    title: 'Controle de ponta a ponta',
    company: 'Varejo e Cia',
    logo: 'https://img.usecurling.com/i?q=retail&color=orange&shape=fill',
    description:
      'A falta de integração entre as frentes de loja e a retaguarda gerava furos de estoque. Com a implantação do ecossistema ibisoft, a empresa conquistou controle de ponta a ponta e elevou a satisfação do consumidor final.',
    metric: 'Estoque 100% sincronizado',
    segment: 'Varejo',
  },
]

export default function Cases() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/600?q=success%20business&color=blue')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8">
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Histórias de Sucesso</h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Descubra como o ERP ibisoft tem transformado operações, reduzido custos e escalado
            resultados de empresas nos mais diversos segmentos de mercado.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASES_DATA.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/60 hover:border-accent/30 group"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-auto flex items-center justify-start">
                      <img
                        src={caseItem.logo}
                        alt={`Logo ${caseItem.company}`}
                        className="h-10 w-auto object-contain max-w-[120px] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {caseItem.segment}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {caseItem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                    {caseItem.description}
                  </p>
                  <div className="bg-accent/10 rounded-lg p-4 flex items-start gap-3 mt-auto">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Grande Conquista</p>
                      <p className="text-accent font-bold">{caseItem.metric}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-4xl mx-auto text-center">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Sua empresa pode ser o nosso próximo case de sucesso
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Fale com nossos especialistas, faça um diagnóstico gratuito e descubra o plano ideal
            para impulsionar a sua operação com o ERP ibisoft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quero-conhecer">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Quero ser um case de sucesso <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/sobre-erp">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                Entenda mais sobre o ERP
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
