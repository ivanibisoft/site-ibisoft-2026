migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-pessoas')
      record.set(
        'description',
        'O sistema de ERP "ibisoft Empresas" oferece uma gestão eficiente de clientes, fornecedores, transportadoras e colaboradores, com um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.',
      )
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
  (app) => {
    // Down migration is intentionally empty as we don't have the previous description
  },
)
