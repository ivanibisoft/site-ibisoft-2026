migrate(
  (app) => {
    try {
      let record = null
      try {
        record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-compras')
      } catch (_) {
        try {
          record = app.findFirstRecordByData('modules', 'name', 'Gestão de Compras')
        } catch (_) {}
      }

      if (record) {
        record.set(
          'description',
          'A gestão de compras no ERP "ibisoft Empresas" é uma solução poderosa e eficiente, projetada para otimizar o processo de aquisição e garantir que sua empresa faça a compra certa e necessária.',
        )
        app.save(record)
      }
    } catch (err) {
      console.log('Error updating Gestão de Compras description:', err)
    }
  },
  (app) => {
    // Revert not possible without knowing the previous text
  },
)
