migrate(
  (app) => {
    const modulesCol = app.findCollectionByNameOrId('modules')
    const groupsCol = app.findCollectionByNameOrId('resource_groups')
    const resourcesCol = app.findCollectionByNameOrId('resources')

    let moduleRecord
    try {
      moduleRecord = app.findFirstRecordByData('modules', 'slug', 'gestao-de-pessoas')
    } catch (_) {
      moduleRecord = new Record(modulesCol)
      moduleRecord.set('slug', 'gestao-de-pessoas')
      moduleRecord.set('name', 'Gestão de Pessoas')
      moduleRecord.set('icon', 'Users')
      moduleRecord.set('order', 2)
    }

    moduleRecord.set(
      'description',
      'O cadastro de pessoas físicas, jurídicas e estrangeiras mais completo do mercado, com mais de 200 informações detalhadas para atender aos departamentos comercial, financeiro, crédito, fiscal, tributário, gerencial, logística e estatística.',
    )
    app.save(moduleRecord)

    // Clear existing groups and resources to avoid duplicates
    try {
      const existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${moduleRecord.id}'`,
        '',
        100,
        0,
      )
      for (const group of existingGroups) {
        try {
          const existingResources = app.findRecordsByFilter(
            'resources',
            `group = '${group.id}'`,
            '',
            100,
            0,
          )
          for (const res of existingResources) {
            app.delete(res)
          }
        } catch (_) {}
        app.delete(group)
      }
    } catch (_) {}

    const data = [
      {
        groupName: 'Cadastro de Pessoas Completo',
        resources: [
          {
            name: 'Informações Abrangentes',
            description:
              'O cadastro de pessoas físicas, jurídicas e estrangeiras mais completo do mercado, com mais de 200 informações detalhadas para atender aos departamentos comercial, financeiro, crédito, fiscal, tributário, gerencial, logística e estatística.',
          },
        ],
      },
      {
        groupName: 'Facilidade e Agilidade no Cadastramento',
        resources: [
          {
            name: 'Cadastramento Rápido',
            description:
              'Cadastro ágil de pessoas jurídicas com informações diretamente das receitas federal e estadual, garantindo precisão e economia de tempo.',
          },
          {
            name: 'Atualização em Lote',
            description:
              'Atualização de informações cadastrais em lote, facilitando a manutenção e a gestão de grandes volumes de dados.',
          },
        ],
      },
      {
        groupName: 'Localização e Endereçamento',
        resources: [
          {
            name: 'CEP e Endereço',
            description:
              'Localização de endereço pelo CEP e pesquisa de CEP pelo endereço, simplificando o processo de cadastro.',
          },
          {
            name: 'Múltiplos Endereços',
            description:
              'Cadastro de múltiplos endereços e pessoas de contato, permitindo uma gestão mais detalhada e organizada.',
          },
          {
            name: 'Mapas e GPS',
            description:
              'Localização no mapa pelo endereço ou pelas coordenadas GPS, facilitando a visualização e o planejamento logístico.',
          },
        ],
      },
      {
        groupName: 'Gestão de Clientes e Vendas',
        resources: [
          {
            name: 'Potencial de Venda',
            description:
              'Avaliação do potencial de venda de cada cliente, auxiliando na definição de estratégias comerciais.',
          },
          {
            name: 'Agrupamento Financeiro',
            description:
              'Agrupamento de clientes por grupo financeiro, permitindo uma análise mais precisa e segmentada.',
          },
          {
            name: 'Crédito e Restrição',
            description:
              'Avaliação de restrições e limite de crédito para aprovação das vendas, garantindo segurança nas transações.',
          },
          {
            name: 'Controle de Saldo',
            description:
              'Controle de saldo dos clientes para uso nas próximas compras, facilitando a gestão financeira e o relacionamento com o cliente.',
          },
        ],
      },
    ]

    for (let i = 0; i < data.length; i++) {
      const groupData = data[i]
      const group = new Record(groupsCol)
      group.set('module', moduleRecord.id)
      group.set('name', groupData.groupName)
      group.set('order', i + 1)
      app.save(group)

      for (let j = 0; j < groupData.resources.length; j++) {
        const resData = groupData.resources[j]
        const resource = new Record(resourcesCol)
        resource.set('group', group.id)
        resource.set('name', resData.name)
        resource.set('description', resData.description)
        app.save(resource)
      }
    }
  },
  (app) => {
    try {
      const moduleRecord = app.findFirstRecordByData('modules', 'slug', 'gestao-de-pessoas')

      try {
        const existingGroups = app.findRecordsByFilter(
          'resource_groups',
          `module = '${moduleRecord.id}'`,
          '',
          100,
          0,
        )
        for (const group of existingGroups) {
          try {
            const existingResources = app.findRecordsByFilter(
              'resources',
              `group = '${group.id}'`,
              '',
              100,
              0,
            )
            for (const res of existingResources) {
              app.delete(res)
            }
          } catch (_) {}
          app.delete(group)
        }
      } catch (_) {}

      app.delete(moduleRecord)
    } catch (_) {}
  },
)
