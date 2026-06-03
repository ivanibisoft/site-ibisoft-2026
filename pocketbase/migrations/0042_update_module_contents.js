migrate(
  (app) => {
    // Update Cadastro de Pessoas
    try {
      const pessoasMod = app.findFirstRecordByData('modules', 'slug', 'cadastro-de-pessoas')
      pessoasMod.set(
        'description',
        "Para a gestão mais eficiente de clientes, fornecedores, transportadoras e colaboradores o sistema de ERP 'ibisoft Empresas' oferece um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.",
      )
      app.save(pessoasMod)
    } catch (err) {
      // ignore if module doesn't exist yet
    }

    // Update Dashboards
    try {
      const dashboardMod = app.findFirstRecordByData('modules', 'slug', 'dashboards')
      dashboardMod.set(
        'description',
        'Gestão Integrada e Eficiente. Todas as informações relevantes ao negócio são geradas, disponibilizadas e avaliadas pelos colaboradores de maneira rápida e eficiente. Isso proporciona uma visão simples e completa das informações, essenciais para a tomada de decisões pelos gestores.',
      )
      app.save(dashboardMod)

      const resourceGroupsCol = app.findCollectionByNameOrId('resource_groups')
      const resourcesCol = app.findCollectionByNameOrId('resources')

      const ensureGroup = (name, order) => {
        const existing = app.findRecordsByFilter(
          'resource_groups',
          `module = '${dashboardMod.id}' && name = '${name}'`,
          '',
          1,
          0,
        )
        if (existing && existing.length > 0) {
          return existing[0]
        }
        const group = new Record(resourceGroupsCol)
        group.set('module', dashboardMod.id)
        group.set('name', name)
        group.set('order', order)
        app.save(group)
        return group
      }

      const ensureResource = (groupId, name, description) => {
        const existing = app.findRecordsByFilter(
          'resources',
          `group = '${groupId}' && name = '${name}'`,
          '',
          1,
          0,
        )
        if (existing && existing.length > 0) {
          const res = existing[0]
          res.set('description', description)
          app.save(res)
          return res
        }
        const res = new Record(resourcesCol)
        res.set('group', groupId)
        res.set('name', name)
        res.set('description', description)
        app.save(res)
        return res
      }

      const group1 = ensureGroup('Modelo Multi-Empresa', 1)
      ensureResource(
        group1.id,
        'Visão Individual e Geral',
        'O sistema permite uma visão individual de cada empresa do grupo, bem como uma visão geral de todas as empresas administradas.',
      )
      ensureResource(
        group1.id,
        'Controle Simplificado',
        'Controle de informações comerciais, financeiras e de estoques de cada empresa individualmente e do grupo.',
      )

      const group2 = ensureGroup('Benefícios por Departamento', 2)
      ensureResource(
        group2.id,
        'Operacional',
        'Melhoria na eficiência das operações diárias com processos automatizados.',
      )
      ensureResource(
        group2.id,
        'Gerencial',
        'Ferramentas de análise e relatórios detalhados para planejamento.',
      )
      ensureResource(
        group2.id,
        'Estratégico',
        'Visão holística do negócio para identificação de oportunidades.',
      )
    } catch (err) {
      // ignore if module doesn't exist yet
    }
  },
  (app) => {
    // No revert needed for data seeding
  },
)
