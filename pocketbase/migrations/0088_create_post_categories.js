migrate(
  (app) => {
    // 1. Criar a coleção post_categories
    const col = new Collection({
      name: 'post_categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'order', type: 'number', required: false },
        { name: 'is_active', type: 'bool', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_post_categories_name ON post_categories (name)',
        'CREATE INDEX idx_post_categories_order ON post_categories (order)',
        'CREATE INDEX idx_post_categories_is_active ON post_categories (is_active)',
      ],
    })
    app.save(col)

    // 2. Seed das 11 categorias padrão
    const initialCategories = [
      'Atacadista e Distribuidora',
      'Comércio Exterior',
      'Estoque e Armazenagem',
      'Gestão Comercial e Vendas',
      'Gestão Empresarial',
      'Gestão Financeira',
      'Indústria e Produção',
      'Logística e Entregas',
      'Serviços',
      'Tecnologia e Inovação',
      'Tributação e Fiscal',
    ]

    const categoriesCollection = app.findCollectionByNameOrId('post_categories')
    initialCategories.forEach((name, index) => {
      try {
        app.findFirstRecordByData('post_categories', 'name', name)
      } catch (_) {
        const record = new Record(categoriesCollection)
        record.set('name', name)
        record.set('order', (index + 1) * 10)
        record.set('is_active', true)
        app.save(record)
      }
    })
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('post_categories')
      app.delete(col)
    } catch (_) {}
  },
)
