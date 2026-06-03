migrate(
  (app) => {
    const orderList = [
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

    for (let i = 0; i < orderList.length; i++) {
      try {
        const record = app.findFirstRecordByData('modules', 'name', orderList[i])
        record.set('order', i + 1)
        app.save(record)
      } catch (_) {
        // Ignorar se o módulo não existir
      }
    }
  },
  (app) => {
    // Down migration vazia
  },
)
