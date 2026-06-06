migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'name', 'Gestão Comercial')
      record.set(
        'description',
        'Aumente a produtividade da equipe comercial e tenha controle total sobre o processo de vendas, da prospecção ao faturamento. Com automação de tarefas, gestão de clientes, controle de pedidos e acompanhamento de resultados, sua empresa reduz erros, agiliza operações e toma decisões mais estratégicas para aumentar as vendas e a rentabilidade.',
      )
      app.save(record)
    } catch (_) {
      console.log("Module 'Gestão Comercial' not found")
    }
  },
  (app) => {
    // Revert not possible without knowing the previous description
  },
)
