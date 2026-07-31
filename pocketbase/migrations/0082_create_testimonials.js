migrate(
  (app) => {
    const col = new Collection({
      name: 'testimonials',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: false },
        { name: 'content', type: 'text', required: true },
        { name: 'order', type: 'number', required: false },
        { name: 'is_active', type: 'bool', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_testimonials_order ON testimonials (`order`)',
        'CREATE INDEX idx_testimonials_is_active ON testimonials (is_active)',
      ],
    })
    app.save(col)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('testimonials'))
  },
)
