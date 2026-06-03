migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'segments',
        "description ~ 'Soluções completas para otimizar sua cadeia de suprimentos e distribuição corporativa'",
        '-created',
        10,
        0,
      )
      for (const record of records) {
        record.set('description', 'Gestão integrada de compras, armazenagem, vendas e entregas.')
        app.save(record)
      }
    } catch (err) {
      console.log('Failed to update segment description:', err)
    }
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'segments',
        "description ~ 'Gestão integrada de compras, armazenagem, vendas e entregas'",
        '-created',
        10,
        0,
      )
      for (const record of records) {
        record.set(
          'description',
          'Soluções completas para otimizar sua cadeia de suprimentos e distribuição corporativa.',
        )
        app.save(record)
      }
    } catch (err) {
      console.log('Failed to revert segment description:', err)
    }
  },
)
