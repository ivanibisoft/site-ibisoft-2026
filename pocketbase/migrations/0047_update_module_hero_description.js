migrate(
  (app) => {
    app
      .db()
      .newQuery(`
    UPDATE modules
    SET description = 'O sistema de ERP "ibisoft Empresas" oferece uma gestão eficiente de clientes, fornecedores, transportadoras e colaboradores, com um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.'
  `)
      .execute()
  },
  (app) => {
    // Down migration not applicable
  },
)
