migrate(
  (app) => {
    // Atualiza eventos anteriores de audiência que foram gravados com títulos genéricos
    // ex: "Módulo ERP (gestao-de-produtos)" -> "Módulo — Gestão de Produtos"
    // ex: "Segmento (industria)" -> "Segmento — Indústria"
    // ex: "Post do Blog (slug)" -> título do post

    try {
      const modules = app.findRecordsByFilter('modules', '', '', 100, 0)
      for (let i = 0; i < modules.length; i++) {
        const m = modules[i]
        const slug = (m.getString('slug') || '').trim()
        const name = (m.getString('name') || '').trim()
        if (slug && name) {
          app
            .db()
            .newQuery(
              'UPDATE audience_events SET title = {:newTitle} WHERE path = {:path} OR path LIKE {:pathSlash} OR title = {:oldTitle}',
            )
            .bind({
              newTitle: 'Módulo — ' + name,
              path: '/funcionalidades/' + slug,
              pathSlash: '/funcionalidades/' + slug + '/%',
              oldTitle: 'Módulo ERP (' + slug + ')',
            })
            .execute()
        }
      }
    } catch (err) {
      console.warn('[Migration 0112] Erro ao atualizar módulos em audience_events:', err)
    }

    try {
      const segments = app.findRecordsByFilter('segments', '', '', 100, 0)
      for (let i = 0; i < segments.length; i++) {
        const s = segments[i]
        const slug = (s.getString('slug') || '').trim()
        const title = (s.getString('title') || '').trim()
        if (slug && title) {
          app
            .db()
            .newQuery(
              'UPDATE audience_events SET title = {:newTitle} WHERE path = {:path} OR path LIKE {:pathSlash} OR title = {:oldTitle}',
            )
            .bind({
              newTitle: 'Segmento — ' + title,
              path: '/segmentos/' + slug,
              pathSlash: '/segmentos/' + slug + '/%',
              oldTitle: 'Segmento (' + slug + ')',
            })
            .execute()
        }
      }
    } catch (err) {
      console.warn('[Migration 0112] Erro ao atualizar segmentos em audience_events:', err)
    }

    try {
      const posts = app.findRecordsByFilter('posts', '', '', 100, 0)
      for (let i = 0; i < posts.length; i++) {
        const p = posts[i]
        const slug = (p.getString('slug') || '').trim()
        const title = (p.getString('title') || '').trim()
        if (slug && title) {
          app
            .db()
            .newQuery(
              'UPDATE audience_events SET title = {:newTitle} WHERE path = {:path} OR path LIKE {:pathSlash} OR title = {:oldTitle}',
            )
            .bind({
              newTitle: title,
              path: '/blog/' + slug,
              pathSlash: '/blog/' + slug + '/%',
              oldTitle: 'Post do Blog (' + slug + ')',
            })
            .execute()
        }
      }
    } catch (err) {
      console.warn('[Migration 0112] Erro ao atualizar posts em audience_events:', err)
    }
  },
  (app) => {
    // Revert opcional
  },
)
