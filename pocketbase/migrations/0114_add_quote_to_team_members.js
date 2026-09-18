migrate(
  (app) => {
    // 1. Adicionar campo 'quote' na coleção 'team_members' se não existir
    const col = app.findCollectionByNameOrId('team_members')
    if (!col.fields.getByName('quote')) {
      col.fields.add(
        new TextField({
          name: 'quote',
          required: false,
        }),
      )
      app.save(col)
    }

    // 2. Preencher a quote e atualizar a bio do CEO (Ivan Christófolli)
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      record.set(
        'quote',
        'Acreditamos que a tecnologia não deve ser um obstáculo, mas sim a ponte para o crescimento contínuo. Nosso compromisso diário é entregar não apenas um software, mas uma verdadeira vantagem competitiva estruturada para nossos parceiros.',
      )
      const currentBio = record.getString('bio') || ''
      const updatedBio = currentBio.replace('Empretec do SEBRAE/ONU', 'Empretec da ONU / SEBRAE')
      record.set(
        'bio',
        updatedBio ||
          'À frente da ibisoft desde 1985, Ivan une sólida formação técnica à visão empreendedora. É tecnólogo em Processamento de Dados pela UFPR (1989), com pós-graduação em Administração de Empresas pela FAE (2000), e concluiu o programa Empretec da ONU / SEBRAE (2005). Essa combinação de tecnologia e gestão orienta a forma como a ibisoft desenvolve soluções: engenharia rigorosa com foco no resultado do negócio do cliente.',
      )
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      const currentBio = record.getString('bio') || ''
      record.set('bio', currentBio.replace('Empretec da ONU / SEBRAE', 'Empretec do SEBRAE/ONU'))
      record.set('quote', '')
      app.save(record)
    } catch (_) {}

    try {
      const col = app.findCollectionByNameOrId('team_members')
      const field = col.fields.getByName('quote')
      if (field) {
        col.fields.remove(field)
        app.save(col)
      }
    } catch (_) {}
  },
)
