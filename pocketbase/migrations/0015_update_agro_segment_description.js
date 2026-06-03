migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'segments',
        'description',
        'Rastreabilidade e gestão especializada para o setor agropecuário e pesquisa genética.',
      )
      record.set(
        'description',
        'Controle amostras, rastreabilidade, produção, vendas e finanças em uma única plataforma.',
      )
      app.save(record)
    } catch (_) {
      // Record might not exist or already be updated
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'segments',
        'description',
        'Controle amostras, rastreabilidade, produção, vendas e finanças em uma única plataforma.',
      )
      record.set(
        'description',
        'Rastreabilidade e gestão especializada para o setor agropecuário e pesquisa genética.',
      )
      app.save(record)
    } catch (_) {
      // Record might not exist or already be reverted
    }
  },
)
