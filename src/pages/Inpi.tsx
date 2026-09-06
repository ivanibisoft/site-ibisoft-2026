import { useState } from 'react'
import {
  Download,
  FileCheck,
  ExternalLink,
  Award,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteAssets } from '@/hooks/use-site-assets'
import { useEffect } from 'react'

export default function Inpi() {
  const { getAssetUrl } = useSiteAssets()
  const [isDownloading, setIsDownloading] = useState(false)
  const [useFallbackLocal, setUseFallbackLocal] = useState(false)

  // SEO dinâmico de título e descrição
  useEffect(() => {
    const originalTitle = document.title
    let metaDescriptionEl = document.querySelector('meta[name="description"]')
    const originalDescription = metaDescriptionEl?.getAttribute('content') || ''

    document.title = 'Marca Registrada no INPI - Processo nº 828485216 | ibisoft Tecnologia'

    const seoDescription =
      'Certificado oficial de registro da marca ibisoft junto ao INPI sob Processo nº 828485216. Registro prorrogado e vigente até 08/11/2031 na Classe NCL 42.'

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

  // Asset do PDF: remoto via site_assets (quando upload for feito) com fallback prioritário para o arquivo local
  const remoteInpiUrl = getAssetUrl('certificado-inpi')
  const localPdfUrl = '/certificado-inpi-828485216.pdf'
  const pdfSource = !useFallbackLocal && remoteInpiUrl ? remoteInpiUrl : localPdfUrl

  const handleDownload = async () => {
    setIsDownloading(true)
    const fileName = 'certificado-inpi-marca-ibisoft-828485216.pdf'

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
                <Award className="h-3.5 w-3.5" /> INPI • Instituto Nacional da Propriedade
                Industrial
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Certificado de Registro de Marca
              </h1>
              <p className="text-slate-600 mt-2 text-sm md:text-base">
                Registro de marca concedido e prorrogado para IBISOFT SERVIÇOS DE INFORMÁTICA LTDA -
                EPP.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs md:text-sm text-slate-500">
                <span>
                  <strong>Processo INPI:</strong> 828485216
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Marca:</strong> ibisoft
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Status:</strong>{' '}
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 inline text-emerald-600" />
                    Registro prorrogado — vigente até 08/11/2031
                  </span>
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="gap-2 shadow-sm"
                size="lg"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Baixando...' : 'Baixar PDF'}
              </Button>

              <Button variant="outline" size="lg" asChild className="gap-2">
                <a
                  href={pdfSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir PDF do certificado INPI em nova aba"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em nova aba
                </a>
              </Button>
            </div>
          </div>

          {/* Grid de dados oficiais do registro */}
        </div>

        {/* Visualizador de PDF */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <FileCheck className="h-4 w-4 text-primary" /> Visualização do Documento Oficial
            </span>
            {remoteInpiUrl && (
              <button
                type="button"
                onClick={() => setUseFallbackLocal((prev) => !prev)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title={
                  useFallbackLocal
                    ? 'Alternar para a versão remota'
                    : 'Alternar para o PDF local embutido'
                }
              >
                <RefreshCw className="h-3 w-3" />
                {useFallbackLocal ? 'Ver versão remota' : 'Usar PDF local'}
              </button>
            )}
          </div>

          <div className="relative w-full bg-slate-200/50 min-h-[600px] md:min-h-[820px] flex items-stretch">
            <iframe
              src={`${pdfSource}#toolbar=1&navpanes=0`}
              title="Certificado de Registro de Marca INPI 828485216 - ibisoft"
              className="w-full h-[600px] md:h-[820px] border-0"
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            Não conseguiu visualizar o certificado?{' '}
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
