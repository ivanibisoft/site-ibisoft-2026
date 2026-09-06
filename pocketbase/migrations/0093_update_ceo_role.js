migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      record.set('role', 'Fundador e CEO')
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('team_members', 'name', 'Ivan Christófolli')
      record.set('role', 'CEO')
      app.save(record)
    } catch (_) {}
  },
)
