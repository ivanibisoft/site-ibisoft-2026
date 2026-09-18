migrate(
  (app) => {
    // Migration 0109: Cria coleção audience_events para análise anônima de audiência
    const collection = new Collection({
      name: 'audience_events',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '', // Público para permitir ingestão direta se necessário, mas o hook é a via primária
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'session_id', type: 'text', required: true, max: 120 },
        { name: 'visitor_id', type: 'text', required: true, max: 120 },
        { name: 'path', type: 'text', required: true, max: 500 },
        { name: 'section', type: 'text', required: true, max: 100 },
        { name: 'title', type: 'text', max: 300 },
        { name: 'blog_slug', type: 'text', max: 200 },
        { name: 'device_type', type: 'text', required: true, max: 50 }, // pc | smartphone | tablet
        { name: 'uf', type: 'text', max: 10 }, // SP, RJ, PR, etc., ou 'Outro'
        { name: 'city', type: 'text', max: 150 },
        { name: 'country', type: 'text', max: 50 },
        { name: 'access_hour', type: 'number', min: 0, max: 23, onlyInt: true },
        { name: 'access_year_month', type: 'text', max: 7 }, // Formato 'YYYY-MM' para agrupamento rápido mês a mês
        { name: 'access_date', type: 'text', max: 10 }, // Formato 'YYYY-MM-DD'
        { name: 'referrer', type: 'text', max: 500 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_audience_created ON audience_events (created)',
        'CREATE INDEX idx_audience_ym ON audience_events (access_year_month)',
        'CREATE INDEX idx_audience_section ON audience_events (section)',
        'CREATE INDEX idx_audience_uf ON audience_events (uf)',
        'CREATE INDEX idx_audience_device ON audience_events (device_type)',
        'CREATE INDEX idx_audience_visitor ON audience_events (visitor_id)',
      ],
    })

    app.save(collection)
    console.log('[migration 0109] Coleção audience_events criada com sucesso.')
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('audience_events')
      app.delete(collection)
      console.log('[migration 0109] Coleção audience_events removida.')
    } catch (_) {}
  },
)
