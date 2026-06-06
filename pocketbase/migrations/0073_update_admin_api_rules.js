migrate(
  (app) => {
    const collections = [
      'modules',
      'resource_groups',
      'resources',
      'segments',
      'segment_challenges',
      'cases',
      'team_members',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.createRule = "@request.auth.id != ''"
        col.updateRule = "@request.auth.id != ''"
        col.deleteRule = "@request.auth.id != ''"
        app.save(col)
      } catch (_) {}
    }
  },
  (app) => {
    const collections = [
      'modules',
      'resource_groups',
      'resources',
      'segments',
      'segment_challenges',
      'cases',
      'team_members',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.createRule = null
        col.updateRule = null
        col.deleteRule = null
        app.save(col)
      } catch (_) {}
    }
  },
)
