migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-comissoes')
      record.set(
        'description',
        'Automatize o cálculo e o controle de comissões com total flexibilidade e transparência. O sistema permite gerenciar múltiplos comissionados por venda, aplicar regras personalizadas de remuneração, controlar antecipações, bônus, estornos e pagamentos, além de considerar metas e resultados para o cálculo das comissões.',
      )
      app.save(record)
    } catch (_) {
      try {
        const recordByName = app.findFirstRecordByData('modules', 'name', 'Gestão de Comissões')
        recordByName.set(
          'description',
          'Automatize o cálculo e o controle de comissões com total flexibilidade e transparência. O sistema permite gerenciar múltiplos comissionados por venda, aplicar regras personalizadas de remuneração, controlar antecipações, bônus, estornos e pagamentos, além de considerar metas e resultados para o cálculo das comissões.',
        )
        app.save(recordByName)
      } catch (_) {
        console.log("Module 'Gestão de Comissões' not found.")
      }
    }
  },
  (app) => {
    // No down migration
  },
)
