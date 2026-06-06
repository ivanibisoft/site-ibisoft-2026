migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'modules',
        "name = 'Gestão de Armazenagem' || slug = 'gestao-de-armazenagem'",
        '',
        1,
        0,
      )
      if (records.length > 0) {
        const record = records[0]
        record.set(
          'description',
          'Otimize a organização e o controle do seu estoque físico com uma solução completa de armazenagem integrada ao estoque. O módulo permite gerenciar múltiplos locais, divisões e lotes de produtos, garantindo maior rastreabilidade, aproveitamento de espaço e eficiência operacional.',
        )
        app.save(record)
      }
    } catch (_) {}
  },
  (app) => {},
)
