migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'name', 'Assistente Pessoal')
      record.set(
        'description',
        'Mantenha sua empresa sempre informada e sob controle com alertas inteligentes sobre segurança de dados, atualizações do sistema, operações pendentes e obrigações fiscais. A Central de Alertas ajuda a prevenir riscos, evitar atrasos e garantir que informações importantes cheguem às pessoas certas no momento certo.',
      )
      app.save(record)
    } catch (_) {
      // Record not found, skip
    }
  },
  (app) => {
    // Revert not strictly defined, leaving as is since previous text is unknown
  },
)
