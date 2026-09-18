migrate(
  (app) => {
    // Migration 0113: Atualiza journey_summary e primary_interest dos leads existentes
    // para utilizar os títulos reais das páginas em ordem cronológica com agrupamento consecutivo,
    // garantindo que acessos específicos a segmentos, módulos ou páginas fiquem identificados no resumo e no painel admin.

    const resolveExactPageName = (path, fallbackTitle) => {
      if (!path) return fallbackTitle || 'Página Inicial'
      const cleanPath = String(path).trim()
      const lower = cleanPath.toLowerCase()

      let title = (fallbackTitle || '').trim()
      const hasGenericPattern =
        !title ||
        title === cleanPath ||
        title.indexOf('(') !== -1 ||
        title.indexOf('Módulo ERP') === 0 ||
        title.indexOf('Segmento (') === 0 ||
        title.indexOf('Post do Blog (') === 0

      if (!hasGenericPattern) {
        return title
      }

      try {
        if (lower.indexOf('/funcionalidades/') === 0) {
          const rawSlug = cleanPath
            .replace(/^\/funcionalidades\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            try {
              const rec = app.findFirstRecordByData('modules', 'slug', slug)
              if (rec && rec.getString('name')) {
                return 'Módulo — ' + rec.getString('name').trim()
              }
            } catch (_) {}
          }
          return 'Módulo — ' + (slug || 'ERP')
        }

        if (lower.indexOf('/segmentos/') === 0) {
          const rawSlug = cleanPath
            .replace(/^\/segmentos\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            try {
              const rec = app.findFirstRecordByData('segments', 'slug', slug)
              if (rec && rec.getString('title')) {
                return 'Segmento — ' + rec.getString('title').trim()
              }
            } catch (_) {}
          }
          return 'Segmento — ' + (slug || 'Soluções')
        }

        if (lower.indexOf('/blog/') === 0) {
          const rawSlug = cleanPath
            .replace(/^\/blog\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            try {
              const rec = app.findFirstRecordByData('posts', 'slug', slug)
              if (rec && rec.getString('title')) {
                return rec.getString('title').trim()
              }
            } catch (_) {}
          }
          return 'Artigo: ' + slug
        }

        if (lower === '/' || lower === '') return 'Página Inicial'
        if (lower.indexOf('/sobre-erp') === 0) return 'Sobre o ERP ibisoft'
        if (lower.indexOf('/sobre') === 0) return 'Quem Somos'
        if (lower.indexOf('/cases') === 0) return 'Cases de Sucesso'
        if (lower.indexOf('/blog') === 0) return 'Blog e Artigos'
        if (lower.indexOf('/quero-conhecer') === 0 || lower.indexOf('/contato') === 0)
          return 'Quero Conhecer / Contato'
        if (lower.indexOf('/duns') === 0) return 'Certificado D-U-N-S'
        if (lower.indexOf('/inpi') === 0) return 'Certificado INPI'
        if (lower.indexOf('/cnpj') === 0) return 'Cartão CNPJ'
        if (lower.indexOf('/politica-de-privacidade') === 0 || lower.indexOf('/privacidade') === 0)
          return 'Política de Privacidade'
      } catch (_) {}

      return title || cleanPath
    }

    try {
      const leads = app.findRecordsByFilter('leads', '', '-created', 100, 0)
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i]
        const sessionId = (lead.getString('session_id') || '').trim()
        if (!sessionId) continue

        try {
          const events = app.findRecordsByFilter(
            'audience_events',
            `session_id = '${sessionId.replace(/'/g, "\\'")}'`,
            'created',
            100,
            0,
          )

          if (events && events.length > 0) {
            const pageTitleCounts = {}
            const sectionCounts = {}
            const pathSteps = []

            for (let j = 0; j < events.length; j++) {
              const ev = events[j]
              const sec = (ev.getString('section') || 'Outros').trim()
              const path = (ev.getString('path') || '/').trim()
              let title = (ev.getString('title') || '').trim()
              const created = ev.getString('created') || ''

              title = resolveExactPageName(path, title)

              sectionCounts[sec] = (sectionCounts[sec] || 0) + 1
              pageTitleCounts[title] = (pageTitleCounts[title] || 0) + 1
              pathSteps.push({
                path,
                section: sec,
                title,
                created,
              })
            }

            const sortedPages = Object.keys(pageTitleCounts).sort(
              (a, b) => pageTitleCounts[b] - pageTitleCounts[a],
            )

            // Página real de maior interesse
            if (sortedPages.length > 0) {
              lead.set('primary_interest', sortedPages[0])
            }

            // Resumo da jornada em ordem cronológica com repetições consecutivas agrupadas
            const grouped = []
            for (let k = 0; k < pathSteps.length; k++) {
              const stepTitle = pathSteps[k].title || 'Página'
              if (grouped.length > 0 && grouped[grouped.length - 1].title === stepTitle) {
                grouped[grouped.length - 1].count++
              } else {
                grouped.push({ title: stepTitle, count: 1 })
              }
            }

            const newSummary = grouped
              .map((item) => (item.count > 1 ? `${item.title} (${item.count}x)` : item.title))
              .join(' → ')

            if (newSummary) {
              lead.set('journey_summary', newSummary)
            }

            // Atualiza os journey_details
            try {
              lead.set('journey_details', {
                session_id: sessionId,
                total_pages_viewed: events.length,
                top_pages: sortedPages.map((p) => ({
                  title: p,
                  views: pageTitleCounts[p],
                })),
                top_sections: Object.keys(sectionCounts)
                  .sort((a, b) => sectionCounts[b] - sectionCounts[a])
                  .map((s) => ({
                    section: s,
                    views: sectionCounts[s],
                  })),
                steps: pathSteps.slice(0, 30),
              })
            } catch (_) {}

            app.save(lead)
          }
        } catch (leadProcErr) {
          console.warn('[Migration 0113] Erro ao reprocessar lead:', leadProcErr)
        }
      }
    } catch (outerErr) {
      console.warn('[Migration 0113] Erro geral na migration:', outerErr)
    }
  },
  (app) => {},
)
