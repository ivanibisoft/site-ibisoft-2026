import { useState } from 'react'
import { Download, FileCheck, ExternalLink, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import dunsPdf from '@/assets/ibisoft-tecnologia-duns-number-905539672-3e6be.pdf'
import { useSiteAssets } from '@/hooks/use-site-assets'

export default function Duns() {
  const { getAssetUrl } = useSiteAssets()
  const [isDownloading, setIsDownloading] = useState(false)
  const [useFallbackLocal, setUseFallbackLocal] = useState(false)

  // Prioriza o asset do admin se existir e não tiver falhado, com fallback para o asset local embutido
  const remoteDunsUrl = getAssetUrl('certificado-duns')
  const pdfSource = !useFallbackLocal && remoteDunsUrl ? remoteDunsUrl : dunsPdf

  const handleDownload = async () => {
    setIsDownloading(true)
    const fileName = 'ibisoft-tecnologia-duns-number-905539672.pdf'

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
                <ShieldCheck className="h-3.5 w-3.5" /> D&amp;B D-U-N-S® Registered
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Certificado D-U-N-S® Registered
              </h1>
              <p className="text-slate-600 mt-2 text-sm md:text-base">
                Identificador global empresarial da ibisoft Tecnologia da Informação Ltda.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs md:text-sm text-slate-500">
                <span>
                  <strong>DUNS:</strong> 905539672
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>CNPJ:</strong> 78.761.285/0001-70
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Emissor:</strong> Dun &amp; Bradstreet
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
                  aria-label="Abrir PDF em nova aba"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em nova aba
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Visualizador de PDF */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <FileCheck className="h-4 w-4 text-primary" /> Visualização do Documento Oficial
            </span>
            {remoteDunsUrl && !useFallbackLocal && (
              <button
                type="button"
                onClick={() => setUseFallbackLocal(true)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Caso a prévia remota falhe, alternar para o PDF local"
              >
                <RefreshCw className="h-3 w-3" /> Usar arquivo local
              </button>
            )}
          </div>

          <div className="relative w-full bg-slate-200/50 min-h-[600px] md:min-h-[820px] flex items-stretch">
            <iframe
              src={`${pdfSource}#toolbar=1&navpanes=0`}
              title="Certificado DUNS Registered - ibisoft"
              className="w-full h-[600px] md:h-[820px] border-0"
              onError={() => {
                if (!useFallbackLocal && remoteDunsUrl) {
                  setUseFallbackLocal(true)
                }
              }}
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
