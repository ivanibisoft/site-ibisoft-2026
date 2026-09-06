import { useState, useEffect } from 'react'
import {
  Download,
  FileCheck,
  ExternalLink,
  Building2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteAssets } from '@/hooks/use-site-assets'
import { CNPJ_NUMBER, COMPANY_RAZAO_SOCIAL } from '@/lib/constants'

export default function Cnpj() {
  const { getAssetUrl } = useSiteAssets()
  const [isDownloading, setIsDownloading] = useState(false)
  const [useFallbackLocal, setUseFallbackLocal] = useState(false)

  // SEO dinâmico de título e descrição
  useEffect(() => {
    const originalTitle = document.title
    let metaDescriptionEl = document.querySelector('meta[name="description"]')
    const originalDescription = metaDescriptionEl?.getAttribute('content') || ''

    document.title = `Cartão CNPJ ${CNPJ_NUMBER} | ibisoft Tecnologia`

    const seoDescription = `Comprovante de Inscrição e Situação Cadastral no CNPJ sob o nº ${CNPJ_NUMBER} - ${COMPANY_RAZAO_SOCIAL}. Situação cadastral ATIVA.`

    if (!metaDescriptionEl) {
      metaDescriptionEl = document.createElement('meta')
      metaDescriptionEl.setAttribute('name', 'description')
      document.head.appendChild(metaDescriptionEl)
    }
    metaDescriptionEl.setAttribute('content', seoDescription)

    return () => {
      document.title = originalTitle
      if (metaDescriptionEl && originalDescription) {
        metaDescriptionEl.setAttribute('content', originalDescription)
      }
    }
  }, [])

  // Asset do PDF: local embutido como fonte prioritária garantida (mesmo padrão de Duns e Inpi),
  // com alternância para a versão remota do Admin se disponível
  const remoteCnpjUrl = getAssetUrl('cartao-cnpj')
  const localPdfUrl = '/cartao-cnpj-78761285000170.pdf'
  const pdfSource = useFallbackLocal && remoteCnpjUrl ? remoteCnpjUrl : localPdfUrl

  const handleDownload = async () => {
    setIsDownloading(true)
    const fileName = 'cartao-cnpj-ibisoft-78761285000170.pdf'

    try {
      const response = await fetch(pdfSource)
      if (!response.ok) throw new Error('Falha no download direto')
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const tempLink = document.createElement('a')
      tempLink.href = blobUrl
      tempLink.download = fileName
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      // Fallback para download via link padrão
      const fallbackLink = document.createElement('a')
      fallbackLink.href = pdfSource
      fallbackLink.download = fileName
      fallbackLink.target = '_blank'
      fallbackLink.rel = 'noopener noreferrer'
      document.body.appendChild(fallbackLink)
      fallbackLink.click()
      document.body.removeChild(fallbackLink)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Navegação de retorno */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Link>
        </div>

        {/* Cabeçalho do documento */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs mb-3">
                <Building2 className="h-3.5 w-3.5" /> Receita Federal do Brasil
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Cartão CNPJ • Dados Cadastrais
              </h1>
              <p className="text-slate-600 mt-2 text-sm md:text-base">
                Comprovante de Inscrição e Situação Cadastral no Cadastro Nacional da Pessoa
                Jurídica.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs md:text-sm text-slate-500">
                <span>
                  <strong>CNPJ:</strong> {CNPJ_NUMBER}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Razão Social:</strong> {COMPANY_RAZAO_SOCIAL}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Situação:</strong>{' '}
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 inline text-emerald-600" />
                    ATIVA
                  </span>
                </span>
              </div>
            </div>

            {/* Ações / Botões */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="gap-2 shadow-sm"
                size="lg"
                aria-label="Baixar cartão CNPJ em PDF"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Baixando...' : 'Baixar PDF'}
              </Button>

              <Button variant="outline" size="lg" asChild className="gap-2">
                <a
                  href={pdfSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Cartão CNPJ em PDF em nova aba"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em nova aba
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Card com os dados cadastrais oficiais completos */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Dados Cadastrais Oficiais da Receita
              Federal
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Situação Cadastral ATIVA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Número do CNPJ
              </span>
              <p className="font-semibold text-slate-900">{CNPJ_NUMBER} (Matriz)</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Razão Social
              </span>
              <p className="font-semibold text-slate-900">{COMPANY_RAZAO_SOCIAL}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Data de Abertura
              </span>
              <p className="font-semibold text-slate-900">
                09/05/1985 (Mais de 39 anos de atuação)
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Porte da Empresa
              </span>
              <p className="font-semibold text-slate-900">Microempresa (ME)</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Natureza Jurídica
              </span>
              <p className="font-semibold text-slate-900">206-2 - Sociedade Empresária Limitada</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Sócio-Administrador
              </span>
              <p className="font-semibold text-slate-900">Ivan Christofolli</p>
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Atividade Principal (CNAE)
              </span>
              <p className="font-semibold text-slate-900">
                18.30-0-03 - Reprodução de software em qualquer suporte
              </p>
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Atividades Econômicas Secundárias
              </span>
              <p className="text-slate-700">
                46.51-6-01 - Comércio atacadista de equipamentos de informática • 62.09-1-00 -
                Suporte técnico, manutenção e outros serviços em tecnologia da informação •
                47.51-2-01 - Comércio varejista especializado de equipamentos e suprimentos de
                informática
              </p>
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Endereço Sede
              </span>
              <p className="font-semibold text-slate-900">
                Rua Doutor Manoel Pedro, 365, Conjunto 401, Andar 04, Edifício Condomínio Opus One,
                Bairro Cabral, Curitiba - PR, CEP 80.035-030
              </p>
            </div>
          </div>
        </div>

        {/* Visualizador de PDF do Cartão CNPJ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <FileCheck className="h-4 w-4 text-primary" /> Visualização do Documento Oficial
              (Cartão CNPJ)
            </span>
            {remoteCnpjUrl && (
              <button
                type="button"
                onClick={() => setUseFallbackLocal((prev) => !prev)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title={
                  useFallbackLocal
                    ? 'Alternar para o PDF local embutido'
                    : 'Alternar para a versão remota do Admin'
                }
              >
                <RefreshCw className="h-3 w-3" />
                {useFallbackLocal ? 'Usar PDF local embutido' : 'Ver versão remota'}
              </button>
            )}
          </div>

          <div className="relative w-full bg-slate-200/50 min-h-[600px] md:min-h-[820px] flex items-stretch">
            <iframe
              src={`${pdfSource}#toolbar=1&navpanes=0`}
              title={`Cartão CNPJ - ${CNPJ_NUMBER} - ${COMPANY_RAZAO_SOCIAL}`}
              className="w-full h-[600px] md:h-[820px] border-0"
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            Não conseguiu visualizar o cartão CNPJ?{' '}
            <button
              type="button"
              onClick={handleDownload}
              className="text-primary hover:underline font-medium focus:outline-none"
            >
              Clique aqui para baixar o PDF diretamente
            </button>
            {' ou '}
            <a
              href={pdfSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              abra em uma nova aba
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
