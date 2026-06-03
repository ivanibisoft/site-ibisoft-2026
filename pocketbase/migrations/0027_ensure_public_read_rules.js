migrate(
  (app) => {
    const collectionsToPublic = [
      'modules',
      'segments',
      'segment_challenges',
      'cases',
      'resource_groups',
      'resources',
      'team_members',
    ]

    for (const name of collectionsToPublic) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (err) {
        console.log(`WARN: Collection ${name} not found or could not be updated.`)
      }
    }
  },
  (app) => {
    // Reverting public read access is a no-op as the previous state may vary
    // and these collections generally require public access for the website to function.
  },
)
