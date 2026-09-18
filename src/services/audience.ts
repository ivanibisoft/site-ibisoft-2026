import pb from '@/lib/pocketbase/client'

const VISITOR_ID_KEY = 'ibisoft_anon_vid'
const SESSION_ID_KEY = 'ibisoft_anon_sid'
const SESSION_EXPIRY_KEY = 'ibisoft_anon_stime'
const SESSION_DURATION_MS = 30 * 60 * 1000 // 30 minutos de inatividade

/**
 * Gera um ID pseudo-aleatório seguro sem usar cookies de terceiros ou dados pessoais.
 */
function generateRandomId(prefix = 'v'): string {
  const array = new Uint8Array(12)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
    return `${prefix}_${Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
}

/**
 * Retorna o identificador persistente do visitante anônimo (armazenado apenas no localStorage do próprio navegador).
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_render'
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY)
    if (!vid) {
      vid = generateRandomId('vid')
      localStorage.setItem(VISITOR_ID_KEY, vid)
    }
    return vid
  } catch (_) {
    return generateRandomId('temp_vid')
  }
}

/**
 * Retorna ou renova a sessão do visitante.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session'
  try {
    const now = Date.now()
    const lastActive = parseInt(sessionStorage.getItem(SESSION_EXPIRY_KEY) || '0', 10)
    let sid = sessionStorage.getItem(SESSION_ID_KEY)

    if (!sid || !lastActive || now - lastActive > SESSION_DURATION_MS) {
      sid = generateRandomId('sid')
      sessionStorage.setItem(SESSION_ID_KEY, sid)
    }

    sessionStorage.setItem(SESSION_EXPIRY_KEY, now.toString())
    return sid
  } catch (_) {
    return generateRandomId('temp_sid')
  }
}

/**
 * Detecta o tipo de dispositivo preliminar no navegador.
 */
export function detectDeviceType(): 'pc' | 'smartphone' | 'tablet' {
  if (typeof window === 'undefined') return 'pc'
  const ua = navigator.userAgent || ''
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet'
  }
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini|silk/i.test(ua)) {
    return 'smartphone'
  }
  return 'pc'
}

/**
 * Categoriza o caminho na seção do site
 */
export function classifySection(pathname: string): {
  section: string
  title: string
  blogSlug?: string
} {
  const path = pathname.toLowerCase()

  if (path === '/' || path === '') {
    return { section: 'Home', title: 'Página Inicial' }
  }
  if (path.startsWith('/sobre-erp')) {
    return { section: 'Sobre ERP', title: 'Sobre o ERP ibisoft' }
  }
  if (path.startsWith('/sobre')) {
    return { section: 'Sobre Nós', title: 'Quem Somos' }
  }
  if (path.startsWith('/cases')) {
    return { section: 'Cases', title: 'Cases de Sucesso' }
  }
  if (path.startsWith('/blog/')) {
    const slug = pathname.replace(/^\/blog\//, '').split('/')[0]
    return { section: 'Blog Post', title: `Post do Blog (${slug})`, blogSlug: slug }
  }
  if (path.startsWith('/blog')) {
    return { section: 'Blog', title: 'Blog e Artigos' }
  }
  if (path.startsWith('/quero-conhecer') || path.startsWith('/contato')) {
    return { section: 'Contato', title: 'Quero Conhecer / Contato' }
  }
  if (path.startsWith('/segmentos/')) {
    const slug = pathname.replace(/^\/segmentos\//, '').split('/')[0]
    return { section: 'Soluções / Segmentos', title: `Segmento (${slug})` }
  }
  if (path.startsWith('/funcionalidades/')) {
    const slug = pathname.replace(/^\/funcionalidades\//, '').split('/')[0]
    return { section: 'Funcionalidades', title: `Módulo ERP (${slug})` }
  }
  if (path.startsWith('/duns')) {
    return { section: 'Certificações', title: 'Certificado D-U-N-S' }
  }
  if (path.startsWith('/inpi')) {
    return { section: 'Certificações', title: 'Certificado INPI' }
  }
  if (path.startsWith('/cnpj')) {
    return { section: 'Institucional', title: 'Cartão CNPJ' }
  }
  if (path.startsWith('/admin')) {
    return { section: 'Admin', title: 'Painel Administrativo' }
  }

  return { section: 'Outras Páginas', title: pathname }
}

export interface TrackPayload {
  path?: string
  section?: string
  title?: string
  blog_slug?: string
}

export interface HookVersionResponse {
  service: string
  version: string
  status: string
  timestamp: string
}

/**
 * Consulta a versão ativa do hook de audiência
 */
export async function getAudienceHookVersion(): Promise<HookVersionResponse | null> {
  try {
    return await pb.send<HookVersionResponse>('/backend/v1/ibisoft/audience/hook-version', {
      method: 'GET',
    })
  } catch (err) {
    console.warn('[Audience] Falha ao consultar versão do hook:', err)
    return null
  }
}

/**
 * Envia o evento de rastreamento anônimo para o servidor.
 * RESILIENTE: NUNCA lança erro para cima, não bloqueia UI e não grava IP.
 */
export async function trackPageView(payload?: TrackPayload): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const currentPath = payload?.path || window.location.pathname
    // Não rastrear navegação interna do Admin para não enviesar métricas de visitantes reais
    if (currentPath.startsWith('/admin')) {
      return
    }

    const { section, title, blogSlug } = classifySection(currentPath)
    const visitorId = getOrCreateVisitorId()
    const sessionId = getOrCreateSessionId()
    const deviceType = detectDeviceType()
    const referrer = document.referrer ? document.referrer.slice(0, 500) : ''

    const data = {
      path: currentPath,
      section: payload?.section || section,
      title: payload?.title || title || document.title,
      blog_slug: payload?.blog_slug || blogSlug || '',
      visitor_id: visitorId,
      session_id: sessionId,
      device_type: deviceType,
      referrer,
    }

    // 1. Tentar via endpoint de hook dedicado (enriquece com UF e confirma dispositivo)
    try {
      await pb.send('/backend/v1/ibisoft/audience/track', {
        method: 'POST',
        body: data,
      })
      return
    } catch (hookErr) {
      // 2. Fallback resiliente: se o hook customizado estiver indisponível ou em boot,
      // salva direto na coleção audience_events (gravação permitida pelo createRule)
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')

      await pb.collection('audience_events').create({
        visitor_id: visitorId,
        session_id: sessionId,
        path: currentPath,
        section: data.section,
        title: data.title,
        blog_slug: data.blog_slug,
        device_type: deviceType,
        uf: 'PR', // Fallback aproximado
        city: 'Curitiba',
        country: 'Brasil',
        access_hour: now.getHours(),
        access_year_month: `${year}-${month}`,
        access_date: `${year}-${month}-${day}`,
        referrer,
      })
    }
  } catch (err) {
    // Falha silenciosa absoluta: a experiência do visitante é 100% preservada
    console.debug('[Audience tracker] Event skipped:', err)
  }
}
