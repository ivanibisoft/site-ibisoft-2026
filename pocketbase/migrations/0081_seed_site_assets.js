migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_assets')

    const seeds = [
      { name: 'Logo Principal', slug: 'logo-principal', alt_text: 'Logo ibisoft Tecnologia' },
      { name: 'Foto CEO', slug: 'foto-ceo', alt_text: 'Foto do CEO Ivan Christófolli' },
      { name: 'Certificado DUNS', slug: 'certificado-duns', alt_text: 'Certificado DUNS ibisoft' },
      { name: 'Logo ibisoft (Sobre)', slug: 'logo-ibisoft-r', alt_text: 'Logomarca ibisoft' },
      {
        name: 'Imagem Sobre - Historia',
        slug: 'imagem-sobre-1',
        alt_text: 'Equipe ibisoft no escritorio',
      },
    ]

    for (const seed of seeds) {
      try {
        app.findFirstRecordByData('site_assets', 'slug', seed.slug)
      } catch (_) {
        const record = new Record(col)
        record.set('name', seed.name)
        record.set('slug', seed.slug)
        record.set('alt_text', seed.alt_text)
        app.save(record)
      }
    }
  },
  (app) => {
    const slugs = [
      'logo-principal',
      'foto-ceo',
      'certificado-duns',
      'logo-ibisoft-r',
      'imagem-sobre-1',
    ]
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('site_assets', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
