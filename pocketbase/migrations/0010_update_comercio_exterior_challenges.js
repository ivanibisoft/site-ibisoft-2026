migrate(
  (app) => {
    try {
      const segment = app.findFirstRecordByData('segments', 'slug', 'comercio-exterior')

      // Delete existing challenges for this segment to avoid duplicates
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

      const challenges = [
        {
          title: '1. Conformidade tributária em operações interestaduais e internacionais',
          description:
            'Empresas de comércio exterior convivem com regras fiscais complexas, múltiplas alíquotas e constantes atualizações legais. O ERP da ibisoft automatiza a geração de tributos, calcula DIFAL, gera EFD ICMS e EFD Contribuições e permite atualização das regras tributárias, reduzindo riscos de erros, multas e retrabalho nas operações de importação e distribuição nacional.',
          order: 1,
        },
        {
          title: '2. Rastreabilidade completa de mercadorias e lotes',
          description:
            'O sistema controla lotes de fabricação, lotes de venda, datas de fabricação e validade, além de permitir rastreamento por lote ou número de série. Para importadores e exportadores, isso aumenta a segurança operacional, facilita auditorias e atende exigências regulatórias de diversos setores, como alimentos, químicos, cosméticos e produtos industriais.',
          order: 2,
        },
        {
          title: '3. Gestão logística integrada da cadeia de distribuição',
          description:
            'O ERP integra processos de transporte, expedição e documentação fiscal, permitindo controle de transportadoras, veículos, cubagem, pesagem, carregamento e emissão de CT-e e MDF-e. Isso proporciona maior eficiência na movimentação de mercadorias importadas ou destinadas à exportação, reduzindo custos logísticos e aumentando a previsibilidade das entregas.',
          order: 3,
        },
        {
          title: '4. Melhor planejamento financeiro e controle do capital de giro',
          description:
            'As operações de comércio exterior normalmente envolvem ciclos financeiros mais longos, variações cambiais e alto volume de capital imobilizado em estoque. O ERP oferece fluxo de caixa projetado, controle financeiro multiempresa, avaliação de crédito, gestão de recebimentos e relatórios gerenciais que ajudam a melhorar a previsibilidade financeira e a tomada de decisão.',
          order: 4,
        },
      ]

      const collection = app.findCollectionByNameOrId('segment_challenges')

      for (const data of challenges) {
        const record = new Record(collection)
        record.set('segment', segment.id)
        record.set('title', data.title)
        record.set('description', data.description)
        record.set('order', data.order)
        app.save(record)
      }
    } catch (_) {
      // segment not found, skip
    }
  },
  (app) => {
    try {
      const segment = app.findFirstRecordByData('segments', 'slug', 'comercio-exterior')
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
    } catch (_) {
      // segment not found, skip
    }
  },
)
