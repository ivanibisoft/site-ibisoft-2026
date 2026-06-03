migrate(
  (app) => {
    app
      .db()
      .newQuery('UPDATE segments SET description = {:newDesc} WHERE description = {:oldDesc}')
      .bind({
        newDesc: 'Gerencie equipes, contratos, faturamento e atendimento em uma única plataforma.',
        oldDesc:
          'Controle total sobre projetos, contratos e rentabilidade da sua operação de serviços.',
      })
      .execute()
  },
  (app) => {
    app
      .db()
      .newQuery('UPDATE segments SET description = {:oldDesc} WHERE description = {:newDesc}')
      .bind({
        oldDesc:
          'Controle total sobre projetos, contratos e rentabilidade da sua operação de serviços.',
        newDesc: 'Gerencie equipes, contratos, faturamento e atendimento em uma única plataforma.',
      })
      .execute()
  },
)
