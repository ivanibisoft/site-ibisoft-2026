migrate(
  (app) => {
    const records = app.findRecordsByFilter(
      'modules',
      "name = 'Gestão Tributária' || slug = 'gestao-tributaria'",
      '',
      1,
      0,
    )

    if (records.length > 0) {
      const record = records[0]
      record.set(
        'description',
        'Simplifique e automatize toda a gestão fiscal da sua empresa com uma solução completa que garante conformidade com a legislação e reduz riscos de erros e penalidades.',
      )
      app.save(record)
    }
  },
  (app) => {
    // Down migration is a no-op since we don't have the previous description
  },
)
