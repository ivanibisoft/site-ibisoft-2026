migrate(
  (app) => {
    const challengesCollection = app.findCollectionByNameOrId('segment_challenges')

    const challengesData = {
      'atacadista-e-distribuidora': [
        {
          title: 'Controle de Estoque',
          description: 'Visibilidade em tempo real para evitar rupturas e excessos de mercadorias.',
        },
        {
          title: 'Roteirização de Entregas',
          description:
            'Otimização de rotas para redução de custos logísticos e agilidade na entrega.',
        },
        {
          title: 'Precificação Dinâmica',
          description:
            'Ajuste rápido e inteligente de preços com base em custos operacionais e de mercado.',
        },
        {
          title: 'Gestão de Compras',
          description:
            'Reposição automática de mercadorias baseada em histórico de demanda e sazonalidade.',
        },
      ],
      'comercio-exterior': [
        {
          title: 'Conformidade Tributária',
          description: 'Gestão de impostos e obrigações fiscais.',
        },
        { title: 'Rastreabilidade', description: 'Monitoramento de fluxos logísticos.' },
        { title: 'Gestão Logística', description: 'Otimização de modais e rotas.' },
        { title: 'Planejamento Financeiro', description: 'Controle de custos e câmbio.' },
      ],
      servicos: [
        {
          title: 'Rentabilidade de Projetos',
          description:
            'Acompanhamento detalhado de custos, margens de lucro e despesas por projeto.',
        },
        {
          title: 'Gestão de Contratos e Faturamento',
          description: 'Automação de cobranças recorrentes, reajustes e medições mensais.',
        },
        {
          title: 'Alocação de Equipe',
          description:
            'Distribuição eficiente de recursos humanos por competências e disponibilidade.',
        },
        {
          title: 'Controle de Horas (Timesheet)',
          description:
            'Registro preciso e auditável do tempo dedicado por profissional a cada cliente.',
        },
      ],
      industria: [
        {
          title: 'Eficiência de Produção (OEE)',
          description: 'Monitoramento avançado do desempenho dos equipamentos em tempo real.',
        },
        {
          title: 'Planejamento e Controle da Produção (PCP)',
          description:
            'Sincronização impecável entre demanda de mercado, estoque e capacidade fabril.',
        },
        {
          title: 'Gestão da Qualidade',
          description:
            'Controle rigoroso de especificações técnicas, inspeções e não conformidades.',
        },
        {
          title: 'Controle de Chão de Fábrica',
          description:
            'Apontamento em tempo real das ordens de produção, perdas e paradas não programadas.',
        },
      ],
      'genetica-animal': [
        {
          title: 'Rastreabilidade Biológica',
          description: 'Acompanhamento completo de linhagens, árvore genealógica e cruzamentos.',
        },
        {
          title: 'Gestão de Laboratório',
          description:
            'Controle preciso de amostras, processos internos e resultados de análises clínicas.',
        },
        {
          title: 'Controle Sanitário',
          description:
            'Monitoramento sistemático de protocolos de saúde animal, exames e vacinação.',
        },
        {
          title: 'Desempenho Zootécnico',
          description: 'Análise avançada de indicadores de produtividade e melhoramento genético.',
        },
      ],
    }

    for (const [slug, chals] of Object.entries(challengesData)) {
      try {
        const segment = app.findFirstRecordByData('segments', 'slug', slug)
        chals.forEach((chal, idx) => {
          const record = new Record(challengesCollection)
          record.set('segment', segment.id)
          record.set('title', chal.title)
          record.set('description', chal.description)
          record.set('order', idx)
          app.save(record)
        })
      } catch (_) {
        console.log(`Segment not found for slug: ${slug}`)
      }
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM segment_challenges').execute()
  },
)
