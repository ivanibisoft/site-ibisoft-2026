migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('home_config')
    if (!col.fields.getByName('typewriter_pause_seconds')) {
      col.fields.add(
        new NumberField({
          name: 'typewriter_pause_seconds',
          min: 1,
          max: 15,
        }),
      )
    }
    if (!col.fields.getByName('typewriter_typing_speed')) {
      col.fields.add(
        new NumberField({
          name: 'typewriter_typing_speed',
          min: 10,
          max: 120,
        }),
      )
    }
    app.save(col)

    // Set initial values on existing records if not set
    try {
      const records = app.findRecordsByFilter('home_config', '', '', 10, 0)
      for (let i = 0; i < records.length; i++) {
        const r = records[i]
        let changed = false
        if (!r.get('typewriter_pause_seconds')) {
          r.set('typewriter_pause_seconds', 3)
          changed = true
        }
        if (!r.get('typewriter_typing_speed')) {
          r.set('typewriter_typing_speed', 35)
          changed = true
        }
        if (changed) {
          app.save(r)
        }
      }
    } catch (_) {}
  },
  (app) => {
    const col = app.findCollectionByNameOrId('home_config')
    col.fields.removeByName('typewriter_pause_seconds')
    col.fields.removeByName('typewriter_typing_speed')
    app.save(col)
  },
)
