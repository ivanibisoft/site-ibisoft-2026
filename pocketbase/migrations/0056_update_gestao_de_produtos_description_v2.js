migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-produtos')
      record.set(
        'description',
        'Solução completa para gestão de produtos, com cadastro centralizado, controle de custos, fichas técnicas, precificação inteligente e informações detalhadas para apoiar os processos de compras, vendas, produção, logística e gestão fiscal.',
      )
      app.save(record)
    } catch (err) {
      // Record not found or error, skip
    }
  },
  (app) => {
    // Down migration not applicable
  },
)
