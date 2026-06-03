migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'cadastro-de-pessoas')
      record.set(
        'description',
        "Para a gestão mais eficiente de clientes, fornecedores, transportadoras e colaboradores o sistema de ERP 'ibisoft Empresas' oferece um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.",
      )
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'cadastro-de-pessoas')
      record.set(
        'description',
        "O sistema de ERP 'ibisoft Empresas' foi desenvolvido com o objetivo de fornecer uma solução completa e integrada para a gestão empresarial.",
      )
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
)
