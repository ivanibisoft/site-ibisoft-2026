migrate(
  (app) => {
    const collections = [
      'cases',
      'team_members',
      'segments',
      'segment_challenges',
      'modules',
      'resource_groups',
      'resources',
    ]

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        // Ensure collections required by public pages are publicly readable
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (e) {
        console.log('Migration 0029: Could not update ' + name, e.message)
      }
    }
  },
  (app) => {
    // No automatic down migration to avoid breaking public access accidentally
  },
)
