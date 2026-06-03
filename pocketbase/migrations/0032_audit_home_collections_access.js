migrate(
  (app) => {
    // Systematic update of PocketBase collection permissions to ensure that all data
    // required for the homepage is accessible for reading in the development/preview environment.
    const collectionsToAudit = [
      'cases',
      'segments',
      'modules',
      'team_members',
      'segment_challenges',
      'resource_groups',
      'resources',
    ]

    collectionsToAudit.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        // Set to public read so the homepage always loads regardless of token state
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (err) {
        console.log(`[Audit] Could not update collection ${name}:`, err.message)
      }
    })
  },
  (app) => {
    // No down migration needed for rule audit
  },
)
