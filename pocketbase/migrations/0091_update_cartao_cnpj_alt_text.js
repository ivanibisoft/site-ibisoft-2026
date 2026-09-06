migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('site_assets', 'slug', 'cartao-cnpj')
      record.set('alt_text', 'Cartão CNPJ - IBISOFT - TECNOLOGIA DA INFORMAÇÃO LTDA')
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('site_assets', 'slug', 'cartao-cnpj')
      record.set('alt_text', 'Cartão CNPJ - IBISOFT SERVIÇOS DE INFORMÁTICA LTDA - EPP')
      app.save(record)
    } catch (_) {}
  },
)
