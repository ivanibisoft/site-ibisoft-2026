migrate(
  (app) => {
    let record
    try {
      record = app.findFirstRecordByData('modules', 'name', 'Gestão de Logística')
    } catch (_) {
      try {
        record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-logistica')
      } catch (_) {
        console.log("Module 'Gestão de Logística' not found. Skipping update.")
        return
      }
    }

    if (record) {
      record.set(
        'description',
        'Simplifique e automatize a gestão logística da sua empresa, desde o planejamento do transporte até a entrega dos produtos. O sistema controla transportadores, motoristas, veículos e cargas, calcula automaticamente pesos, volumes e cubagem, além de emitir documentos fiscais de transporte de forma integrada.',
      )
      app.save(record)
    }
  },
  (app) => {
    // Down migration is a no-op as the previous description isn't tracked in this migration context.
  },
)
