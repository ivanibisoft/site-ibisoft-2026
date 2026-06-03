migrate(
  (app) => {
    let moduleRecord
    try {
      moduleRecord = app.findFirstRecordByData('modules', 'slug', 'cadastro-pessoas')
    } catch (_) {
      try {
        moduleRecord = app.findFirstRecordByData('modules', 'name', 'Cadastro de Pessoas')
      } catch (_) {
        const col = app.findCollectionByNameOrId('modules')
        moduleRecord = new Record(col)
        moduleRecord.set('name', 'Cadastro de Pessoas')
        moduleRecord.set('slug', 'cadastro-pessoas')
        moduleRecord.set('icon', 'Users')
        moduleRecord.set('order', 10)
      }
    }

    moduleRecord.set(
      'description',
      'Para a gestão mais eficiente de clientes, fornecedores, transportadoras e colaboradores o sistema de ERP "ibisoft Empresas" oferece um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.',
    )
    app.save(moduleRecord)

    const groups = [
      {
        name: 'Cadastro de Pessoas Completo',
        order: 1,
        resources: [
          {
            name: 'Informações Abrangentes',
            description:
              'O cadastro de pessoas físicas, jurídicas e estrangeiras mais completo do mercado, com mais de 200 informações detalhadas para atender aos departamentos comercial, financeiro, crédito, fiscal, tributário, gerencial, logística e estatística.',
          },
        ],
      },
      {
        name: 'Facilidade e Agilidade no Cadastramento',
        order: 2,
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
        name: 'Localização e Endereçamento',
        order: 3,
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
        name: 'Gestão de Clientes e Vendas',
        order: 4,
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

    const rgCol = app.findCollectionByNameOrId('resource_groups')
    const rCol = app.findCollectionByNameOrId('resources')

    for (const g of groups) {
      let groupRecord
      try {
        const records = app.findRecordsByFilter(
          'resource_groups',
          'module = {:mod} && name = {:name}',
          '',
          1,
          0,
          { mod: moduleRecord.id, name: g.name },
        )
        if (records.length > 0) {
          groupRecord = records[0]
        } else {
          throw new Error('not found')
        }
      } catch (_) {
        groupRecord = new Record(rgCol)
        groupRecord.set('module', moduleRecord.id)
        groupRecord.set('name', g.name)
      }
      groupRecord.set('order', g.order)
      app.save(groupRecord)

      for (const r of g.resources) {
        let resRecord
        try {
          const records = app.findRecordsByFilter(
            'resources',
            'group = {:group} && name = {:name}',
            '',
            1,
            0,
            { group: groupRecord.id, name: r.name },
          )
          if (records.length > 0) {
            resRecord = records[0]
          } else {
            throw new Error('not found')
          }
        } catch (_) {
          resRecord = new Record(rCol)
          resRecord.set('group', groupRecord.id)
          resRecord.set('name', r.name)
        }
        resRecord.set('description', r.description)
        app.save(resRecord)
      }
    }
  },
  (app) => {
    // down migration
  },
)
