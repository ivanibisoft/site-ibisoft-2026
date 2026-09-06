import { useState } from 'react'
import {
  Download,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  FileQuestion,
  Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteAssets } from '@/hooks/use-site-assets'
import { useToast } from '@/hooks/use-toast'
import { openPdfInNewTab } from '@/lib/pdf-viewer'

export default function Duns() {
  const { getAssetUrl, loading: assetsLoading } = useSiteAssets()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isOpeningTab, setIsOpeningTab] = useState(false)

  // Asset do PDF: exclusivamente o arquivo registrado no Admin (site_assets)
  const pdfSource = getAssetUrl('certificado-duns')
  const isAvailable = Boolean(pdfSource)

  const handleOpenInNewTab = async () => {
    if (!pdfSource || isOpeningTab) return
    setIsOpeningTab(true)

    try {
      await openPdfInNewTab(pdfSource, 'Certificado DUNS Registered - ibisoft Tecnologia')
    } catch (error) {
      console.error('Erro ao abrir PDF em nova aba:', error)
      toast({
        variant: 'destructive',
        title: 'Não foi possível abrir o PDF',
        description:
          'Ocorreu uma falha ao carregar o arquivo. Você pode usar a opção "Baixar PDF" para salvá-lo no seu dispositivo.',
      })
    } finally {
      setIsOpeningTab(false)
    }
  }

  const handleDownload = async () => {
    if (!pdfSource) return
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
                disabled={!isAvailable || isDownloading}
                className="gap-2 shadow-sm"
                size="lg"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Baixando...' : isAvailable ? 'Baixar PDF' : 'Disponível em breve'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleOpenInNewTab}
                disabled={!isAvailable || isOpeningTab}
                className="gap-2"
                aria-label="Abrir PDF do certificado DUNS em nova aba"
              >
                {isOpeningTab ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Abrindo...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Abrir em nova aba
                  </>
                )}
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
          </div>

          {assetsLoading ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium">Carregando documento oficial...</p>
            </div>
          ) : isAvailable && pdfSource ? (
            <>
              <div className="relative w-full bg-slate-200/50 min-h-[600px] md:min-h-[820px] flex items-stretch">
                <iframe
                  src={`${pdfSource}#toolbar=1&navpanes=0`}
                  title="Certificado DUNS Registered - ibisoft Tecnologia"
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
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  disabled={isOpeningTab}
                  className="text-primary hover:underline font-medium focus:outline-none disabled:opacity-60"
                >
                  {isOpeningTab ? 'abrindo em nova aba...' : 'abra em uma nova aba'}
                </button>
                .
              </div>
            </>
          ) : (
            <div className="min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <FileQuestion className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Certificado DUNS disponível em breve
              </h3>
              <p className="text-sm text-slate-600 max-w-md">
                O arquivo PDF oficial do Certificado DUNS Registered está sendo atualizado no painel
                administrativo e estará disponível para visualização e download em instantes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
