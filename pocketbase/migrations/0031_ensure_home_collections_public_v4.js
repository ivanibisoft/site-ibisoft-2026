migrate(
  (app) => {
    // Ensure all collections used on the Home Page have public read access
    // to avoid 403 Forbidden errors when loading the site as an unauthenticated user or admin
    const collections = [
      'cases',
      'team_members',
      'segments',
      'segment_challenges',
      'modules',
      'resource_groups',
      'resources',
    ]

    collections.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (err) {
        console.log(`Could not update collection ${name}:`, err.message)
      }
    })
  },
  (app) => {
    // Safe down migration (no-op for rule audit)
  },
)
