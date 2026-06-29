migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('segments')
    if (!col.fields.getByName('image')) {
      col.fields.add(
        new FileField({
          name: 'image',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('segments')
    if (col.fields.getByName('image')) {
      col.fields.removeByName('image')
    }
    app.save(col)
  },
)
