migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'slug', 'gestao-de-pessoas')
      record.set(
        'description',
        'Gerencie clientes, fornecedores, transportadoras e colaboradores de forma eficiente por meio de um cadastro de pessoas completo e centralizado, desenvolvido para atender às demandas de todos os setores da empresa com organização, agilidade e precisão.',
      )
      app.save(record)
    } catch (err) {
      console.log('Module gestao-de-pessoas not found')
    }
  },
  (app) => {
    // Revert not implemented as previous description is overwritten
  },
)
