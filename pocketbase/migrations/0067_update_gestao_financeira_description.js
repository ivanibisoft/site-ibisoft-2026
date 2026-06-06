migrate(
  (app) => {
    app
      .db()
      .newQuery(
        `UPDATE modules SET description = {:desc} WHERE slug = 'gestao-financeira' OR name = 'Gestão Financeira'`,
      )
      .bind({
        desc: 'O módulo Financeiro do ibisoft Empresas automatiza contas a pagar e receber, fluxo de caixa, conciliação bancária, cobranças, crédito de clientes e planejamento financeiro, proporcionando mais agilidade e segurança na gestão dos recursos.',
      })
      .execute()
  },
  (app) => {
    // no-op
  },
)
