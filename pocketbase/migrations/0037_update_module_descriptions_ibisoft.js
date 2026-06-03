migrate(
  (app) => {
    app
      .db()
      .newQuery('UPDATE modules SET description = {:desc}')
      .bind({
        desc: "O sistema de ERP 'ibisoft Empresas' foi desenvolvido com o objetivo de fornecer uma solução completa e integrada para a gestão empresarial.",
      })
      .execute()
  },
  (app) => {
    // Revert is not trivial without a backup, doing nothing
  },
)
