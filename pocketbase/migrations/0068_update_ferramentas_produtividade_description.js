migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'name', 'Ferramentas de Produtividade')
      record.set(
        'description',
        'Melhore a comunicação interna e a organização das atividades da sua empresa com ferramentas integradas de mensagens, tarefas e registro de ocorrências. O sistema facilita o compartilhamento de informações entre equipes, o acompanhamento de demandas e o controle de processos internos e externos.',
      )
      app.save(record)
    } catch (_) {
      console.log("Module 'Ferramentas de Produtividade' not found")
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('modules', 'name', 'Ferramentas de Produtividade')
      record.set(
        'description',
        'Soluções integradas para melhorar a comunicação e organização da sua equipe.',
      )
      app.save(record)
    } catch (_) {}
  },
)
