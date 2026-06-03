migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('segments', 'slug', 'industria')
      record.set(
        'description',
        'Controle produção, estoque, custos e vendas em uma única plataforma integrada.',
      )
      app.save(record)
    } catch (_) {
      // skip if not found
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('segments', 'slug', 'industria')
      record.set(
        'description',
        'Eficiência produtiva e controle rigoroso de qualidade para o setor de manufatura.',
      )
      app.save(record)
    } catch (_) {
      // skip if not found
    }
  },
)
