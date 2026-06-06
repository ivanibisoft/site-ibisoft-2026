migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'name', 'Gestão de Estoque')
      record.set(
        'description',
        'Solução completa que permite acompanhar movimentações, custos, níveis de estoque, entradas e saídas em tempo real, garantindo maior precisão operacional e melhor aproveitamento do capital de giro.',
      )
      app.save(record)
    } catch (_) {
      try {
        const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-estoque')
        record.set(
          'description',
          'Solução completa que permite acompanhar movimentações, custos, níveis de estoque, entradas e saídas em tempo real, garantindo maior precisão operacional e melhor aproveitamento do capital de giro.',
        )
        app.save(record)
      } catch (_) {
        console.log('Module Gestão de Estoque not found')
      }
    }
  },
  (app) => {
    // Revert not possible without knowing original state
  },
)
