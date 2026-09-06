import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCases, getCaseImageUrl, type CaseItem } from '@/services/cases'
import { useRealtime } from '@/hooks/use-realtime'

export default function Cases() {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCases = useCallback((showLoading = false) => {
    if (showLoading) setLoading(true)
    getCases()
      .then((data) => {
        setCases(data)
      })
      .catch((err) => {
        console.error('Erro ao buscar cases:', err)
      })
      .finally(() => {
        if (showLoading) setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchCases(true)
  }, [fetchCases])

  useRealtime('cases', () => fetchCases(false))

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
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-pulse text-muted-foreground">Carregando cases...</div>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="text-xl font-bold mb-2">Novos cases em breve</h3>
              <p className="text-muted-foreground text-sm">
                Estamos preparando os próximos depoimentos e histórias de sucesso dos nossos
                clientes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((caseItem) => {
                const imageUrl = getCaseImageUrl(caseItem)
                return (
                  <Card
                    key={caseItem.id}
                    className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/60 hover:border-accent/30 group overflow-hidden bg-card"
                  >
                    {imageUrl && (
                      <div className="w-full h-56 sm:h-64 overflow-hidden bg-muted/40 flex items-center justify-center p-4 border-b border-border/40">
                        <img
                          src={imageUrl}
                          alt="Case de sucesso"
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-col flex-grow p-6">
                      <p className="text-muted-foreground text-[15px] leading-relaxed whitespace-pre-line">
                        {caseItem.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
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
