migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      record.set(
        'bio',
        'À frente da ibisoft desde 1985, Ivan une sólida formação técnica à visão empreendedora. É tecnólogo em Processamento de Dados pela UFPR (1989), com pós-graduação em Administração de Empresas pela FAE (2000), e concluiu o programa Empretec do SEBRAE/ONU (2005). Essa combinação de tecnologia e gestão orienta a forma como a ibisoft desenvolve soluções: engenharia rigorosa com foco no resultado do negócio do cliente.',
      )
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      record.set(
        'bio',
        'À frente da ibisoft desde 1985, Ivan une sólida formação técnica à visão empreendedora. É tecnólogo em Processamento de Dados pela UFPR (1989), com pós-graduação em Administração de Empresas pela FAE (2000), e concluiu o programa Empretec do SEBRAE (2005). Essa combinação de tecnologia e gestão orienta a forma como a ibisoft desenvolve soluções: engenharia rigorosa com foco no resultado do negócio do cliente.',
      )
      app.save(record)
    } catch (_) {}
  },
)
