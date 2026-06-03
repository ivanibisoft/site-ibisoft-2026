migrate(
  (app) => {
    let moduleRecord
    try {
      moduleRecord = app.findFirstRecordByData('modules', 'slug', 'cadastro-de-pessoas')
    } catch (_) {
      try {
        moduleRecord = app.findFirstRecordByData('modules', 'name', 'Cadastro de Pessoas')
      } catch (_) {
        return // Record not found, safe to skip
      }
    }

    // Find associated resource groups
    let groups = []
    try {
      groups = app.findRecordsByFilter(
        'resource_groups',
        `module = "${moduleRecord.id}"`,
        '',
        1000,
        0,
      )
    } catch (_) {}

    // Delete all resources in those groups, then the groups themselves
    for (const group of groups) {
      let resources = []
      try {
        resources = app.findRecordsByFilter('resources', `group = "${group.id}"`, '', 1000, 0)
      } catch (_) {}

      for (const r of resources) {
        app.delete(r)
      }
      app.delete(group)
    }

    // Delete the module
    app.delete(moduleRecord)
  },
  (app) => {
    // Empty down migration as recreating dynamic data would require full state restoration
  },
)
