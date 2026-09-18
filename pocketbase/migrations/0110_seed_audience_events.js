migrate(
  (app) => {
    // Migration 0110: Dados de demonstração inicial para o Dashboard de Audiência da ibisoft
    const col = app.findCollectionByNameOrId('audience_events')

    const count = app.countRecords('audience_events')
    if (count > 0) {
      console.log('[migration 0110] audience_events já possui registros. Pulando seed.')
      return
    }

    console.log(
      '[migration 0110] Semeando amostra representativa de acessos anônimos para o dashboard...',
    )

    // Amostra de páginas e seções do site
    const pages = [
      { path: '/', section: 'Home', title: 'Página Inicial - ERP ibisoft' },
      { path: '/sobre-erp', section: 'Sobre ERP', title: 'Sobre o ERP ibisoft' },
      { path: '/cases', section: 'Cases', title: 'Cases de Sucesso' },
      { path: '/contato', section: 'Contato', title: 'Quero Conhecer / Contato' },
      { path: '/blog', section: 'Blog', title: 'Blog e Notícias ibisoft' },
      {
        path: '/blog/o-que-e-erp-e-por-que-sua-empresa-precisa-de-um',
        section: 'Blog Post',
        title: 'O que é ERP e por que sua empresa precisa de um',
        blog_slug: 'o-que-e-erp-e-por-que-sua-empresa-precisa-de-um',
      },
      {
        path: '/blog/5-sinais-de-que-sua-gestao-precisa-de-automacao',
        section: 'Blog Post',
        title: '5 sinais de que sua gestão precisa de automação',
        blog_slug: '5-sinais-de-que-sua-gestao-precisa-de-automacao',
      },
      {
        path: '/segmentos/industria',
        section: 'Soluções / Segmentos',
        title: 'Segmento Indústria',
      },
      {
        path: '/segmentos/distribuicao',
        section: 'Soluções / Segmentos',
        title: 'Segmento Distribuição',
      },
      {
        path: '/funcionalidades/gestao-financeira',
        section: 'Funcionalidades',
        title: 'Gestão Financeira',
      },
      {
        path: '/funcionalidades/comercio-exterior',
        section: 'Funcionalidades',
        title: 'Comércio Exterior',
      },
    ]

    const ufs = ['PR', 'SP', 'SC', 'RS', 'MG', 'RJ', 'GO', 'BA']
    const devices = [
      'pc',
      'pc',
      'pc',
      'smartphone',
      'smartphone',
      'smartphone',
      'smartphone',
      'tablet',
    ]

    // Gerar acessos distribuídos nos últimos 3 meses (Julho, Agosto, Setembro de 2026)
    const months = ['2026-07', '2026-08', '2026-09']

    for (let m = 0; m < months.length; m++) {
      const ym = months[m]
      const [year, month] = ym.split('-')
      const totalEvents = m === 0 ? 35 : m === 1 ? 55 : 85

      for (let i = 0; i < totalEvents; i++) {
        const p = pages[Math.floor(Math.random() * pages.length)]
        const uf = ufs[Math.floor(Math.random() * ufs.length)]
        const dev = devices[Math.floor(Math.random() * devices.length)]
        const day = String((i % 28) + 1).padStart(2, '0')
        const hour = Math.floor(Math.random() * 24)
        const vid = `visitor_anon_${(i % 20) + 1 + m * 15}`
        const sid = `sess_anon_${i + 1 + m * 100}`

        const record = new Record(col)
        record.set('visitor_id', vid)
        record.set('session_id', sid)
        record.set('path', p.path)
        record.set('section', p.section)
        record.set('title', p.title)
        record.set('blog_slug', p.blog_slug || '')
        record.set('device_type', dev)
        record.set('uf', uf)
        record.set('city', uf === 'PR' ? 'Curitiba' : uf === 'SP' ? 'São Paulo' : 'Capital')
        record.set('country', 'Brasil')
        record.set('access_hour', hour)
        record.set('access_year_month', ym)
        record.set('access_date', `${year}-${month}-${day}`)
        record.set('referrer', i % 3 === 0 ? 'https://google.com' : 'direto')

        app.save(record)
      }
    }

    console.log('[migration 0110] Amostra de eventos criada com sucesso.')
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('audience_events')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
