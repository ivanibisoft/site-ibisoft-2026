migrate(
  (app) => {
    const segmentsCol = app.findCollectionByNameOrId('segments')
    const challengesCol = app.findCollectionByNameOrId('segment_challenges')

    const data = [
      {
        segment: {
          title: 'Distribuição e Atacado',
          slug: 'distribuicao-e-atacado',
          description:
            'Descubra como o ERP ibisoft Empresas resolve os desafios específicos do setor de distribuição e atacado, otimizando processos e garantindo vantagens competitivas reais.',
          icon: 'Truck',
        },
        challenges: [
          {
            title: '1. Redução de rupturas e excesso de estoque',
            description:
              'O sistema ibisoft utiliza um mecanismo inteligente de sugestão de compras que analisa estoque atual, vendas médias, estoque mínimo, previsões de entrada e saída, prazo de entrega dos fornecedores e período de cobertura desejado. Isso ajuda distribuidores a manterem o estoque equilibrado, reduzindo capital parado e evitando perda de vendas por falta de mercadorias.',
            order: 1,
          },
          {
            title: '2. Maior eficiência operacional no armazém e expedição',
            description:
              'A gestão de armazenagem permite controle por locais, divisões e subdivisões, sugere posições de armazenagem, controla lotes, facilita transferências internas e oferece conferência de pedidos antes da expedição. Para atacadistas com grande volume de itens e movimentação diária intensa, isso reduz erros de separação e aumenta a produtividade logística.',
            order: 2,
          },
          {
            title: '3. Mais controle e rentabilidade nas operações comerciais',
            description:
              'O ERP da ibisoft oferece gestão completa do ciclo de vendas, com tabelas de preços diferenciadas por cliente, reserva automática de estoque, análise financeira antes da aprovação do pedido, histórico comercial e relatórios de margem e rentabilidade. Isso permite ao distribuidor vender com mais segurança e controlar melhor suas margens.',
            order: 3,
          },
          {
            title: '4. Agilidade fiscal e logística para operações de distribuição',
            description:
              'O sistema automatiza cálculos tributários, emissão de NF-e, EFD, DIFAL e demais obrigações fiscais, além de integrar CT-e e MDF-e à operação logística. Isso reduz riscos fiscais, acelera o faturamento e melhora a gestão do transporte e das entregas, fatores essenciais para empresas distribuidoras que operam em diferentes estados.',
            order: 4,
          },
        ],
      },
      {
        segment: {
          title: 'Comércio Exterior',
          slug: 'comercio-exterior',
          description:
            'Descubra como o ERP ibisoft Empresas resolve os desafios específicos do setor de comércio exterior, otimizando processos e garantindo vantagens competitivas reais.',
          icon: 'Globe',
        },
        challenges: [
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
        ],
      },
    ]

    for (const item of data) {
      try {
        app.findFirstRecordByData('segments', 'slug', item.segment.slug)
        // Already seeded
      } catch (_) {
        const segRecord = new Record(segmentsCol)
        segRecord.set('title', item.segment.title)
        segRecord.set('slug', item.segment.slug)
        segRecord.set('description', item.segment.description)
        segRecord.set('icon', item.segment.icon)
        app.save(segRecord)

        for (const challenge of item.challenges) {
          const chalRecord = new Record(challengesCol)
          chalRecord.set('segment', segRecord.id)
          chalRecord.set('title', challenge.title)
          chalRecord.set('description', challenge.description)
          chalRecord.set('order', challenge.order)
          app.save(chalRecord)
        }
      }
    }
  },
  (app) => {
    const slugs = ['distribuicao-e-atacado', 'comercio-exterior']
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('segments', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
