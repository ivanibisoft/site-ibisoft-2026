migrate(
  (app) => {
    let mod
    try {
      mod = app.findFirstRecordByData('modules', 'slug', 'dashboards-executivos')
    } catch (_) {
      return
    }

    const rgCol = app.findCollectionByNameOrId('resource_groups')
    const rCol = app.findCollectionByNameOrId('resources')

    const groups = [
      {
        name: 'Gestão Integrada e Eficiente',
        order: 1,
        resources: [
          {
            name: 'Informações Relevantes',
            description:
              'Todas as informações relevantes ao negócio são geradas, disponibilizadas e avaliadas pelos colaboradores de maneira rápida e eficiente.',
          },
          {
            name: 'Tomada de Decisões',
            description:
              'Com dados precisos e atualizados, os gestores podem tomar decisões informadas e estratégicas.',
          },
        ],
      },
      {
        name: 'Modelo Multi-Empresa',
        order: 2,
        resources: [
          {
            name: 'Visão Individual e Geral',
            description:
              'O sistema permite uma visão individual de cada empresa do grupo, bem como uma visão geral de todas as empresas administradas.',
          },
          {
            name: 'Controle Simplificado',
            description:
              'Controle de maneira simples as informações comerciais, financeiras e de estoques de cada empresa individualmente.',
          },
        ],
      },
      {
        name: 'Benefícios por Departamento',
        order: 3,
        resources: [
          {
            name: 'Operacional',
            description:
              'Melhoria na eficiência das operações diárias, com processos automatizados e integrados.',
          },
          {
            name: 'Gerencial',
            description: 'Ferramentas de análise e relatórios detalhados que auxiliam na gestão.',
          },
          {
            name: 'Estratégico',
            description:
              'Visão holística do negócio, permitindo a identificação de oportunidades e a mitigação de riscos.',
          },
        ],
      },
      {
        name: 'Recursos Adicionais',
        order: 4,
        resources: [
          {
            name: 'Interface Intuitiva',
            description: 'Interface amigável e intuitiva, facilitando a adoção e o uso do sistema.',
          },
          {
            name: 'Customização',
            description:
              'Possibilidade de customização para atender às necessidades específicas de cada empresa.',
          },
          {
            name: 'Suporte e Atualizações',
            description: 'Suporte técnico especializado e atualizações constantes.',
          },
        ],
      },
    ]

    for (const g of groups) {
      let grp
      try {
        grp = app.findFirstRecordByFilter(
          'resource_groups',
          `module="${mod.id}" && name="${g.name}"`,
        )
      } catch (_) {
        grp = new Record(rgCol)
        grp.set('module', mod.id)
        grp.set('name', g.name)
        grp.set('order', g.order)
        app.save(grp)
      }

      for (const r of g.resources) {
        try {
          app.findFirstRecordByFilter('resources', `group="${grp.id}" && name="${r.name}"`)
        } catch (_) {
          const res = new Record(rCol)
          res.set('group', grp.id)
          res.set('name', r.name)
          res.set('description', r.description)
          app.save(res)
        }
      }
    }
  },
  (app) => {
    let mod
    try {
      mod = app.findFirstRecordByData('modules', 'slug', 'dashboards-executivos')
    } catch (_) {
      return
    }

    const grps = app.findRecordsByFilter('resource_groups', `module="${mod.id}"`, '', 100, 0)
    for (const g of grps) {
      const res = app.findRecordsByFilter('resources', `group="${g.id}"`, '', 100, 0)
      for (const r of res) {
        app.delete(r)
      }
      app.delete(g)
    }
  },
)
