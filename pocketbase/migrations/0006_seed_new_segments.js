migrate(
  (app) => {
    // Clear existing records to ensure we match the exact required segments
    app.db().newQuery('DELETE FROM segment_challenges').execute()
    app.db().newQuery('DELETE FROM segments').execute()

    const segments = app.findCollectionByNameOrId('segments')

    const segs = [
      {
        title: 'Atacadista e Distribuidora',
        slug: 'atacadista-e-distribuidora',
        description:
          'Soluções completas para otimizar sua cadeia de suprimentos e distribuição corporativa.',
        icon: 'Truck',
      },
      {
        title: 'Comércio Exterior',
        slug: 'comercio-exterior',
        description:
          'Gestão inteligente e segura para importação e exportação com total conformidade fiscal.',
        icon: 'Globe',
      },
      {
        title: 'Serviços',
        slug: 'servicos',
        description:
          'Controle total sobre projetos, contratos e rentabilidade da sua operação de serviços.',
        icon: 'Briefcase',
      },
      {
        title: 'Indústria',
        slug: 'industria',
        description:
          'Eficiência produtiva e controle rigoroso de qualidade para o setor de manufatura.',
        icon: 'Factory',
      },
      {
        title: 'Genética Animal',
        slug: 'genetica-animal',
        description:
          'Rastreabilidade e gestão especializada para o setor agropecuário e pesquisa genética.',
        icon: 'Dna',
      },
    ]

    for (const s of segs) {
      const record = new Record(segments)
      record.set('title', s.title)
      record.set('slug', s.slug)
      record.set('description', s.description)
      record.set('icon', s.icon)
      app.save(record)
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM segments').execute()
  },
)
