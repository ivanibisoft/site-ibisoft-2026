migrate((app) => {
  try {
    const records = app.findRecordsByFilter(
      'modules',
      "name ~ 'Cadastro de Pessoas'",
      '-created',
      1,
      0,
    )
    if (records.length > 0) {
      records[0].set(
        'description',
        "Para a gestão mais eficiente de clientes, fornecedores, transportadoras e colaboradores o sistema de ERP 'ibisoft Empresas' oferece um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.",
      )
      app.save(records[0])
    }
  } catch (err) {
    console.log('Failed to update Cadastro de Pessoas description:', err)
  }

  try {
    const records = app.findRecordsByFilter(
      'modules',
      "name ~ 'Dashboards' || name ~ 'Gestão Integrada'",
      '-created',
      1,
      0,
    )
    if (records.length > 0) {
      records[0].set(
        'description',
        'Gestão Integrada e Eficiente.\n\nInformações Relevantes: Todas as informações relevantes ao negócio são geradas, disponibilizadas e avaliadas pelos colaboradores de maneira rápida e eficiente. Isso proporciona uma visão simples e completa das informações, essenciais para a tomada de decisões pelos gestores.\n\nTomada de Decisões: Com dados precisos e atualizados, os gestores podem tomar decisões informadas e estratégicas.\n\nModelo Multi-Empresa: O sistema permite uma visão individual de cada empresa do grupo, bem como uma visão geral de todas as empresas administradas.\n\nBenefícios Operacionais, Gerenciais e Estratégicos: Melhoria na eficiência das operações diárias, ferramentas de análise e relatórios detalhados, e visão holística do negócio.',
      )
      app.save(records[0])
    }
  } catch (err) {
    console.log('Failed to update Dashboards description:', err)
  }
})
