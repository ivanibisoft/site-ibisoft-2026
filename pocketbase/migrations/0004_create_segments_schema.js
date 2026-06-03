migrate(
  (app) => {
    const segments = new Collection({
      name: 'segments',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_segments_slug ON segments (slug)'],
    })
    app.save(segments)

    const segmentChallenges = new Collection({
      name: 'segment_challenges',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'segment',
          type: 'relation',
          required: true,
          collectionId: segments.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_segment_challenges_segment ON segment_challenges (segment)',
        'CREATE INDEX idx_segment_challenges_order ON segment_challenges (`order`)',
      ],
    })
    app.save(segmentChallenges)
  },
  (app) => {
    const challenges = app.findCollectionByNameOrId('segment_challenges')
    app.delete(challenges)

    const segments = app.findCollectionByNameOrId('segments')
    app.delete(segments)
  },
)
