/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    try {
      const module = app.findFirstRecordByData('modules', 'slug', 'gestao-de-produtos')
      const groupsCol = app.findCollectionByNameOrId('resource_groups')
      const resourcesCol = app.findCollectionByNameOrId('resources')

      const existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${module.id}'`,
        '',
        100,
        0,
      )
      for (const group of existingGroups) {
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
        app.delete(group)
      }

      const data = [
        {
          name: 'Informações Gerais',
          order: 1,
          resources: [
            {
              name: 'Centralização de Dados',
              description:
                'Todas as informações de mercadorias para revenda, matérias-prima, produtos acabados e semi-acabados, equipamentos e bens do ativo da empresa são centralizadas em um único cadastro.',
            },
            {
              name: 'Cadastro Completo',
              description:
                'Possuímos o cadastro de produtos mais completo do mercado, com mais de 200 informações para identificação e classificação dos produtos, garantindo uma gestão detalhada e precisa.',
            },
            {
              name: 'Classificação Flexível',
              description:
                'Produtos podem ser classificados por tipo, grupo, aplicação, centro de custo e segmento de mercado, permitindo uma organização eficiente e personalizada.',
            },
            {
              name: 'Visão Detalhada',
              description:
                'As informações detalhadas dos produtos são essenciais para tributação, fabricação, embalagem, logística, gestão de risco, características de compras, perfil de demanda e de venda.',
            },
          ],
        },
        {
          name: 'Funcionalidades',
          order: 2,
          resources: [
            {
              name: 'Tabelas de Preços',
              description:
                'Criação de múltiplas tabelas de preços de venda para atender a todos os perfis de clientes, garantindo flexibilidade e competitividade.',
            },
            {
              name: 'Atualização de Preços',
              description:
                'Atualização automática de preços de venda usando mark-ups ou sob demanda, com registro no histórico de atualização, assegurando transparência e controle.',
            },
            {
              name: 'Atualização Ágil',
              description:
                'Alterações no cadastro de produtos podem ser feitas de forma individual ou em lote, facilitando o processo de atualização.',
            },
            {
              name: 'Registro de Ocorrências',
              description:
                'Permite o registro de ocorrências do produto para reclamações, sugestões, solicitações e outros tipos, melhorando o atendimento ao cliente.',
            },
            {
              name: 'Facilidade de Cadastro',
              description:
                'Copiar um produto existente para agilizar o cadastramento de novos produtos, economizando tempo e esforço.',
            },
          ],
        },
        {
          name: 'Recursos Avançados',
          order: 3,
          resources: [
            {
              name: 'Ficha Técnica',
              description:
                'Cadastro da ficha técnica de cada produto, incluindo a composição de materiais e serviços para produção e todos os custos necessários para fazer a precificação correta.',
            },
            {
              name: 'Controle de Custos',
              description:
                'Controle dos custos de aquisição e produção, dados do fabricante e lista de fornecedores, proporcionando uma visão completa e integrada dos custos.',
            },
          ],
        },
      ]

      for (const groupData of data) {
        const groupRecord = new Record(groupsCol)
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
    } catch (err) {
      console.log('Error updating gestao de produtos resources:', err)
    }
  },
  (app) => {
    try {
      const module = app.findFirstRecordByData('modules', 'slug', 'gestao-de-produtos')
      const existingGroups = app.findRecordsByFilter(
        'resource_groups',
        `module = '${module.id}'`,
        '',
        100,
        0,
      )
      for (const group of existingGroups) {
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
        app.delete(group)
      }
    } catch (err) {
      // Ignore rollback errors if module not found
    }
  },
)
