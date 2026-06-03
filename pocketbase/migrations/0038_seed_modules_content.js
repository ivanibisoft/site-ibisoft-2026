migrate(
  (app) => {
    const modules = app.findRecordsByFilter('modules', '1=1', '', 1000, 0)

    const newDescription =
      "O sistema de ERP 'ibisoft Empresas' foi desenvolvido com o objetivo de fornecer uma solução completa e integrada para a gestão empresarial."

    const groupsData = [
      {
        name: 'Gestão Integrada e Eficiente',
        resources: [
          {
            name: 'Informações Relevantes',
            description:
              'Todas as informações relevantes ao negócio são geradas, disponibilizadas e avaliadas pelos colaboradores de maneira rápida e eficiente. Isso proporciona uma visão simples e completa das informações, essenciais para a tomada de decisões pelos gestores.',
          },
          {
            name: 'Tomada de Decisões',
            description:
              'Com dados precisos e atualizados, os gestores podem tomar decisões informadas e estratégicas, resultando em melhores resultados para todos os departamentos da empresa, tanto nas atividades operacionais quanto nas gerenciais e estratégicas.',
          },
        ],
      },
      {
        name: 'Modelo Multi-Empresa',
        resources: [
          {
            name: 'Visão Individual e Geral',
            description:
              'O sistema permite uma visão individual de cada empresa do grupo, bem como uma visão geral de todas as empresas administradas. Isso facilita o controle e a análise de desempenho de cada unidade de negócio.',
          },
          {
            name: 'Controle Simplificado',
            description:
              "O modelo funcional do 'ibisoft Empresas' permite controlar de maneira simples as informações comerciais, financeiras e de estoques de cada empresa individualmente e do grupo como um todo.",
          },
        ],
      },
      {
        name: 'Benefícios para Todos os Departamentos',
        resources: [
          {
            name: 'Operacional',
            description:
              'Melhoria na eficiência das operações diárias, com processos automatizados e integrados.',
          },
          {
            name: 'Gerencial',
            description:
              'Ferramentas de análise e relatórios detalhados que auxiliam na gestão e no planejamento estratégico.',
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
        resources: [
          {
            name: 'Interface Intuitiva',
            description:
              'Interface amigável e intuitiva, facilitando a adoção e o uso do sistema por todos os colaboradores.',
          },
          {
            name: 'Customização',
            description:
              'Possibilidade de customização para atender às necessidades específicas de cada empresa.',
          },
          {
            name: 'Suporte e Atualizações',
            description:
              'Suporte técnico especializado e atualizações constantes para garantir que o sistema esteja sempre alinhado com as melhores práticas do mercado.',
          },
        ],
      },
    ]

    const resourceGroupsCol = app.findCollectionByNameOrId('resource_groups')
    const resourcesCol = app.findCollectionByNameOrId('resources')

    for (const module of modules) {
      module.set('description', newDescription)
      app.save(module)

      // Clear existing groups and resources for this module to replace with new data
      const existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${module.id}'`,
        '',
        1000,
        0,
      )
      for (const group of existingGroups) {
        const existingResources = app.findRecordsByFilter(
          'resources',
          `group = '${group.id}'`,
          '',
          1000,
          0,
        )
        for (const resource of existingResources) {
          app.delete(resource)
        }
        app.delete(group)
      }

      // Seed new groups and resources
      let groupOrder = 1
      for (const groupDef of groupsData) {
        const groupRecord = new Record(resourceGroupsCol)
        groupRecord.set('module', module.id)
        groupRecord.set('name', groupDef.name)
        groupRecord.set('order', groupOrder)
        app.save(groupRecord)

        for (const resourceDef of groupDef.resources) {
          const resourceRecord = new Record(resourcesCol)
          resourceRecord.set('group', groupRecord.id)
          resourceRecord.set('name', resourceDef.name)
          resourceRecord.set('description', resourceDef.description)
          app.save(resourceRecord)
        }
        groupOrder++
      }
    }
  },
  (app) => {
    // Down migration intentionally left blank to avoid data loss on rollback.
  },
)
