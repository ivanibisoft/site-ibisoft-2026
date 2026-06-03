migrate(
  (app) => {
    try {
      // Find the module by exact name
      const moduleRecord = app.findFirstRecordByData('modules', 'name', 'Gestão Contábil')

      // Remove associated child records to prevent foreign key constraint issues
      try {
        const groups = app.findRecordsByFilter(
          'resource_groups',
          `module = "${moduleRecord.id}"`,
          '',
          1000,
          0,
        )
        for (const group of groups) {
          try {
            const resources = app.findRecordsByFilter(
              'resources',
              `group = "${group.id}"`,
              '',
              1000,
              0,
            )
            for (const resource of resources) {
              app.delete(resource)
            }
          } catch (_) {}
          app.delete(group)
        }
      } catch (_) {}

      // Delete the target module
      app.delete(moduleRecord)
    } catch (_) {
      // Module might not exist, silently ignore to guarantee idempotency
    }
  },
  (app) => {
    // No data recreation needed for revert as per AC
  },
)
