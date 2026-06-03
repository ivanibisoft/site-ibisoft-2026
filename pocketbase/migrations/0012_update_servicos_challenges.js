migrate(
  (app) => {
    let servicosSegment
    try {
      servicosSegment = app.findFirstRecordByData('segments', 'slug', 'servicos')
    } catch (err) {
      console.log('Serviços segment not found, skipping migration.')
      return
    }

    // Remove existing challenges for this segment to avoid duplicates
    app
      .db()
      .newQuery('DELETE FROM segment_challenges WHERE segment = {:segmentId}')
      .bind({ segmentId: servicosSegment.id })
      .execute()

    const challenges = [
      {
        title: 'Gestão completa do ciclo de atendimento',
        description:
          'O sistema permite cadastrar serviços, controlar ordens de serviço, acompanhar a execução das atividades e integrar equipes externas por meio de aplicativo móvel. Isso proporciona maior controle operacional, padronização dos processos e melhor qualidade no atendimento ao cliente.',
        order: 1,
      },
      {
        title: 'Faturamento automatizado e conformidade fiscal',
        description:
          'O ERP automatiza a tributação dos serviços e a emissão de NFS-e, inclusive para contratos recorrentes. Isso reduz o trabalho manual, evita erros fiscais e garante mais agilidade no faturamento dos clientes.',
        order: 2,
      },
      {
        title: 'Maior produtividade das equipes',
        description:
          'Com agenda de tarefas, mensagens internas, registro de ocorrências e acompanhamento das equipes em campo, a empresa ganha mais organização, melhora a comunicação interna e aumenta a produtividade dos colaboradores.',
        order: 3,
      },
      {
        title: 'Controle financeiro e rentabilidade dos serviços',
        description:
          'A integração entre operações, faturamento e financeiro permite acompanhar receitas, despesas, fluxo de caixa e resultados de forma centralizada. Isso oferece maior previsibilidade financeira e apoia decisões para aumentar a lucratividade da empresa.',
        order: 4,
      },
    ]

    const challengeCollection = app.findCollectionByNameOrId('segment_challenges')

    for (const challenge of challenges) {
      const record = new Record(challengeCollection)
      record.set('segment', servicosSegment.id)
      record.set('title', challenge.title)
      record.set('description', challenge.description)
      record.set('order', challenge.order)
      app.save(record)
    }
  },
  (app) => {
    try {
      const servicosSegment = app.findFirstRecordByData('segments', 'slug', 'servicos')
      app
        .db()
        .newQuery('DELETE FROM segment_challenges WHERE segment = {:segmentId}')
        .bind({ segmentId: servicosSegment.id })
        .execute()
    } catch (_) {
      // ignore
    }
  },
)
