migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-produtos')
      record.set(
        'description',
        'A gestão de produtos do ERP "ibisoft Empresas" é uma solução abrangente e poderosa, projetada para centralizar e otimizar todas as informações relacionadas aos produtos da sua empresa.',
      )
      app.save(record)
    } catch (_) {
      // try by name if slug fails
      try {
        const record = app.findFirstRecordByData('modules', 'name', 'Gestão de Produtos')
        record.set(
          'description',
          'A gestão de produtos do ERP "ibisoft Empresas" é uma solução abrangente e poderosa, projetada para centralizar e otimizar todas as informações relacionadas aos produtos da sua empresa.',
        )
        app.save(record)
      } catch (err) {
        console.log("Module 'Gestão de Produtos' not found")
      }
    }
  },
  (app) => {
    // Empty down migration as previous state is unknown
  },
)
