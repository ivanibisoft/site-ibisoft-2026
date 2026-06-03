migrate(
  (app) => {
    const modules = app.findCollectionByNameOrId('modules')
    const resourceGroups = app.findCollectionByNameOrId('resource_groups')
    const resources = app.findCollectionByNameOrId('resources')

    const mod1 = new Record(modules)
    mod1.set('name', 'Gestão Contábil')
    mod1.set('slug', 'gestao-contabil')
    mod1.set(
      'description',
      'Automação e controle completo das rotinas contábeis da sua empresa, integrando áreas com precisão.',
    )
    mod1.set('icon', 'Calculator')
    app.save(mod1)

    const g1 = new Record(resourceGroups)
    g1.set('module', mod1.id)
    g1.set('name', 'Escrituração e Lançamentos')
    g1.set('order', 1)
    app.save(g1)

    const r1 = new Record(resources)
    r1.set('group', g1.id)
    r1.set('name', 'Lançamentos Automáticos')
    r1.set(
      'description',
      'Integração direta com o financeiro para geração automática de partidas dobradas.',
    )
    app.save(r1)

    const r2 = new Record(resources)
    r2.set('group', g1.id)
    r2.set('name', 'Conciliação Bancária')
    r2.set(
      'description',
      'Importação de extratos OFX e conciliação inteligente com regras pré-definidas.',
    )
    app.save(r2)

    const g2 = new Record(resourceGroups)
    g2.set('module', mod1.id)
    g2.set('name', 'Obrigações Acessórias')
    g2.set('order', 2)
    app.save(g2)

    const r3 = new Record(resources)
    r3.set('group', g2.id)
    r3.set('name', 'SPED Contábil (ECD)')
    r3.set('description', 'Geração e validação do arquivo digital para o SPED Contábil.')
    app.save(r3)

    const mod2 = new Record(modules)
    mod2.set('name', 'Gestão Financeira')
    mod2.set('slug', 'gestao-financeira')
    mod2.set(
      'description',
      'Controle total de contas a pagar, receber, fluxo de caixa e tesouraria com segurança.',
    )
    mod2.set('icon', 'DollarSign')
    app.save(mod2)

    const g3 = new Record(resourceGroups)
    g3.set('module', mod2.id)
    g3.set('name', 'Contas a Pagar e Receber')
    g3.set('order', 1)
    app.save(g3)

    const r4 = new Record(resources)
    r4.set('group', g3.id)
    r4.set('name', 'Controle de Inadimplência')
    r4.set('description', 'Régua de cobrança automática e alertas de títulos vencidos.')
    app.save(r4)
  },
  (app) => {
    app.db().newQuery('DELETE FROM resources').execute()
    app.db().newQuery('DELETE FROM resource_groups').execute()
    app.db().newQuery('DELETE FROM modules').execute()
  },
)
