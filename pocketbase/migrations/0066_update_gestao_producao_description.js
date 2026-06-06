migrate(
  (app) => {
    let record
    try {
      record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-producao')
    } catch (e) {
      try {
        record = app.findFirstRecordByData('modules', 'slug', 'producao')
      } catch (e2) {
        console.log('Module Gestão de Produção not found')
        return
      }
    }

    record.set(
      'description',
      'Controle todas as etapas do processo produtivo com mais eficiência, rastreabilidade e precisão. O módulo de Produção do ibisoft Empresas gerencia matérias-primas, produtos intermediários e produtos acabados, integrando estoque, custos, fichas técnicas e ordens de produção em uma única plataforma.',
    )
    app.save(record)
  },
  (app) => {
    // No revert implemented as previous state is unknown
  },
)
