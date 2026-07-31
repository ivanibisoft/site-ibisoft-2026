migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('hero_messages')

    const existing = app.countRecords('hero_messages')
    if (existing > 0) return

    const seeds = [
      {
        text: 'Gestão completa da sua empresa com um ERP simples, integrado e escalável',
        order: 1,
        is_active: true,
      },
      {
        text: 'Controle financeiro, estoque, vendas, fiscal e muito mais em um único sistema',
        order: 2,
        is_active: true,
      },
      {
        text: 'Mais do que um sistema de ERP, oferecemos vantagem competitiva.',
        order: 3,
        is_active: true,
      },
    ]

    for (const seed of seeds) {
      const record = new Record(col)
      record.set('text', seed.text)
      record.set('order', seed.order)
      record.set('is_active', seed.is_active)
      app.save(record)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('hero_messages')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
