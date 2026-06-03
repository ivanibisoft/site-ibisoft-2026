migrate(
  (app) => {
    try {
      const cp = app.findFirstRecordByData('modules', 'slug', 'cadastro-de-pessoas')
      cp.set(
        'description',
        "Para a gestão mais eficiente de clientes, fornecedores, transportadoras e colaboradores o sistema de ERP 'ibisoft Empresas' oferece um cadastro de pessoas robusto e completo, projetado para atender às necessidades dos diversos departamentos dentro da sua empresa.",
      )
      app.save(cp)
    } catch (_) {}

    try {
      const de = app.findFirstRecordByData('modules', 'slug', 'dashboards-executivos')
      de.set(
        'description',
        "O sistema de ERP 'ibisoft Empresas' foi desenvolvido com o objetivo de fornecer uma solução completa e integrada para a gestão empresarial.",
      )
      app.save(de)
    } catch (_) {}
  },
  (app) => {},
)
