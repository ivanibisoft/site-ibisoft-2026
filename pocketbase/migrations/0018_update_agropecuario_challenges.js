migrate(
  (app) => {
    let segment
    try {
      segment = app.findFirstRecordByData('segments', 'slug', 'agropecuario')
    } catch (_) {
      try {
        segment = app.findFirstRecordByData('segments', 'slug', 'agro')
      } catch (_) {
        console.log('Segment agropecuario or agro not found')
        return
      }
    }

    const existingChallenges = app.findRecordsByFilter(
      'segment_challenges',
      `segment = '${segment.id}'`,
      '',
      100,
      0,
    )

    for (const challenge of existingChallenges) {
      app.delete(challenge)
    }

    const challengesCol = app.findCollectionByNameOrId('segment_challenges')

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

    for (const chal of newChallenges) {
      const record = new Record(challengesCol)
      record.set('segment', segment.id)
      record.set('title', chal.title)
      record.set('description', chal.description)
      record.set('order', chal.order)
      app.save(record)
    }
  },
  (app) => {
    let segment
    try {
      segment = app.findFirstRecordByData('segments', 'slug', 'agropecuario')
    } catch (_) {
      try {
        segment = app.findFirstRecordByData('segments', 'slug', 'agro')
      } catch (_) {
        return
      }
    }

    const existingChallenges = app.findRecordsByFilter(
      'segment_challenges',
      `segment = '${segment.id}'`,
      '',
      100,
      0,
    )

    for (const challenge of existingChallenges) {
      app.delete(challenge)
    }
  },
)
