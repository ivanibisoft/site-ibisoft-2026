migrate(
  (app) => {
    // Normalizar categorias existentes nos posts para os nomes padronizados
    try {
      app
        .db()
        .newQuery(`
        UPDATE posts
        SET category = 'Estoque e Armazenagem'
        WHERE category = 'Estoque'
      `)
        .execute()

      app
        .db()
        .newQuery(`
        UPDATE posts
        SET category = 'Tributação e Fiscal'
        WHERE category = 'Tributação'
      `)
        .execute()
    } catch (e) {
      console.log('Error updating posts categories:', e)
    }
  },
  (app) => {
    try {
      app
        .db()
        .newQuery(`
        UPDATE posts
        SET category = 'Estoque'
        WHERE category = 'Estoque e Armazenagem'
      `)
        .execute()

      app
        .db()
        .newQuery(`
        UPDATE posts
        SET category = 'Tributação'
        WHERE category = 'Tributação e Fiscal'
      `)
        .execute()
    } catch (_) {}
  },
)
