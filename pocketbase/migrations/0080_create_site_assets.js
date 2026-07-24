migrate(
  (app) => {
    const col = new Collection({
      name: 'site_assets',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        {
          name: 'asset_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
        },
        { name: 'alt_text', type: 'text' },
        { name: 'mime_type', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_site_assets_slug ON site_assets (slug)'],
    })
    app.save(col)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('site_assets'))
  },
)
