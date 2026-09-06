migrate(
  (app) => {
    // 1. Excluir todos os registros existentes na coleção cases
    app.db().newQuery('DELETE FROM cases').execute()

    // 2. Modificar o schema da coleção cases para conter somente imagem + texto
    const col = app.findCollectionByNameOrId('cases')

    // Remover índices antigos que dependiam de slug e featured
    try {
      col.removeIndex('idx_cases_slug')
    } catch (_) {}
    try {
      col.removeIndex('idx_cases_featured')
    } catch (_) {}

    // Remover campos desnecessários: title, slug, category, client_name, content, featured
    // Manter ou redefinir: image, description (ou text).
    // Para simplificar e manter compatibilidade ou ter os campos exatos de imagem e texto:
    // Remover title, slug, category, client_name, content, featured
    const fieldsToRemove = ['title', 'slug', 'category', 'client_name', 'content', 'featured']
    for (const fName of fieldsToRemove) {
      try {
        const f = col.fields.getByName(fName)
        if (f) {
          col.fields.removeById(f.id)
        }
      } catch (_) {}
    }

    // Garantir que temos 'image' (file) e 'description' (text/textarea)
    // Se 'description' já existir, podemos mantê-la ou garantir que é texto
    let descField = col.fields.getByName('description')
    if (!descField) {
      col.fields.add(
        new TextField({
          name: 'description',
          required: true,
        }),
      )
    } else {
      descField.required = false
    }

    let imgField = col.fields.getByName('image')
    if (!imgField) {
      col.fields.add(
        new FileField({
          name: 'image',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    // Reverter não recria registros deletados, mas pode restaurar campos caso necessário
    const col = app.findCollectionByNameOrId('cases')
    if (!col.fields.getByName('title')) {
      col.fields.add(new TextField({ name: 'title', required: false }))
    }
    if (!col.fields.getByName('slug')) {
      col.fields.add(new TextField({ name: 'slug', required: false }))
    }
    app.save(col)
  },
)
