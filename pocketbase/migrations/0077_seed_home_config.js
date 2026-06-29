migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('home_config')

    try {
      app.findFirstRecordByData(
        'home_config',
        'hero_title',
        'Gestão completa da sua empresa com um ERP simples, integrado e escalável',
      )
      return
    } catch (_) {}

    const record = new Record(col)
    record.set(
      'hero_title',
      'Gestão completa da sua empresa com um ERP simples, integrado e escalável',
    )
    record.set(
      'hero_subtitle',
      'Controle financeiro, estoque, vendas, fiscal e muito mais em um único sistema',
    )
    record.set('hero_image', '')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'home_config',
        'hero_title',
        'Gestão completa da sua empresa com um ERP simples, integrado e escalável',
      )
      app.delete(record)
    } catch (_) {}
  },
)
