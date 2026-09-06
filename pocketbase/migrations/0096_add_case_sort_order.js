migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('cases')
    if (!col.fields.getByName('sort_order')) {
      col.fields.add(new NumberField({ name: 'sort_order' }))
    }
    col.addIndex('idx_cases_sort_order', false, '`sort_order`', '')
    app.save(col)

    // Inicializar sort_order para os registros existentes de forma consistente por created
    const records = app.findRecordsByFilter('cases', '', 'created', 0, 0)
    for (let i = 0; i < records.length; i++) {
      records[i].set('sort_order', i + 1)
      app.save(records[i])
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('cases')
    try {
      col.removeIndex('idx_cases_sort_order')
    } catch (_) {}
    if (col.fields.getByName('sort_order')) {
      col.fields.removeByName('sort_order')
    }
    app.save(col)
  },
)
