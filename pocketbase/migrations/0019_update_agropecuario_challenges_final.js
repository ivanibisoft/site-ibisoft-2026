migrate(
  (app) => {
    let segment
    try {
      segment = app.findFirstRecordByData('segments', 'slug', 'agropecuario')
    } catch (_) {
      return // Segment not found, nothing to do
    }

    // Delete existing challenges for this segment
    const existing = app.findRecordsByFilter(
      'segment_challenges',
      `segment="${segment.id}"`,
      '',
      100,
      0,
    )
    for (const record of existing) {
      app.delete(record)
    }

    const collection = app.findCollectionByNameOrId('segment_challenges')

    const challenges = [
      {
        title: 'Falta de rastreabilidade de materiais biológicos e produtos comercializados',
        description:
          'Empresas de genética animal precisam manter controle rigoroso de lotes, histórico de produção, validade e movimentação dos materiais comercializados. O ERP oferece rastreabilidade por lote, datas de fabricação e validade, garantindo segurança, conformidade e facilidade em auditorias e controles de qualidade.',
      },
      {
        title: 'Dificuldade no controle de estoque de materiais de alto valor agregado',
        description:
          'Sêmen, embriões, insumos laboratoriais e materiais biológicos exigem gestão precisa. O sistema controla estoque multiempresa, movimentações, custos médios, posições históricas e níveis mínimos e máximos, reduzindo perdas e melhorando o aproveitamento dos recursos.',
      },
      {
        title: 'Complexidade na gestão comercial e relacionamento com clientes',
        description:
          'A venda de genética animal envolve representantes, tabelas diferenciadas, histórico de negociações, acompanhamento de pedidos e gestão de comissões. O ERP integra todo o ciclo comercial, desde o orçamento até a entrega, oferecendo maior controle das negociações e melhor atendimento aos clientes.',
      },
      {
        title: 'Controle financeiro e tributário em operações especializadas',
        description:
          'O segmento lida com operações interestaduais, representantes comerciais, comissões e exigências fiscais específicas. O ERP automatiza cálculos tributários, controla comissões, acompanha fluxo de caixa e integra todas as informações financeiras, proporcionando maior segurança e rentabilidade.',
      },
    ]

    for (let i = 0; i < challenges.length; i++) {
      const c = challenges[i]
      const record = new Record(collection)
      record.set('segment', segment.id)
      record.set('title', c.title)
      record.set('description', c.description)
      record.set('order', i + 1)
      app.save(record)
    }
  },
  (app) => {
    let segment
    try {
      segment = app.findFirstRecordByData('segments', 'slug', 'agropecuario')
    } catch (_) {
      return
    }

    const existing = app.findRecordsByFilter(
      'segment_challenges',
      `segment="${segment.id}"`,
      '',
      100,
      0,
    )
    for (const record of existing) {
      app.delete(record)
    }
  },
)
