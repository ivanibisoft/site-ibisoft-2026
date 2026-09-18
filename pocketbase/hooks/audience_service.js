/**
 * Audience Service Hook - ibisoft Tecnologia
 * Versão 1.0.0
 *
 * NOTA DE ARQUITETURA JSVM:
 * O JSVM do PocketBase executa callbacks em pools isolados, logo todas as funções auxiliares
 * e constantes usadas dentro dos callbacks devem ser definidas inline ou no próprio escopo
 * do callback para evitar "scoping error / ReferenceError".
 */

// 1. Rota de diagnóstico de versão do hook
routerAdd('GET', '/backend/v1/ibisoft/audience/hook-version', (e) => {
  return e.json(200, {
    service: 'ibisoft-audience-service',
    version: '1.1.0',
    status: 'online',
    features: ['real-page-name-resolution', 'lgpd-compliant'],
    timestamp: new Date().toISOString(),
  })
})

// 2. Ingestão anônima de eventos de navegação
routerAdd('POST', '/backend/v1/ibisoft/audience/track', (e) => {
  try {
    const rawBody = toString(e.request.body)
    let body = {}
    try {
      body = JSON.parse(rawBody) || {}
    } catch (_) {
      try {
        body = e.requestInfo().body || {}
      } catch (__) {
        body = {}
      }
    }

    const path = String(body.path || '').slice(0, 500)
    let section = String(body.section || 'Outros').slice(0, 100)
    let title = String(body.title || '').slice(0, 300)
    let blogSlug = String(body.blog_slug || '').slice(0, 200)
    const visitorId = String(body.visitor_id || '').slice(0, 120)
    const sessionId = String(body.session_id || '').slice(0, 120)
    const referrer = String(body.referrer || '').slice(0, 500)

    // Resolução robusta de nome da página no backend caso o título seja genérico ou vazio
    const lowerPath = path.toLowerCase()
    const isGenericTitle =
      !title ||
      title === path ||
      title.startsWith('Módulo ERP (') ||
      title.startsWith('Segmento (') ||
      title.startsWith('Post do Blog (')

    if (isGenericTitle) {
      try {
        if (lowerPath.startsWith('/funcionalidades/')) {
          const rawSlug = path
            .replace(/^\/funcionalidades\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            try {
              const rec = e.app.findFirstRecordByData('modules', 'slug', slug)
              if (rec && rec.getString('name')) {
                title = 'Módulo — ' + rec.getString('name').trim()
                section = 'Funcionalidades'
              }
            } catch (_) {}
          }
        } else if (lowerPath.startsWith('/segmentos/')) {
          const rawSlug = path
            .replace(/^\/segmentos\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            try {
              const rec = e.app.findFirstRecordByData('segments', 'slug', slug)
              if (rec && rec.getString('title')) {
                title = 'Segmento — ' + rec.getString('title').trim()
                section = 'Soluções / Segmentos'
              }
            } catch (_) {}
          }
        } else if (lowerPath.startsWith('/blog/')) {
          const rawSlug = path
            .replace(/^\/blog\//i, '')
            .split('/')[0]
            .split('?')[0]
          const slug = decodeURIComponent(rawSlug).trim()
          if (slug) {
            blogSlug = slug
            try {
              const rec = e.app.findFirstRecordByData('posts', 'slug', slug)
              if (rec && rec.getString('title')) {
                title = rec.getString('title').trim()
                section = 'Blog Post'
              }
            } catch (_) {}
          }
        }
      } catch (resErr) {
        // Falha tolerante — mantém o título fornecido
      }
    }

    // Captura e enriquecimento por IP
    // O IP NUNCA é gravado na coleção audience_events por conformidade com a LGPD
    let clientIp = ''
    try {
      clientIp = e.realIP() || e.remoteIP() || ''
    } catch (_) {}

    const forwarded = e.request.header.get('X-Forwarded-For') || ''
    if (forwarded) {
      const parts = forwarded.split(',')
      if (parts.length > 0 && parts[0].trim()) {
        clientIp = parts[0].trim()
      }
    }

    // Função inline para detectar se IP é local/privado
    let isLocal = true
    if (clientIp) {
      const cleanIp = clientIp.trim().replace(/^::ffff:/, '')
      if (
        cleanIp !== '127.0.0.1' &&
        cleanIp !== '::1' &&
        cleanIp !== 'localhost' &&
        !cleanIp.startsWith('10.') &&
        !cleanIp.startsWith('192.168.') &&
        !cleanIp.startsWith('172.16.') &&
        !cleanIp.startsWith('172.17.') &&
        !cleanIp.startsWith('172.18.') &&
        !cleanIp.startsWith('172.19.') &&
        !cleanIp.startsWith('172.20.') &&
        !cleanIp.startsWith('172.21.') &&
        !cleanIp.startsWith('172.22.') &&
        !cleanIp.startsWith('172.23.') &&
        !cleanIp.startsWith('172.24.') &&
        !cleanIp.startsWith('172.25.') &&
        !cleanIp.startsWith('172.26.') &&
        !cleanIp.startsWith('172.27.') &&
        !cleanIp.startsWith('172.28.') &&
        !cleanIp.startsWith('172.29.') &&
        !cleanIp.startsWith('172.30.') &&
        !cleanIp.startsWith('172.31.')
      ) {
        isLocal = false
      }
    }

    let geoUf = 'PR' // Padrão
    let geoCity = 'Curitiba'
    let geoCountry = 'Brasil'

    if (!isLocal && clientIp) {
      try {
        const clean = clientIp.trim().replace(/^::ffff:/, '')
        const res = $http.send({
          url:
            'http://ip-api.com/json/' +
            encodeURIComponent(clean) +
            '?fields=status,country,region,city',
          method: 'GET',
          timeout: 2,
        })

        if (res && res.statusCode === 200 && res.json && res.json.status === 'success') {
          const region = String(res.json.region || '')
            .trim()
            .toUpperCase()
          const validStates = [
            'AC',
            'AL',
            'AP',
            'AM',
            'BA',
            'CE',
            'DF',
            'ES',
            'GO',
            'MA',
            'MT',
            'MS',
            'MG',
            'PA',
            'PB',
            'PR',
            'PE',
            'PI',
            'RJ',
            'RN',
            'RS',
            'RO',
            'RR',
            'SC',
            'SP',
            'SE',
            'TO',
          ]
          if (validStates.indexOf(region) !== -1) {
            geoUf = region
          } else {
            geoUf =
              res.json.country === 'Brazil' || res.json.country === 'Brasil'
                ? 'Outro'
                : 'Internacional'
          }
          geoCity = res.json.city || ''
          geoCountry = res.json.country || 'Brasil'
        }
      } catch (_) {
        // Falha de rede ou timeout na consulta de geo: mantém UF padrão
      }
    }

    // Parse do dispositivo
    let deviceType = body.device_type
    if (deviceType !== 'pc' && deviceType !== 'smartphone' && deviceType !== 'tablet') {
      const userAgent = String(e.request.header.get('User-Agent') || '').toLowerCase()
      if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) {
        deviceType = 'tablet'
      } else if (
        /mobile|iphone|ipod|android|blackberry|iemobile|opera mini|silk/i.test(userAgent)
      ) {
        deviceType = 'smartphone'
      } else {
        deviceType = 'pc'
      }
    }

    // Cálculo temporal
    const now = new Date()
    const accessHour = now.getHours()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const accessYearMonth = `${year}-${month}`
    const accessDate = `${year}-${month}-${day}`

    const collection = e.app.findCollectionByNameOrId('audience_events')
    const record = new Record(collection)

    record.set('visitor_id', visitorId || 'anon_' + $security.randomString(16))
    record.set('session_id', sessionId || 'sess_' + $security.randomString(16))
    record.set('path', path || '/')
    record.set('section', section)
    record.set('title', title)
    record.set('blog_slug', blogSlug)
    record.set('device_type', deviceType)
    record.set('uf', geoUf)
    record.set('city', geoCity)
    record.set('country', geoCountry)
    record.set('access_hour', accessHour)
    record.set('access_year_month', accessYearMonth)
    record.set('access_date', accessDate)
    record.set('referrer', referrer)

    e.app.save(record)

    return e.json(200, {
      success: true,
      tracked: true,
      enriched: {
        uf: geoUf,
        device: deviceType,
      },
    })
  } catch (err) {
    // Garantia de resiliência: falha de coleta NUNCA quebra a navegação
    return e.json(200, {
      success: false,
      message: 'Logged with fallback',
    })
  }
})
