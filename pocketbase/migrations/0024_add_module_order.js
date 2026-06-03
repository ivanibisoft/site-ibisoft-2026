migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('modules')
    if (!col.fields.getByName('order')) {
      col.fields.add(new NumberField({ name: 'order' }))
    }
    col.addIndex('idx_modules_order', false, '`order`', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('modules')
    if (col.fields.getByName('order')) {
      col.fields.removeByName('order')
    }
    col.removeIndex('idx_modules_order')
    app.save(col)
  },
)
