migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('hero_messages')
    if (!col.fields.getByName('image')) {
      col.fields.add(
        new FileField({
          name: 'image',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('hero_messages')
    if (col.fields.getByName('image')) {
      col.fields.removeByName('image')
    }
    app.save(col)
  },
)
