import pb from '@/lib/pocketbase/client'
import { getOrCreateSessionId, getOrCreateVisitorId, resolvePageInfo } from './audience'

export interface CreateLeadPayload {
  name: string
  email: string
  phone?: string
  message: string
  source_page?: string
  session_id?: string
  primary_interest?: string
  journey_summary?: string
  journey_details?: Record<string, any>
}

export interface LeadJourneyStep {
  path: string
  section: string
  title: string
  created?: string
}

export interface LeadRecord {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  source_page?: string
  status: 'new' | 'contacted' | 'closed'
  session_id?: string
  primary_interest?: string
  journey_summary?: string
  journey_details?: {
    session_id?: string
    total_pages_viewed?: number
    top_sections?: Array<{ section: string; views: number }>
    steps?: LeadJourneyStep[]
  } | null
  created: string
  updated: string
}

/**
 * Cria um novo lead associando de forma anônima e transparente a sessão de navegação (session_id).
 * Antes de persistir, recupera as páginas/seções navegadas nesta sessão no banco
 * para garantir um resumo confiável da jornada e indicar a seção de maior interesse.
 */
export const createLead = async (data: CreateLeadPayload): Promise<LeadRecord> => {
  try {
    const sessionId = data.session_id || getOrCreateSessionId()
    const visitorId = getOrCreateVisitorId()

    let primaryInterest = data.primary_interest || ''
    let journeySummary = data.journey_summary || ''
    let journeyDetails = data.journey_details

    // Se ainda não houver resumo montado, tenta consultar localmente na coleção audience_events
    if (!journeySummary && sessionId) {
      try {
        const events = await pb.collection('audience_events').getList(1, 50, {
          filter: `session_id = "${sessionId}"`,
          sort: 'created',
        })

        if (events && events.items.length > 0) {
          const sectionCounts: Record<string, number> = {}
          const steps: LeadJourneyStep[] = []

          for (const item of events.items as any[]) {
            const sec = (item.section || 'Outros').trim()
            const p = (item.path || '/').trim()
            let t = (item.title || p).trim()

            // Se o evento antigo tiver apenas slug genérico no título, enriquece
            if (
              !t ||
              t === p ||
              t.startsWith('Módulo ERP (') ||
              t.startsWith('Segmento (') ||
              t.startsWith('Post do Blog (')
            ) {
              try {
                const resolved = await resolvePageInfo(p)
                if (resolved.title) {
                  t = resolved.title
                }
              } catch {
                /* intentionally ignored */
              }
            }

            sectionCounts[sec] = (sectionCounts[sec] || 0) + 1
            steps.push({
              path: p,
              section: sec,
              title: t,
              created: item.created,
            })
          }

          const sortedSections = Object.keys(sectionCounts).sort(
            (a, b) => sectionCounts[b] - sectionCounts[a],
          )

          if (!primaryInterest && sortedSections.length > 0) {
            primaryInterest = sortedSections[0]
          }

          if (sortedSections.length > 0) {
            journeySummary = sortedSections
              .slice(0, 3)
              .map((s) => `${s} (${sectionCounts[s]}x)`)
              .join(' → ')
          }

          journeyDetails = {
            session_id: sessionId,
            visitor_id: visitorId,
            total_pages_viewed: events.items.length,
            top_sections: sortedSections.map((s) => ({ section: s, views: sectionCounts[s] })),
            steps: steps.slice(0, 30),
          }
        }
      } catch (evtErr) {
        // Falha tolerante na busca prévia: o hook backend também executa essa análise
        console.debug('[Leads Service] Busca de eventos da sessão contornada:', evtErr)
      }
    }

    const payload: Record<string, any> = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone ? data.phone.trim() : '',
      message: data.message.trim(),
      source_page: data.source_page || 'contato',
      status: 'new',
      session_id: sessionId,
    }

    if (primaryInterest) {
      payload.primary_interest = primaryInterest
    }
    if (journeySummary) {
      payload.journey_summary = journeySummary
    }
    if (journeyDetails) {
      payload.journey_details = journeyDetails
    }

    return await pb.collection('leads').create<LeadRecord>(payload)
  } catch (error) {
    console.error('Error creating lead:', error)
    throw error
  }
}
