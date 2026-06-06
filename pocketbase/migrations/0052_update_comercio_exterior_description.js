migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-comercio-exterior')
      record.set(
        'description',
        'O módulo de gestão de comércio exterior do ERP "ibisoft Empresas" foi desenvolvido para atender às complexidades e especificidades das operações de importação e exportação.',
      )
      app.save(record)
    } catch (_) {
      try {
        const record = app.findFirstRecordByData('modules', 'name', 'Gestão de Comércio Exterior')
        record.set(
          'description',
          'O módulo de gestão de comércio exterior do ERP "ibisoft Empresas" foi desenvolvido para atender às complexidades e especificidades das operações de importação e exportação.',
        )
        app.save(record)
      } catch (_) {}
    }
  },
  (app) => {
    // Revert is not implemented as we don't have the exact previous text
  },
)
