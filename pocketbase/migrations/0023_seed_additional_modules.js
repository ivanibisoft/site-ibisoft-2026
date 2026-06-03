migrate(
  (app) => {
    const modulesData = [
      {
        name: 'Visão Geral',
        slug: 'visao-geral',
        description:
          'Painel centralizado com indicadores gerais e atalhos para as principais funções do sistema.',
        icon: 'LayoutDashboard',
        groups: [
          {
            name: 'Dashboards Executivos',
            resources: [
              {
                name: 'Indicadores de Desempenho',
                description: 'Acompanhamento em tempo real dos KPIs cruciais para o negócio.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Pessoas',
        slug: 'gestao-de-pessoas',
        description:
          'Administração completa de colaboradores, desde o recrutamento até a folha de pagamento.',
        icon: 'Users',
        groups: [
          {
            name: 'Departamento Pessoal',
            resources: [
              {
                name: 'Folha de Pagamento',
                description: 'Cálculo automatizado de salários, encargos e benefícios.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Produtos',
        slug: 'gestao-de-produtos',
        description: 'Cadastro e controle do ciclo de vida dos produtos e serviços oferecidos.',
        icon: 'Package',
        groups: [
          {
            name: 'Cadastros Base',
            resources: [
              {
                name: 'Catálogo de Produtos',
                description:
                  'Manutenção das informações detalhadas de cada item, incluindo variações e SKUs.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Comércio Exterior',
        slug: 'gestao-de-comercio-exterior',
        description: 'Controle de operações de importação e exportação com conformidade legal.',
        icon: 'Globe',
        groups: [
          {
            name: 'Importação',
            resources: [
              {
                name: 'Controle de Despacho',
                description:
                  'Acompanhamento de processos de importação, documentação e custos aduaneiros.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Compras',
        slug: 'gestao-de-compras',
        description:
          'Otimização do processo de suprimentos, cotações e relacionamento com fornecedores.',
        icon: 'ShoppingCart',
        groups: [
          {
            name: 'Suprimentos',
            resources: [
              {
                name: 'Cotações Online',
                description:
                  'Comparativo de preços e condições integrado com o portal do fornecedor.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Estoque',
        slug: 'gestao-de-estoque',
        description:
          'Controle físico e financeiro de materiais, garantindo a disponibilidade e evitando perdas.',
        icon: 'Boxes',
        groups: [
          {
            name: 'Movimentações',
            resources: [
              {
                name: 'Inventário Físico',
                description: 'Realização de contagens rotativas e ajustes de saldo com precisão.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Armazenagem',
        slug: 'gestao-de-armazenagem',
        description:
          'WMS completo para otimização de espaço, endereçamento e fluxo logístico interno.',
        icon: 'Warehouse',
        groups: [
          {
            name: 'Controle de Espaço',
            resources: [
              {
                name: 'Endereçamento Dinâmico',
                description:
                  'Mapeamento 3D do armazém e sugestão inteligente de posições para guarda.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão Comercial',
        slug: 'gestao-de-comercial',
        description:
          'CRM e força de vendas para maximizar resultados e gerir carteira de clientes.',
        icon: 'Briefcase',
        groups: [
          {
            name: 'Vendas',
            resources: [
              {
                name: 'Funil de Vendas',
                description: 'Acompanhamento visual das oportunidades e estágios de negociação.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão Tributária',
        slug: 'gestao-tributaria',
        description:
          'Apuração de impostos e geração de obrigações acessórias em total conformidade fiscal.',
        icon: 'Landmark',
        groups: [
          {
            name: 'Obrigações Fiscais',
            resources: [
              {
                name: 'SPED Fiscal',
                description: 'Geração e validação dos arquivos magnéticos exigidos pelo Fisco.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Comissões',
        slug: 'gestao-de-comissoes',
        description:
          'Cálculo flexível de remuneração variável para equipes comerciais e representantes.',
        icon: 'Percent',
        groups: [
          {
            name: 'Remuneração Variável',
            resources: [
              {
                name: 'Regras de Comissionamento',
                description:
                  'Configuração de percentuais baseados em margem, produto ou atingimento de metas.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Logística',
        slug: 'gestao-de-logistica',
        description:
          'Roteirização, rastreamento de entregas e gestão de frota para operações de transporte.',
        icon: 'Truck',
        groups: [
          {
            name: 'Transportes',
            resources: [
              {
                name: 'Roteirização Inteligente',
                description: 'Otimização de rotas de entrega visando menor custo e menor tempo.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Serviços',
        slug: 'gestao-de-servicos',
        description: 'Controle de ordens de serviço, contratos e alocação de técnicos em campo.',
        icon: 'Wrench',
        groups: [
          {
            name: 'Operações',
            resources: [
              {
                name: 'Ordens de Serviço',
                description: 'Abertura, acompanhamento e faturamento de chamados técnicos.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão de Produção',
        slug: 'gestao-de-producao',
        description:
          'PCP e chão de fábrica para planejamento de ordens, apontamentos e controle de qualidade.',
        icon: 'Factory',
        groups: [
          {
            name: 'Chão de Fábrica',
            resources: [
              {
                name: 'Ordens de Produção',
                description:
                  'Emissão e controle das etapas de fabricação com baixa automática de insumos.',
              },
            ],
          },
        ],
      },
      {
        name: 'Gestão Financeira',
        slug: 'gestao-financeira',
        description: 'Contas a pagar, receber, tesouraria e fluxo de caixa consolidado da empresa.',
        icon: 'DollarSign',
        groups: [
          {
            name: 'Tesouraria',
            resources: [
              {
                name: 'Conciliação Bancária',
                description: 'Importação de extratos e baixa automática de títulos pendentes.',
              },
            ],
          },
        ],
      },
      {
        name: 'Ferramentas de Produtividade',
        slug: 'ferramentas-de-produtividade',
        description:
          'Recursos integrados para comunicação, gestão de tarefas e documentos corporativos.',
        icon: 'Laptop',
        groups: [
          {
            name: 'Colaboração',
            resources: [
              {
                name: 'Gestor de Tarefas',
                description: 'Organização do trabalho diário com quadros Kanban integrados ao ERP.',
              },
            ],
          },
        ],
      },
      {
        name: 'Assistente Pessoal',
        slug: 'assistente-pessoal',
        description:
          'Recursos baseados em Inteligência Artificial para apoiar nas rotinas operacionais.',
        icon: 'Bot',
        groups: [
          {
            name: 'Automação com IA',
            resources: [
              {
                name: 'Insights Preditivos',
                description:
                  'Análise de padrões de dados para sugerir ações de reposição ou vendas.',
              },
            ],
          },
        ],
      },
      {
        name: 'Segurança da Informação',
        slug: 'seguranca-da-informacao',
        description:
          'Políticas de acesso, auditorias e ferramentas para garantir a integridade dos dados e adequação à LGPD.',
        icon: 'ShieldCheck',
        groups: [
          {
            name: 'Controle de Acesso',
            resources: [
              {
                name: 'Trilhas de Auditoria',
                description:
                  'Registro completo de todas as alterações críticas realizadas no sistema.',
              },
            ],
          },
        ],
      },
    ]

    const modulesCol = app.findCollectionByNameOrId('modules')
    const groupsCol = app.findCollectionByNameOrId('resource_groups')
    const resourcesCol = app.findCollectionByNameOrId('resources')

    for (const modData of modulesData) {
      let modRecord
      try {
        modRecord = app.findFirstRecordByData('modules', 'slug', modData.slug)
      } catch (_) {
        modRecord = new Record(modulesCol)
        modRecord.set('name', modData.name)
        modRecord.set('slug', modData.slug)
        modRecord.set('description', modData.description)
        modRecord.set('icon', modData.icon)
        app.save(modRecord)
      }

      let order = 1
      for (const groupData of modData.groups) {
        let groupRecord
        try {
          groupRecord = app.findFirstRecordByFilter(
            'resource_groups',
            `module="${modRecord.id}" && name="${groupData.name.replace(/"/g, '\\"')}"`,
          )
        } catch (_) {
          groupRecord = new Record(groupsCol)
          groupRecord.set('module', modRecord.id)
          groupRecord.set('name', groupData.name)
          groupRecord.set('order', order++)
          app.save(groupRecord)
        }

        for (const resData of groupData.resources) {
          let resRecord
          try {
            resRecord = app.findFirstRecordByFilter(
              'resources',
              `group="${groupRecord.id}" && name="${resData.name.replace(/"/g, '\\"')}"`,
            )
          } catch (_) {
            resRecord = new Record(resourcesCol)
            resRecord.set('group', groupRecord.id)
            resRecord.set('name', resData.name)
            resRecord.set('description', resData.description)
            app.save(resRecord)
          }
        }
      }
    }
  },
  (app) => {
    const modulesSlugs = [
      'visao-geral',
      'gestao-de-pessoas',
      'gestao-de-produtos',
      'gestao-de-comercio-exterior',
      'gestao-de-compras',
      'gestao-de-estoque',
      'gestao-de-armazenagem',
      'gestao-de-comercial',
      'gestao-tributaria',
      'gestao-de-comissoes',
      'gestao-de-logistica',
      'gestao-de-servicos',
      'gestao-de-producao',
      'gestao-financeira',
      'ferramentas-de-produtividade',
      'assistente-pessoal',
      'seguranca-da-informacao',
    ]

    for (const slug of modulesSlugs) {
      try {
        const modRecord = app.findFirstRecordByData('modules', 'slug', slug)

        const groups = app.findRecordsByFilter(
          'resource_groups',
          `module="${modRecord.id}"`,
          '',
          100,
          0,
        )
        for (const group of groups) {
          const resources = app.findRecordsByFilter('resources', `group="${group.id}"`, '', 100, 0)
          for (const res of resources) {
            app.delete(res)
          }
          app.delete(group)
        }

        app.delete(modRecord)
      } catch (_) {}
    }
  },
)
