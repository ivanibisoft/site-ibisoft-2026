migrate(
  (app) => {
    let segmentId = null
    const possibleSlugs = ['agropecuario', 'agropecuaria', 'agro', 'genetica-animal', 'genetica']
    for (const slug of possibleSlugs) {
      try {
        const seg = app.findFirstRecordByData('segments', 'slug', slug)
        segmentId = seg.id
        break
      } catch (_) {}
    }

    if (!segmentId) {
      console.log('Segment for Agropecuario/Animal Genetics not found')
      return
    }

    // Delete existing challenges for this segment
    app
      .db()
      .newQuery(`DELETE FROM segment_challenges WHERE segment = {:segmentId}`)
      .bind({ segmentId: segmentId })
      .execute()

    // Add new challenges
    const challenges = [
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

    const collection = app.findCollectionByNameOrId('segment_challenges')

    for (const c of challenges) {
      const record = new Record(collection)
      record.set('segment', segmentId)
      record.set('title', c.title)
      record.set('description', c.description)
      record.set('order', c.order)
      app.save(record)
    }
  },
  (app) => {
    // Down migration is safely left empty because restoring old data is complex without a snapshot.
  },
)
