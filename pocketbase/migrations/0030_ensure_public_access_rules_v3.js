migrate(
  (app) => {
    const collections = [
      'modules',
      'segments',
      'cases',
      'team_members',
      'resource_groups',
      'resources',
      'segment_challenges',
    ]

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (e) {
        console.log('Migration 0030: Failed to update ' + name + ' - ' + e.message)
      }
    }
  },
  (app) => {
    // Reverting access rules is generally not recommended as it could break public access.
    // Leaving empty to ensure idempotent behavior on rollbacks.
  },
)
