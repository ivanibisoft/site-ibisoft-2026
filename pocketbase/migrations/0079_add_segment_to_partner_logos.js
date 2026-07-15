migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('partner_logos')
    if (!col.fields.getByName('segment')) {
      const segmentsId = app.findCollectionByNameOrId('segments').id
      col.fields.add(
        new RelationField({
          name: 'segment',
          required: false,
          collectionId: segmentsId,
          cascadeDelete: false,
          maxSelect: 1,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('partner_logos')
    if (col.fields.getByName('segment')) {
      col.fields.removeByName('segment')
    }
    app.save(col)
  },
)
