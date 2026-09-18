import { ShieldCheck, Lock, FileText, CheckCircle2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { CtaButton } from '@/components/CtaButton'

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">Política de Privacidade</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            Conformidade LGPD
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-lexend tracking-tight">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            A ibisoft Tecnologia da Informação preza pela transparência, segurança da informação e
            respeito absoluto à privacidade dos visitantes do nosso site, em conformidade com a Lei
            Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Card Destaque: Estatísticas Anônimas */}
          <Card className="border-sky-200 bg-sky-50/60 shadow-sm">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-lexend">
                    Estatísticas Anônimas de Navegação e Audiência
                  </h2>
                  <p className="mt-1 text-slate-700 leading-relaxed text-sm">
                    Para avaliar o interesse dos visitantes em cada seção do nosso portal (como
                    módulos de soluções, artigos do blog e cases de sucesso), utilizamos uma
                    ferramenta própria de análise estatística de audiência focada em privacidade:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Navegação 100% anônima:</strong> Não utilizamos cookies rastreadores
                        de terceiros nem coletamos qualquer dado pessoal (como nome, CPF ou e-mail)
                        durante a simples visitação.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Não armazenamento de IP:</strong> O endereço IP do visitante nunca é
                        gravado no nosso banco de dados. O IP é processado exclusivamente no
                        servidor no momento da requisição para estimar a região geográfica
                        aproximada (UF) e é imediatamente descartado.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Classificação técnica:</strong> Registramos apenas métricas
                        agregadas como data/horário do acesso, tipo genérico de dispositivo (PC,
                        smartphone ou tablet) e seções navegadas para constante aprimoramento da
                        nossa plataforma.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 1 */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-lexend flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                1. Coleta de Dados via Formulários de Contato
              </h2>
              <p>
                Os únicos dados pessoais coletados ocorrem de forma explícita e voluntária quando o
                usuário preenche nossos formulários de interesse (&ldquo;Quero Conhecer&rdquo; ou
                &ldquo;Fale Conosco&rdquo;). Nesses casos, coletamos:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-slate-600">
                <li>Nome completo</li>
                <li>Endereço de e-mail corporativo ou pessoal</li>
                <li>Telefone para contato</li>
                <li>Mensagem ou necessidade de negócio informada</li>
              </ul>
              <p className="text-xs text-slate-500">
                Esses dados são utilizados exclusivamente para que nossos especialistas comerciais e
                técnicos retornem o contato solicitado pelo interessado.
              </p>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-lexend flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                2. Segurança e Não Compartilhamento
              </h2>
              <p>
                A ibisoft não comercializa, aluga ou compartilha dados com terceiros para fins
                publicitários. Todas as informações submetidas através do site trafegam sob
                criptografia segura SSL/TLS (HTTPS) e são armazenadas em infraestrutura com
                controles rígidos de acesso.
              </p>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-lexend flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                3. Seus Direitos como Titular (LGPD)
              </h2>
              <p>
                Em conformidade com o artigo 18 da LGPD, o titular dos dados possui o direito de
                solicitar a qualquer momento a confirmação da existência de tratamento, o acesso aos
                seus dados, a correção de dados incompletos ou a eliminação dos dados tratados com
                base no seu consentimento.
              </p>
              <p className="text-xs text-slate-600">
                Para exercer qualquer um de seus direitos ou esclarecer dúvidas sobre esta política,
                entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail:{' '}
                <strong className="text-slate-900">contato@ibisoft.com.br</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 mb-4">
              Última atualização: Setembro de {new Date().getFullYear()} • ibisoft Tecnologia da
              Informação Ltda.
            </p>
            <CtaButton to="/" variant="secondary">
              Voltar ao Início
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}
