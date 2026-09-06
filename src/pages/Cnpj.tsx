import { useState, useEffect } from 'react'
import {
  Download,
  FileCheck,
  ExternalLink,
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Calendar,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteAssets } from '@/hooks/use-site-assets'
import { CNPJ_NUMBER } from '@/lib/constants'

export default function Cnpj() {
  const { getAssetUrl, loading } = useSiteAssets()
  const [isDownloading, setIsDownloading] = useState(false)

  // URL do PDF cadastrado no Admin (site_assets -> slug: "cartao-cnpj")
  const cnpjPdfUrl = getAssetUrl('cartao-cnpj')

  // SEO dinâmico de título e descrição
  useEffect(() => {
    const originalTitle = document.title
    let metaDescriptionEl = document.querySelector('meta[name="description"]')
    const originalDescription = metaDescriptionEl?.getAttribute('content') || ''

    document.title = `Cartão CNPJ ${CNPJ_NUMBER} | ibisoft Tecnologia`

    const seoDescription = `Comprovante de Inscrição e Situação Cadastral no CNPJ sob o nº ${CNPJ_NUMBER} - IBISOFT SERVIÇOS DE INFORMÁTICA LTDA - EPP. Situação cadastral ATIVA.`

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

  const handleDownload = async () => {
    if (!cnpjPdfUrl) return
    setIsDownloading(true)
    const fileName = 'cartao-cnpj-ibisoft-78761285000170.pdf'

    try {
      const response = await fetch(cnpjPdfUrl)
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
      fallbackLink.href = cnpjPdfUrl
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
                  <strong>Razão Social:</strong> IBISOFT SERVIÇOS DE INFORMÁTICA LTDA - EPP
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
              {cnpjPdfUrl ? (
                <>
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
                      href={cnpjPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Abrir cartão CNPJ em PDF em nova aba"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Consultar cartão CNPJ
                    </a>
                  </Button>
                </>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  size="lg"
                  className="gap-2 border-dashed text-slate-500 bg-slate-50 cursor-not-allowed"
                  title="O arquivo PDF do cartão CNPJ será disponibilizado em breve através do painel de administração."
                  aria-label="Cartão CNPJ em PDF disponível em breve"
                >
                  <FileText className="h-4 w-4 text-slate-400" />
                  Cartão CNPJ disponível em breve
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Card com os dados cadastrais oficiais completos */}

        {/* Visualizador de PDF do Cartão CNPJ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <FileCheck className="h-4 w-4 text-primary" /> Visualização do Documento Oficial
              (Cartão CNPJ)
            </span>
            {cnpjPdfUrl && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Documento disponível
              </span>
            )}
          </div>

          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
              Carregando documento...
            </div>
          ) : cnpjPdfUrl ? (
            <>
              <div className="relative w-full bg-slate-200/50 min-h-[600px] md:min-h-[820px] flex items-stretch">
                <iframe
                  src={`${cnpjPdfUrl}#toolbar=1&navpanes=0`}
                  title={`Cartão CNPJ - ${CNPJ_NUMBER} - IBISOFT SERVIÇOS DE INFORMÁTICA LTDA`}
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
                  href={cnpjPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  abra em uma nova aba
                </a>
                .
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-slate-50/50 flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Cartão CNPJ em PDF disponível em breve
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                O arquivo oficial em PDF do Cartão CNPJ está sendo preparado e poderá ser incluído
                através da área de administração do site. Os dados cadastrais acima foram
                confirmados e estão ativos perante a Receita Federal do Brasil.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200">
                <Building2 className="h-4 w-4 text-primary" />
                <span>
                  CNPJ Matriz: <strong>{CNPJ_NUMBER}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
