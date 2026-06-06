migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-compras')
      record.set(
        'description',
        'Otimize todo o processo de compras da sua empresa com uma solução completa e integrada, desenvolvida para garantir maior controle, redução de custos e abastecimento eficiente dos estoques.',
      )
      app.save(record)
    } catch (err) {
      // Record not found, safely ignore
    }
  },
  (app) => {
    // No strict revert for text updates
  },
)
