migrate(
  (app) => {
    const col = new Collection({
      name: 'posts',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'summary', type: 'text', required: false },
        { name: 'content', type: 'text', required: false },
        { name: 'category', type: 'text', required: false },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        },
        { name: 'read_time', type: 'text', required: false },
        { name: 'published_at', type: 'text', required: false },
        { name: 'is_active', type: 'bool', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)',
        'CREATE INDEX idx_posts_is_active ON posts (is_active)',
      ],
    })
    app.save(col)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('posts'))
  },
)
