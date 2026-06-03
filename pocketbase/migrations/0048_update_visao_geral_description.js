migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'visao-geral')
      record.set(
        'description',
        'O sistema de ERP "ibisoft Empresas" foi desenvolvido com o objetivo de fornecer uma solução completa e integrada para a gestão empresarial.',
      )
      app.save(record)
    } catch (_) {
      // Record not found, safely ignore
    }
  },
  (app) => {
    // Down migration left intentionally blank
  },
)
