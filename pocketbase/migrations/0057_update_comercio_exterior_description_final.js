migrate(
  (app) => {
    const records = app.findRecordsByFilter(
      'modules',
      "name ~ 'Comércio Exterior' || slug ~ 'comercio-exterior'",
      '',
      10,
      0,
    )

    for (const record of records) {
      record.set(
        'description',
        'Automatize os processos, controle documentos, aplique regras tributárias específicas e calcule com precisão os custos reais das importações, proporcionando mais agilidade, conformidade e controle sobre as operações internacionais da sua empresa.',
      )
      app.save(record)
    }
  },
  (app) => {
    // down migration empty
  },
)
