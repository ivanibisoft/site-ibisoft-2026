migrate(
  (app) => {
    const challengesCol = app.findCollectionByNameOrId('segment_challenges')

    let agroSegment
    try {
      agroSegment = app.findFirstRecordByData('segments', 'slug', 'agro')
    } catch (_) {
      try {
        agroSegment = app.findFirstRecordByData('segments', 'slug', 'agropecuario')
      } catch (_) {
        try {
          agroSegment = app.findFirstRecordByFilter('segments', "title ~ 'Agro' || title ~ 'agro'")
        } catch (_) {
          console.log('Agro segment not found')
          return
        }
      }
    }

    // Remove existing challenges for this segment to avoid duplicates
    const existingChallenges = app.findRecordsByFilter(
      'segment_challenges',
      `segment = '${agroSegment.id}'`,
      '',
      100,
      0,
    )

    for (const record of existingChallenges) {
      app.delete(record)
    }

    // Insert updated challenges
    const newChallenges = [
      {
        title: '1. Falta de rastreabilidade de materiais biológicos e produtos comercializados',
        description:
          'Empresas de genética animal precisam manter controle rigoroso de lotes, histórico de produção, validade e movimentação dos materiais comercializados. O ERP oferece rastreabilidade por lote, datas de fabricação e validade, garantindo segurança, conformidade e facilidade em auditorias e controles de qualidade.',
        order: 1,
      },
      {
        title: '2. Dificuldade no controle de estoque de materiais de alto valor agregado',
        description:
          'Sêmen, embriões, insumos laboratoriais e materiais biológicos exigem gestão precisa. O sistema controla estoque multiempresa, movimentações, custos médios, posições históricas e níveis mínimos e máximos, reduzindo perdas e melhorando o aproveitamento dos recursos.',
        order: 2,
      },
      {
        title: '3. Complexidade na gestão comercial e relacionamento com clientes',
        description:
          'A venda de genética animal envolve representantes, tabelas diferenciadas, histórico de negociações, acompanhamento de pedidos e gestão de comissões. O ERP integra todo o ciclo comercial, desde o orçamento até a entrega, oferecendo maior controle das negociações e melhor atendimento aos clientes.',
        order: 3,
      },
      {
        title: '4. Controle financeiro e tributário em operações especializadas',
        description:
          'O segmento lida com operações interestaduais, representantes comerciais, comissões e exigências fiscais específicas. O ERP automatiza cálculos tributários, controla comissões, acompanha fluxo de caixa e integra todas as informações financeiras, proporcionando maior segurança e rentabilidade.',
        order: 4,
      },
    ]

    for (const c of newChallenges) {
      const record = new Record(challengesCol)
      record.set('segment', agroSegment.id)
      record.set('title', c.title)
      record.set('description', c.description)
      record.set('order', c.order)
      app.save(record)
    }
  },
  (app) => {
    // We cannot easily revert to the original un-updated challenges without knowing their prior state
  },
)
