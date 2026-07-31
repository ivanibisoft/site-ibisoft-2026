migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('testimonials')

    const existing = app.countRecords('testimonials')
    if (existing > 0) return

    const seeds = [
      {
        name: 'Carlos Eduardo',
        role: 'Atacadão Central',
        content:
          'O ERP transformou a maneira como gerenciamos nosso estoque. Reduzimos perdas em 30% já nos primeiros três meses e a visibilidade operacional melhorou drasticamente.',
        order: 1,
        is_active: true,
      },
      {
        name: 'Mariana Silva',
        role: 'TechSolutions',
        content:
          'A integração financeira e fiscal nos poupou incontáveis horas de trabalho manual. A equipe de suporte da ibisoft é excepcional e sempre nos ajuda prontamente.',
        order: 2,
        is_active: true,
      },
      {
        name: 'Roberto Mendes',
        role: 'Indústria Alpha',
        content:
          'Escalabilidade era nosso maior desafio. Com este sistema, conseguimos dobrar nossa produção sem perder o controle dos custos e mantendo a qualidade.',
        order: 3,
        is_active: true,
      },
      {
        name: 'Ana Luiza',
        role: 'Global Import Export',
        content:
          'A visão completa do negócio que o dashboard oferece mudou nossa forma de tomar decisões estratégicas. O fluxo de caixa nunca foi tão previsível e seguro.',
        order: 4,
        is_active: true,
      },
      {
        name: 'Fernando Costa',
        role: 'AgroGenética Pecuária',
        content:
          'Controlar a rastreabilidade nunca foi tão simples. O sistema atende perfeitamente às especificidades do nosso setor com um nível de detalhes incrível.',
        order: 5,
        is_active: true,
      },
      {
        name: 'Juliana Martins',
        role: 'Serviços Express',
        content:
          'Automatizar a emissão de notas fiscais e boletos foi um divisor de águas. Não imagino nossa rotina sem o sistema hoje, ganhamos muita agilidade no faturamento.',
        order: 6,
        is_active: true,
      },
    ]

    for (const seed of seeds) {
      const record = new Record(col)
      record.set('name', seed.name)
      record.set('role', seed.role)
      record.set('content', seed.content)
      record.set('order', seed.order)
      record.set('is_active', seed.is_active)
      app.save(record)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('testimonials')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
