migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('resources')
    if (!col.fields.getByName('order')) {
      col.fields.add(new NumberField({ name: 'order' }))
    }
    col.addIndex('idx_resources_order', false, '`order`', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('resources')
    col.removeIndex('idx_resources_order')
    col.fields.removeByName('order')
    app.save(col)
  },
)
