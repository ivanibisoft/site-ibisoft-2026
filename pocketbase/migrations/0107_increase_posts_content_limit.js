migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('posts')
    const contentField = col.fields.getByName('content')
    if (contentField) {
      contentField.max = 200000
    }
    const summaryField = col.fields.getByName('summary')
    if (summaryField) {
      summaryField.max = 500
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('posts')
    const contentField = col.fields.getByName('content')
    if (contentField) {
      contentField.max = 5000
    }
    app.save(col)
  },
)
