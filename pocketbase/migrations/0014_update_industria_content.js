migrate(
  (app) => {
    let segment
    try {
      segment = app.findFirstRecordByData('segments', 'slug', 'industria')
    } catch (_) {
      // Segment not found, skip migration
      return
    }

    // Update segment description
    segment.set(
      'description',
      'Controle produção, estoque, custos e vendas em uma única plataforma integrada.',
    )
    app.save(segment)

    // Clear existing challenges for this segment
    try {
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
    } catch (_) {}

    // Add new challenges
    const challenges = [
      {
        title: '1. Falta de controle sobre matérias-primas, produção e produtos acabados',
        description:
          'Muitas indústrias enfrentam dificuldades para acompanhar o consumo de insumos, a produção em andamento e o estoque final. O ERP integra todas as etapas produtivas, controlando matérias-primas, produtos intermediários e produtos acabados, garantindo rastreabilidade e maior previsibilidade operacional.',
        order: 1,
      },
      {
        title: '2. Dificuldade em calcular custos e margens de produção',
        description:
          'Sem informações precisas sobre materiais, insumos, serviços e custos indiretos, a precificação pode comprometer a rentabilidade. O sistema mantém fichas técnicas completas dos produtos e utiliza essas informações para apoiar a formação de preços e a análise de resultados.',
        order: 2,
      },
      {
        title: '3. Desperdícios, atrasos e baixa eficiência produtiva',
        description:
          'A falta de integração entre demanda, estoque e produção gera retrabalho, desperdícios e atrasos nas entregas. O ERP gera ordens de produção com base na demanda prevista e automatiza a requisição de componentes e a entrada dos produtos produzidos, aumentando a eficiência da fábrica.',
        order: 3,
      },
      {
        title: '4. Complexidade fiscal e exigências regulatórias da indústria',
        description:
          'Atender às obrigações fiscais e manter a documentação correta da produção é um desafio constante. O sistema automatiza a gestão tributária e gera o SPED Fiscal com Bloco K completo, facilitando o cumprimento das exigências legais e reduzindo riscos de autuações.',
        order: 4,
      },
    ]

    const collection = app.findCollectionByNameOrId('segment_challenges')
    for (const c of challenges) {
      const record = new Record(collection)
      record.set('segment', segment.id)
      record.set('title', c.title)
      record.set('description', c.description)
      record.set('order', c.order)
      app.save(record)
    }
  },
  (app) => {
    // Down migration is intentionally empty as this is a specific data override
  },
)
