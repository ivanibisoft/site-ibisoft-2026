/**
 * Utilitário para abrir arquivos PDF em nova aba via Blob URL.
 * Evita o bloqueio ERR_BLOCKED_BY_CLIENT no Chrome causado por extensões
 * de adblock/privacidade que bloqueiam navegações diretas para domínios internos.
 */
export async function openPdfInNewTab(url: string, title?: string): Promise<void> {
  // Pré-abre a aba no contexto do clique do usuário para evitar bloqueador de popups do navegador
  const newTab = window.open('about:blank', '_blank')

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Falha ao carregar o PDF: status ${res.status}`)
    }

    const blob = await res.blob()
    const pdfBlob = new Blob([blob], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(pdfBlob)

    if (newTab && !newTab.closed) {
      newTab.location.href = blobUrl
      if (title) {
        // Tenta ajustar o título após a navegação
        try {
          newTab.document.title = title
        } catch {
          // Ignora caso restrições de cross-origin impeçam acesso ao document
        }
      }
    } else {
      // Caso o popup tenha sido bloqueado ou fechado, tenta window.open direto
      window.open(blobUrl, '_blank')
    }
  } catch (error) {
    if (newTab && !newTab.closed) {
      newTab.close()
    }
    throw error
  }
}
