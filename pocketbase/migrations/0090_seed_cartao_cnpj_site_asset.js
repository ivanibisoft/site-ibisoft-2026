migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_assets')
    try {
      app.findFirstRecordByData('site_assets', 'slug', 'cartao-cnpj')
    } catch (_) {
      const record = new Record(col)
      record.set('name', 'Cartão CNPJ')
      record.set('slug', 'cartao-cnpj')
      record.set('alt_text', 'Cartão CNPJ - IBISOFT SERVIÇOS DE INFORMÁTICA LTDA - EPP')
      record.set('mime_type', 'application/pdf')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('site_assets', 'slug', 'cartao-cnpj')
      app.delete(record)
    } catch (_) {}
  },
)
