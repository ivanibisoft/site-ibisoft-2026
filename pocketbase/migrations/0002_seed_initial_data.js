migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'ivan@ibisoft.com.br')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('ivan@ibisoft.com.br')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    const casesCol = app.findCollectionByNameOrId('cases')
    const casesData = [
      {
        title: 'Expansão ágil com controle total',
        slug: 'expansao-agil',
        description:
          'A Distribuidora Central precisava expandir suas operações para 3 novos estados. Com o ERP ibisoft, conseguiram unificar o controle de estoque multissites e automatizar o faturamento, suportando o crescimento sem aumentar a equipe de backoffice.',
        category: 'Distribuição',
        client_name: 'Distribuidora Central',
        featured: true,
      },
      {
        title: 'Visibilidade e redução de perdas',
        slug: 'reducao-perdas',
        description:
          'Enfrentando desafios com validade de produtos e rastreabilidade, a AgroSul implementou nosso módulo de gestão de lotes. O resultado foi imediato: redução drástica no desperdício e total conformidade com as exigências regulatórias.',
        category: 'Agronegócio',
        client_name: 'AgroSul S/A',
        featured: true,
      },
      {
        title: 'Integração contábil e fiscal ágil',
        slug: 'integracao-contabil',
        description:
          'O fechamento mensal demorava mais de 15 dias devido a sistemas desconectados. A substituição pelo ERP ibisoft integrou o PCP ao financeiro e fiscal. Hoje, o fechamento é realizado com 100% de precisão nos impostos apurados.',
        category: 'Indústria',
        client_name: 'Indústria Metálica Forte',
        featured: true,
      },
      {
        title: 'Transformação do Comércio Exterior',
        slug: 'comercio-exterior',
        description:
          'Gerenciar dezenas de processos de importação em planilhas causava atrasos aduaneiros constantes. O módulo Comex automatizou a geração de LIs e o cálculo de custo nacionalizado, aumentando a margem de lucro.',
        category: 'Comércio Exterior',
        client_name: 'Global Import',
        featured: true,
      },
      {
        title: 'Excelência na prestação de serviços',
        slug: 'prestacao-servicos',
        description:
          'A medição de contratos e faturamento de horas trabalhadas era um gargalo. A automação permitiu que os técnicos registrassem horas via app, integrando diretamente com o faturamento automático no final do mês.',
        category: 'Serviços',
        client_name: 'TechServ Soluções',
        featured: true,
      },
    ]

    for (const data of casesData) {
      try {
        app.findFirstRecordByData('cases', 'slug', data.slug)
      } catch (_) {
        const record = new Record(casesCol)
        record.set('title', data.title)
        record.set('slug', data.slug)
        record.set('description', data.description)
        record.set('category', data.category)
        record.set('client_name', data.client_name)
        record.set('featured', data.featured)
        app.save(record)
      }
    }

    const teamCol = app.findCollectionByNameOrId('team_members')
    try {
      app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
    } catch (_) {
      const record = new Record(teamCol)
      record.set('name', 'Ivan Christófolli')
      record.set('role', 'CEO')
      record.set(
        'bio',
        'Com larga experiência em engenharia de software e gestão empresarial, Ivan tem liderado a expansão da ibisoft com foco obsessivo no sucesso do cliente e na excelência técnica da plataforma, guiando a empresa para se tornar referência nacional em soluções de ERP.',
      )
      record.set('order', 1)
      app.save(record)
    }
  },
  (app) => {
    app.db().newQuery("DELETE FROM team_members WHERE name = 'Ivan Christófolli'").execute()
    app
      .db()
      .newQuery(
        "DELETE FROM cases WHERE slug IN ('expansao-agil', 'reducao-perdas', 'integracao-contabil', 'comercio-exterior', 'prestacao-servicos')",
      )
      .execute()
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'ivan@ibisoft.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
