migrate(
  (app) => {
    try {
      const segments = app.findCollectionByNameOrId('segments')
      const challengesCol = app.findCollectionByNameOrId('segment_challenges')

      // Find the 'agro' segment
      const agroSegment = app.findFirstRecordByData('segments', 'slug', 'agro')

      // Delete existing challenges for agro to ensure idempotency
      app
        .db()
        .newQuery('DELETE FROM segment_challenges WHERE segment = {:segmentId}')
        .bind({ segmentId: agroSegment.id })
        .execute()

      // Insert new challenges
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

      for (const data of newChallenges) {
        const record = new Record(challengesCol)
        record.set('segment', agroSegment.id)
        record.set('title', data.title)
        record.set('description', data.description)
        record.set('order', data.order)
        app.save(record)
      }
    } catch (err) {
      console.log('Error updating agro challenges:', err)
    }
  },
  (app) => {
    try {
      const agroSegment = app.findFirstRecordByData('segments', 'slug', 'agro')
      app
        .db()
        .newQuery('DELETE FROM segment_challenges WHERE segment = {:segmentId}')
        .bind({ segmentId: agroSegment.id })
        .execute()
    } catch (err) {
      console.log('Error reverting agro challenges:', err)
    }
  },
)
