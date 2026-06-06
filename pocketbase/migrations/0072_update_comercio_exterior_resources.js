migrate(
  (app) => {
    let module
    try {
      module = app.findFirstRecordByData('modules', 'slug', 'comercio-exterior')
    } catch (_) {
      return // Skip if module doesn't exist
    }

    let existingGroups = []
    try {
      existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${module.id}'`,
        '',
        100,
        0,
      )
    } catch (_) {}

    for (const group of existingGroups) {
      let existingResources = []
      try {
        existingResources = app.findRecordsByFilter(
          'resources',
          `group = '${group.id}'`,
          '',
          100,
          0,
        )
      } catch (_) {}

      for (const res of existingResources) {
        app.delete(res)
      }
      app.delete(group)
    }

    const resourceGroupsCol = app.findCollectionByNameOrId('resource_groups')
    const resourcesCol = app.findCollectionByNameOrId('resources')

    const data = [
      {
        name: 'Adequação ao Comércio Exterior',
        order: 1,
        resources: [
          {
            name: 'Cadastro Internacional',
            description:
              'Permite o cadastro de clientes e fornecedores com endereço no exterior, facilitando a gestão de parceiros internacionais.',
          },
          {
            name: 'Produtos Completos',
            description:
              'O cadastro de produtos é completo e preparado para o comércio exterior, garantindo que todas as especificações necessárias estejam disponíveis.',
          },
          {
            name: 'Regras Tributárias',
            description:
              'Implementa regras tributárias específicas para importação e exportação de produtos, assegurando conformidade com a legislação vigente.',
          },
          {
            name: 'Descrição Personalizada',
            description:
              'Descrição e especificação técnica dos produtos na NF-e são ajustadas conforme a Declaração de Importação (DI), garantindo precisão e clareza da informação.',
          },
        ],
      },
      {
        name: 'Facilidades de Uso',
        order: 2,
        resources: [
          {
            name: 'Captura de XML',
            description:
              'Captura integral do XML da prévia de NF-e gerado pelo despachante aduaneiro, bem como do XML da Declaração de Importação (DI) gerado pelo sistema SISCOMEX da Receita Federal, automatizando o fluxo de informações.',
          },
          {
            name: 'Acompanhamento Completo',
            description:
              'Acompanhamento de todo o processo de importação, incluindo Proforma Invoice (PI), Commercial Invoice (CI), Bill of Lading (BL), Declaração de Importação (DI), Nota Fiscal de Importação (NF-e) e Entrada Física de Importação, proporcionando uma visão completa e integrada.',
          },
        ],
      },
      {
        name: 'Recursos Avançados',
        order: 3,
        resources: [
          {
            name: 'Cálculo de Custos',
            description:
              'Cálculo automático do custo real da importação, considerando todas as despesas diretas e indiretas envolvidas, permitindo uma análise precisa dos custos.',
          },
          {
            name: 'Rateio de Despesas',
            description:
              'Rateio das despesas indiretas da importação para cada produto da DI, permitindo um ou mais fornecedores na mesma DI, otimizando a gestão financeira e logística.',
          },
        ],
      },
    ]

    for (const groupData of data) {
      const groupRecord = new Record(resourceGroupsCol)
      groupRecord.set('module', module.id)
      groupRecord.set('name', groupData.name)
      groupRecord.set('order', groupData.order)
      app.save(groupRecord)

      for (const resData of groupData.resources) {
        const resRecord = new Record(resourcesCol)
        resRecord.set('group', groupRecord.id)
        resRecord.set('name', resData.name)
        resRecord.set('description', resData.description)
        app.save(resRecord)
      }
    }
  },
  (app) => {
    let module
    try {
      module = app.findFirstRecordByData('modules', 'slug', 'comercio-exterior')
    } catch (_) {
      return
    }

    let existingGroups = []
    try {
      existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${module.id}'`,
        '',
        100,
        0,
      )
    } catch (_) {}

    for (const group of existingGroups) {
      let existingResources = []
      try {
        existingResources = app.findRecordsByFilter(
          'resources',
          `group = '${group.id}'`,
          '',
          100,
          0,
        )
      } catch (_) {}

      for (const res of existingResources) {
        app.delete(res)
      }
      app.delete(group)
    }
  },
)
