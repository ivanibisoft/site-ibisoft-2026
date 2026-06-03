migrate(
  (app) => {
    const modules = [
      'Visão Geral',
      'Gestão de Pessoas',
      'Gestão de Produtos',
      'Gestão de Comércio Exterior',
      'Gestão de Compras',
      'Gestão de Estoque',
      'Gestão de Armazenagem',
      'Gestão Comercial',
      'Gestão Tributária',
      'Gestão de Comissões',
      'Gestão de Logística',
      'Gestão de Serviços',
      'Gestão de Produção',
      'Gestão Financeira',
      'Ferramentas de Produtividade',
      'Assistente Pessoal',
      'Segurança da Informação',
    ]

    for (let i = 0; i < modules.length; i++) {
      app
        .db()
        .newQuery('UPDATE modules SET `order` = {:order} WHERE name LIKE {:name}')
        .bind({ order: i + 1, name: modules[i] + '%' })
        .execute()
    }
  },
  (app) => {
    app.db().newQuery('UPDATE modules SET `order` = 0').execute()
  },
)
