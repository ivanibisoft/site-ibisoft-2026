migrate(
  (app) => {
    const publicCollections = [
      'cases',
      'team_members',
      'segments',
      'segment_challenges',
      'modules',
      'resource_groups',
      'resources',
    ]

    for (const name of publicCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (e) {
        console.log('Could not update rules for ' + name)
      }
    }

    try {
      const leadsCol = app.findCollectionByNameOrId('leads')
      leadsCol.listRule = "@request.auth.id != ''"
      leadsCol.viewRule = "@request.auth.id != ''"
      leadsCol.createRule = ''
      leadsCol.updateRule = "@request.auth.id != ''"
      app.save(leadsCol)
    } catch (e) {
      console.log('Could not update rules for leads')
    }
  },
  (app) => {
    // Optional down migration
    console.log('Down migration for 0028 not implemented')
  },
)
