migrate(
  (app) => {
    const col = new Collection({
      name: 'hero_messages',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'order', type: 'number', required: false },
        { name: 'is_active', type: 'bool', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_hero_messages_order ON hero_messages (`order`)',
        'CREATE INDEX idx_hero_messages_is_active ON hero_messages (is_active)',
      ],
    })
    app.save(col)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('hero_messages'))
  },
)
