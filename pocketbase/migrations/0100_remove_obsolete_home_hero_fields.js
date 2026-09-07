migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('home_config')
    col.fields.removeByName('hero_image')
    col.fields.removeByName('hero_title')
    col.fields.removeByName('hero_subtitle')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('home_config')
    if (!col.fields.getByName('hero_image')) {
      col.fields.add(
        new FileField({
          name: 'hero_image',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
          thumbs: ['800x600'],
        }),
      )
    }
    if (!col.fields.getByName('hero_title')) {
      col.fields.add(
        new TextField({
          name: 'hero_title',
        }),
      )
    }
    if (!col.fields.getByName('hero_subtitle')) {
      col.fields.add(
        new TextField({
          name: 'hero_subtitle',
        }),
      )
    }
    app.save(col)
  },
)
