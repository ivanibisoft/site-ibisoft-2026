migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_assets')
    try {
      app.findFirstRecordByData('site_assets', 'slug', 'certificado-inpi')
    } catch (_) {
      const record = new Record(col)
      record.set('name', 'Certificado Marca INPI')
      record.set('slug', 'certificado-inpi')
      record.set('alt_text', 'Certificado de Registro de Marca INPI - Processo nº 828485216')
      record.set('mime_type', 'application/pdf')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('site_assets', 'slug', 'certificado-inpi')
      app.delete(record)
    } catch (_) {}
  },
)
