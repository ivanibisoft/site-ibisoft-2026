migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-servicos')
      record.set(
        'description',
        'Gerencie de forma eficiente a prestação de serviços da sua empresa, desde o cadastro e execução até o faturamento. O sistema integra equipes internas e externas, automatiza a tributação e a emissão de NFS-e, além de permitir o acompanhamento completo das atividades realizadas.',
      )
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    // Down migration left empty as the previous description is not stored
  },
)
