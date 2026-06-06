migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'visao-geral')
      record.set(
        'description',
        'Solução completa e integrada para a gestão empresarial, desenvolvida para impulsionar o crescimento sustentável, aumentar a eficiência operacional e fortalecer a competitividade do negócio.',
      )
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
  (app) => {
    // Revert not possible without knowing the previous text
  },
)
