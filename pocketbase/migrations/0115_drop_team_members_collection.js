migrate(
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('team_members')
      if (col) {
        app.delete(col)
      }
    } catch (_) {
      // Collection already deleted or does not exist
    }
  },
  (app) => {
    // Revert logic: recreate base collection if needed
    try {
      const collection = new Collection({
        name: 'team_members',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'role', type: 'text', required: true },
          { name: 'quote', type: 'text', required: false },
          { name: 'bio', type: 'text' },
          { name: 'photo', type: 'file' },
          { name: 'order', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_team_members_order ON team_members (`order`)'],
      })
      app.save(collection)
    } catch (_) {}
  },
)
