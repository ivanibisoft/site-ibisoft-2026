migrate(
  (app) => {
    const modules = new Collection({
      name: 'modules',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'icon', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_modules_slug ON modules (slug)'],
    })
    app.save(modules)

    const resourceGroups = new Collection({
      name: 'resource_groups',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'module',
          type: 'relation',
          required: true,
          collectionId: modules.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'order', type: 'number', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_resource_groups_module ON resource_groups (module)',
        'CREATE INDEX idx_resource_groups_order ON resource_groups (`order`)',
      ],
    })
    app.save(resourceGroups)

    const resources = new Collection({
      name: 'resources',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'group',
          type: 'relation',
          required: true,
          collectionId: resourceGroups.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_resources_group ON resources (`group`)'],
    })
    app.save(resources)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('resources'))
    app.delete(app.findCollectionByNameOrId('resource_groups'))
    app.delete(app.findCollectionByNameOrId('modules'))
  },
)
