/**
 * smtp_service.js - Serviço Consolidado de E-mail e Alertas de Leads por Página Real
 * ibisoft Tecnologia - Versão 1.3.0
 *
 * RESPONSABILIDADES:
 * 1. Endpoint GET /backend/v1/ibisoft/email/hook-version e GET /backend/v1/ibisoft/hook-version: diagnóstico de versão
 * 2. Endpoint POST /backend/v1/ibisoft/test-email: teste operacional de envio SMTP
 * 3. Gatilho onRecordCreateRequest('leads'): enriquece o lead com a jornada navegada na sessão
 *    (títulos reais das páginas visitadas em ordem cronológica com agrupamento consecutivo, página real de maior interesse, resumo formatado)
 * 4. Gatilho onRecordAfterCreateSuccess('leads'): envia confirmação ao visitante e
 *    alerta detalhado ao administrador contendo a jornada e página real de maior interesse do lead.
 * 5. Gatilhos onRecordAfterCreateSuccess('email_config') / onRecordAfterUpdateSuccess('email_config'):
 *    sincroniza configurações SMTP imediatamente.
 *
 * NOTA DE ARQUITETURA JSVM (PocketBase v0.36):
 * O JSVM executa callbacks em pools isolados, logo todas as funções auxiliares e constantes
 * devem ser autocontidas ou definidas inline dentro de cada callback para prevenir ReferenceError.
 * Falha de SMTP ou de rede NUNCA interrompe o fluxo principal da aplicação.
 */

console.log('[smtp_service v1.3.0] Carregando serviço consolidado de e-mail e alerta de leads...')

// ============================================================================
// 1. ROTAS DE DIAGNÓSTICO DE VERSÃO
// ============================================================================
routerAdd('GET', '/backend/v1/ibisoft/email/hook-version', (e) => {
  return e.json(200, {
    service: 'ibisoft-smtp-service',
    version: '1.3.0',
    features: [
      'smtp-sync',
      'lead-journey-alerts',
      'exact-page-resolution',
      'page-titles-journey-summary',
      'safe-test-email',
    ],
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

routerAdd('GET', '/backend/v1/ibisoft/hook-version', (e) => {
  return e.json(200, {
    service: 'ibisoft-smtp-service',
    version: '1.3.0',
    features: [
      'smtp-sync',
      'lead-journey-alerts',
      'exact-page-resolution',
      'page-titles-journey-summary',
      'safe-test-email',
    ],
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

// ============================================================================
// 2. ROTA DE TESTE DE ENVIO SMTP
// ============================================================================
routerAdd('POST', '/backend/v1/ibisoft/test-email', (e) => {
  try {
    let emailConfig = null
    try {
      const records = e.app.findRecordsByFilter('email_config', '', '-created', 1, 0)
      if (records && records.length > 0) {
        emailConfig = records[0]
      }
    } catch (findErr) {
      console.warn('[smtp_service v1.1.0] Falha ao consultar email_config:', findErr)
    }

    if (!emailConfig) {
      return e.json(200, {
        success: false,
        message: 'Nenhuma configuração de e-mail encontrada na coleção email_config.',
      })
    }

    const host = (emailConfig.getString('smtp_host') || '').trim()
    const port = emailConfig.getInt('smtp_port') || 587
    const user = (emailConfig.getString('smtp_user') || '').trim()
    const pass = emailConfig.getString('smtp_pass') || ''
    const tls = emailConfig.getBool('smtp_tls')
    const senderAddress =
      (emailConfig.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
    const senderName = (emailConfig.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'
    const adminEmail =
      (emailConfig.getString('admin_email') || '').trim() || 'contato@ibisoft.com.br'

    if (!host || !user) {
      return e.json(200, {
        success: false,
        message: 'Servidor SMTP (Host) ou Usuário SMTP não configurados.',
      })
    }

    // Sincroniza configurações SMTP no app
    try {
      const settings = e.app.settings()
      settings.meta.senderAddress = senderAddress
      settings.meta.senderName = senderName
      settings.smtp.enabled = true
      settings.smtp.host = host
      settings.smtp.port = port
      settings.smtp.username = user
      if (pass) {
        settings.smtp.password = pass
      }
      settings.smtp.tls = tls
      e.app.saveNoValidate(settings)
    } catch (syncErr) {
      console.warn('[smtp_service v1.1.0] Aviso ao atualizar settings do PocketBase:', syncErr)
    }

    const testSubject = '[Teste ibisoft] Diagnóstico de Envio SMTP v1.3'
    const testBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; margin-top: 0;">Diagnóstico de Envio SMTP ibisoft</h2>
        <p>Este é um e-mail de teste operacional enviado pelo painel administrativo da <strong>ibisoft Tecnologia</strong>.</p>
        <div style="background-color: #f8fafc; padding: 12px 16px; border-left: 4px solid #0284c7; border-radius: 4px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Servidor Host:</strong> ${host}:${port}</p>
          <p style="margin: 4px 0;"><strong>Usuário:</strong> ${user}</p>
          <p style="margin: 4px 0;"><strong>TLS Habilitado:</strong> ${tls ? 'Sim' : 'Não'}</p>
          <p style="margin: 4px 0;"><strong>Remetente:</strong> ${senderName} &lt;${senderAddress}&gt;</p>
          <p style="margin: 4px 0;"><strong>Destinatário de Teste:</strong> ${adminEmail}</p>
          <p style="margin: 4px 0;"><strong>Versão do Hook:</strong> v1.3.0 (Alertas de Leads por Página Real)</p>
          <p style="margin: 4px 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        <p style="color: #15803d; font-weight: bold;">✓ Comunicação SMTP operacional com sucesso!</p>
      </div>
    `

    const mailer = new MailerMessage({
      from: { address: senderAddress, name: senderName },
      to: [{ address: adminEmail }],
      subject: testSubject,
      html: testBody,
    })

    e.app.newMailClient().send(mailer)
    console.log('[smtp_service v1.1.0] E-mail de teste enviado com sucesso para:', adminEmail)

    return e.json(200, {
      success: true,
      message: `E-mail de teste enviado com sucesso para ${adminEmail}!`,
      recipient: adminEmail,
    })
  } catch (err) {
    console.error('[smtp_service v1.1.0] Falha no teste de envio SMTP:', err)
    return e.json(200, {
      success: false,
      message: `Falha no envio: ${err.message || String(err)}`,
    })
  }
})

// ============================================================================
// 3. GATILHO ON RECORD CREATE REQUEST (leads)
//    Cruza o session_id do lead com audience_events para enriquecer os campos
//    primary_interest, journey_summary e journey_details antes de persistir o lead.
// ============================================================================
onRecordCreateRequest((e) => {
  // Helper inline no callback para resolver título exato e legível
  const resolveExactPageName = (app, path, fallbackTitle) => {
    if (!path) return fallbackTitle || 'Página Inicial'
    const cleanPath = String(path).trim()
    const lower = cleanPath.toLowerCase()

    let title = (fallbackTitle || '').trim()
    const hasGenericPattern =
      !title ||
      title === cleanPath ||
      title.indexOf('(') !== -1 ||
      title.indexOf('Módulo ERP') === 0 ||
      title.indexOf('Segmento (') === 0 ||
      title.indexOf('Post do Blog (') === 0

    if (!hasGenericPattern) {
      return title
    }

    try {
      if (lower.indexOf('/funcionalidades/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/funcionalidades\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('modules', 'slug', slug)
            if (rec && rec.getString('name')) {
              return 'Módulo — ' + rec.getString('name').trim()
            }
          } catch (_) {}
        }
        return 'Módulo — ' + (slug || 'ERP')
      }

      if (lower.indexOf('/segmentos/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/segmentos\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('segments', 'slug', slug)
            if (rec && rec.getString('title')) {
              return 'Segmento — ' + rec.getString('title').trim()
            }
          } catch (_) {}
        }
        return 'Segmento — ' + (slug || 'Soluções')
      }

      if (lower.indexOf('/blog/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/blog\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('posts', 'slug', slug)
            if (rec && rec.getString('title')) {
              return rec.getString('title').trim()
            }
          } catch (_) {}
        }
        return 'Artigo: ' + slug
      }

      if (lower === '/' || lower === '') return 'Página Inicial'
      if (lower.indexOf('/sobre-erp') === 0) return 'Sobre o ERP ibisoft'
      if (lower.indexOf('/sobre') === 0) return 'Quem Somos'
      if (lower.indexOf('/cases') === 0) return 'Cases de Sucesso'
      if (lower.indexOf('/blog') === 0) return 'Blog e Artigos'
      if (lower.indexOf('/quero-conhecer') === 0 || lower.indexOf('/contato') === 0)
        return 'Quero Conhecer / Contato'
      if (lower.indexOf('/duns') === 0) return 'Certificado D-U-N-S'
      if (lower.indexOf('/inpi') === 0) return 'Certificado INPI'
      if (lower.indexOf('/cnpj') === 0) return 'Cartão CNPJ'
      if (lower.indexOf('/politica-de-privacidade') === 0 || lower.indexOf('/privacidade') === 0)
        return 'Política de Privacidade'
    } catch (_) {}

    return title || cleanPath
  }

  try {
    const record = e.record
    const sessionId = (record.getString('session_id') || '').trim()

    let currentSummary = (record.getString('journey_summary') || '').trim()
    let currentInterest = (record.getString('primary_interest') || '').trim()

    // Se houver session_id, busca os eventos navegados na sessão para enriquecer
    if (sessionId) {
      try {
        const events = e.app.findRecordsByFilter(
          'audience_events',
          `session_id = '${sessionId.replace(/'/g, "\\'")}'`,
          'created',
          100,
          0,
        )

        if (events && events.length > 0) {
          const sectionCounts = {}
          const pageTitleCounts = {}
          const pathSteps = []

          for (let i = 0; i < events.length; i++) {
            const ev = events[i]
            const sec = (ev.getString('section') || 'Outros').trim()
            const path = (ev.getString('path') || '/').trim()
            let title = (ev.getString('title') || '').trim()
            const created = ev.getString('created') || ''

            // Resolver nome real e legível caso seja título antigo/genérico
            title = resolveExactPageName(e.app, path, title)

            sectionCounts[sec] = (sectionCounts[sec] || 0) + 1
            pageTitleCounts[title] = (pageTitleCounts[title] || 0) + 1

            pathSteps.push({
              path,
              section: sec,
              title,
              created,
            })
          }

          // 1. Identificar a PÁGINA REAL de maior interesse (mais visitada na sessão)
          const sortedPages = Object.keys(pageTitleCounts).sort(
            (a, b) => pageTitleCounts[b] - pageTitleCounts[a],
          )

          // Se primary_interest não foi definido ou é genérico (ex: apenas a seção genérica),
          // define para o título real da página mais visitada
          if (sortedPages.length > 0) {
            const topPageTitle = sortedPages[0]
            currentInterest = topPageTitle
            record.set('primary_interest', currentInterest)
          }

          // 2. Montar journey_summary a partir dos TÍTULOS REAIS das páginas em ordem cronológica
          // com agrupamento de repetições consecutivas: ex "Contato (2x) → Segmento — Indústria → Segmento — Serviços"
          const groupedConsecutiveSteps = []
          for (let i = 0; i < pathSteps.length; i++) {
            const stepTitle = pathSteps[i].title || 'Página'
            if (
              groupedConsecutiveSteps.length > 0 &&
              groupedConsecutiveSteps[groupedConsecutiveSteps.length - 1].title === stepTitle
            ) {
              groupedConsecutiveSteps[groupedConsecutiveSteps.length - 1].count++
            } else {
              groupedConsecutiveSteps.push({
                title: stepTitle,
                count: 1,
              })
            }
          }

          const stepsSummary = groupedConsecutiveSteps
            .map((item) => (item.count > 1 ? `${item.title} (${item.count}x)` : item.title))
            .join(' → ')

          currentSummary = stepsSummary || 'Navegação direta'
          record.set('journey_summary', currentSummary)

          // Seções ordenadas por frequência para manter compatibilidade com analytics
          const sortedSections = Object.keys(sectionCounts).sort(
            (a, b) => sectionCounts[b] - sectionCounts[a],
          )

          // Guardar detalhes da jornada em JSON com os nomes exatos das páginas
          try {
            record.set('journey_details', {
              session_id: sessionId,
              total_pages_viewed: events.length,
              top_pages: sortedPages.map((p) => ({
                title: p,
                views: pageTitleCounts[p],
              })),
              top_sections: sortedSections.map((s) => ({
                section: s,
                views: sectionCounts[s],
              })),
              steps: pathSteps.slice(0, 30),
            })
          } catch (_) {}
        }
      } catch (searchErr) {
        console.warn(
          '[smtp_service v1.3.0] Aviso ao cruzar eventos de audiência do lead:',
          searchErr,
        )
      }
    }

    // Se não encontrou eventos ou não tem session_id, define padrão amigável
    if (!record.getString('primary_interest')) {
      const src = record.getString('source_page') || 'Contato Direto'
      record.set(
        'primary_interest',
        src === 'exit-intent' ? 'Exit Intent (Retenção)' : 'Contato Direto',
      )
    }
    if (!record.getString('journey_summary')) {
      const src = record.getString('source_page') || 'Contato Direto'
      record.set(
        'journey_summary',
        src === 'exit-intent' ? 'Conversão via Pop-up de Saída' : 'Contato Direto',
      )
    }
  } catch (err) {
    // RESILIENTE: NUNCA interrompe a criação do lead
    console.warn('[smtp_service v1.3.0] Erro não fatal no pré-cadastro do lead:', err)
  }

  e.next()
}, 'leads')

// ============================================================================
// 4. GATILHO ON RECORD AFTER CREATE SUCCESS (leads)
//    Dispara confirmação ao visitante e alerta de novo lead ao administrador
//    com a indicação destacada da seção de maior interesse e jornada percorrida.
// ============================================================================
onRecordAfterCreateSuccess((e) => {
  e.next()

  // Helper inline no callback para resolver título exato e legível
  const resolveExactPageName = (app, path, fallbackTitle) => {
    if (!path) return fallbackTitle || 'Página Inicial'
    const cleanPath = String(path).trim()
    const lower = cleanPath.toLowerCase()

    let title = (fallbackTitle || '').trim()
    const hasGenericPattern =
      !title ||
      title === cleanPath ||
      title.indexOf('(') !== -1 ||
      title.indexOf('Módulo ERP') === 0 ||
      title.indexOf('Segmento (') === 0 ||
      title.indexOf('Post do Blog (') === 0

    if (!hasGenericPattern) {
      return title
    }

    try {
      if (lower.indexOf('/funcionalidades/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/funcionalidades\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('modules', 'slug', slug)
            if (rec && rec.getString('name')) {
              return 'Módulo — ' + rec.getString('name').trim()
            }
          } catch (_) {}
        }
        return 'Módulo — ' + (slug || 'ERP')
      }

      if (lower.indexOf('/segmentos/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/segmentos\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('segments', 'slug', slug)
            if (rec && rec.getString('title')) {
              return 'Segmento — ' + rec.getString('title').trim()
            }
          } catch (_) {}
        }
        return 'Segmento — ' + (slug || 'Soluções')
      }

      if (lower.indexOf('/blog/') === 0) {
        const rawSlug = cleanPath
          .replace(/^\/blog\//i, '')
          .split('/')[0]
          .split('?')[0]
        const slug = decodeURIComponent(rawSlug).trim()
        if (slug) {
          try {
            const rec = app.findFirstRecordByData('posts', 'slug', slug)
            if (rec && rec.getString('title')) {
              return rec.getString('title').trim()
            }
          } catch (_) {}
        }
        return 'Artigo: ' + slug
      }

      if (lower === '/' || lower === '') return 'Página Inicial'
      if (lower.indexOf('/sobre-erp') === 0) return 'Sobre o ERP ibisoft'
      if (lower.indexOf('/sobre') === 0) return 'Quem Somos'
      if (lower.indexOf('/cases') === 0) return 'Cases de Sucesso'
      if (lower.indexOf('/blog') === 0) return 'Blog e Artigos'
      if (lower.indexOf('/quero-conhecer') === 0 || lower.indexOf('/contato') === 0)
        return 'Quero Conhecer / Contato'
      if (lower.indexOf('/duns') === 0) return 'Certificado D-U-N-S'
      if (lower.indexOf('/inpi') === 0) return 'Certificado INPI'
      if (lower.indexOf('/cnpj') === 0) return 'Cartão CNPJ'
      if (lower.indexOf('/politica-de-privacidade') === 0 || lower.indexOf('/privacidade') === 0)
        return 'Política de Privacidade'
    } catch (_) {}

    return title || cleanPath
  }

  try {
    const lead = e.record
    const leadName = lead.getString('name') || 'Visitante'
    const leadEmail = lead.getString('email') || ''
    const leadPhone = lead.getString('phone') || 'Não informado'
    const leadMessage = lead.getString('message') || ''
    const sourcePage = lead.getString('source_page') || 'Contato do Site'
    const primaryInterest = lead.getString('primary_interest') || 'Contato Geral'
    const journeySummary = lead.getString('journey_summary') || 'Contato Direto'

    // Obter detalhes da jornada se disponível
    let journeyDetails = null
    try {
      const rawDetails = lead.get('journey_details')
      if (typeof rawDetails === 'string') {
        journeyDetails = JSON.parse(rawDetails)
      } else if (rawDetails && typeof rawDetails === 'object') {
        journeyDetails = rawDetails
      }
    } catch (_) {}

    // Buscar configurações de e-mail
    let emailConfig = null
    try {
      const records = e.app.findRecordsByFilter('email_config', '', '-created', 1, 0)
      if (records && records.length > 0) {
        emailConfig = records[0]
      }
    } catch (_) {}

    if (!emailConfig) {
      console.log('[smtp_service v1.1.0] email_config não configurado. Notificações ignoradas.')
      return
    }

    const host = (emailConfig.getString('smtp_host') || '').trim()
    const port = emailConfig.getInt('smtp_port') || 587
    const user = (emailConfig.getString('smtp_user') || '').trim()
    const pass = emailConfig.getString('smtp_pass') || ''
    const tls = emailConfig.getBool('smtp_tls')
    const senderAddress =
      (emailConfig.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
    const senderName = (emailConfig.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'
    const adminEmail =
      (emailConfig.getString('admin_email') || '').trim() || 'contato@ibisoft.com.br'

    if (!host || !user) {
      console.log(
        '[smtp_service v1.1.0] Servidor SMTP não configurado completamente. Envio ignorado.',
      )
      return
    }

    // Sincroniza defensivamente as credenciais SMTP no app
    try {
      const settings = e.app.settings()
      settings.meta.senderAddress = senderAddress
      settings.meta.senderName = senderName
      settings.smtp.enabled = true
      settings.smtp.host = host
      settings.smtp.port = port
      settings.smtp.username = user
      if (pass) {
        settings.smtp.password = pass
      }
      settings.smtp.tls = tls
      e.app.saveNoValidate(settings)
    } catch (_) {}

    const mailClient = e.app.newMailClient()

    // Helper simples para substituição de placeholders
    const replaceVars = (template) => {
      if (!template) return ''
      return String(template)
        .replace(/{name}/g, leadName)
        .replace(/{email}/g, leadEmail)
        .replace(/{phone}/g, leadPhone)
        .replace(/{message}/g, leadMessage.replace(/\n/g, '<br/>'))
        .replace(/{source_page}/g, sourcePage)
        .replace(/{primary_interest}/g, primaryInterest)
        .replace(/{journey_summary}/g, journeySummary)
    }

    // ------------------------------------------------------------------------
    // A) Envio do Alerta ao Administrador (com interesse e jornada em destaque)
    // ------------------------------------------------------------------------
    if (adminEmail) {
      try {
        const rawAdminSubject =
          emailConfig.getString('admin_alert_subject') ||
          'Novo lead recebido: {name} | Interesse: {primary_interest}'
        const adminSubject = replaceVars(rawAdminSubject)

        let adminBody = emailConfig.getString('admin_alert_body')
        if (adminBody) {
          adminBody = replaceVars(adminBody)
        } else {
          adminBody = `
            <h3>Novo contato cadastrado pelo site</h3>
            <p><strong>Nome:</strong> ${leadName}</p>
            <p><strong>E-mail:</strong> ${leadEmail}</p>
            <p><strong>Telefone:</strong> ${leadPhone}</p>
            <p><strong>Origem:</strong> ${sourcePage}</p>
            <p><strong>Mensagem:</strong></p>
            <blockquote>${leadMessage.replace(/\n/g, '<br/>')}</blockquote>
          `
        }

        // Bloco enriquecido com Alerta de Interesse por Seção e Jornada de Navegação
        let stepsHtml = ''
        if (
          journeyDetails &&
          Array.isArray(journeyDetails.steps) &&
          journeyDetails.steps.length > 0
        ) {
          const rows = journeyDetails.steps
            .slice(0, 10)
            .map((step) => {
              const displayTitle = resolveExactPageName(e.app, step.path, step.title)
              return `<li style="margin-bottom: 6px; color: #334155; line-height: 1.4;">
                <strong style="color: #0f172a;">${step.section || 'Página'}:</strong> 
                <span style="color: #0284c7; font-weight: 600;">${displayTitle}</span> 
                <span style="color: #94a3b8; font-size: 11px;">(${step.path})</span>
              </li>`
            })
            .join('')
          stepsHtml = `
            <div style="margin-top: 10px;">
              <span style="font-size: 12px; font-weight: bold; color: #334155;">Últimas páginas visualizadas antes do contato:</span>
              <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 12px;">
                ${rows}
              </ul>
            </div>
          `
        }

        const journeyCardHtml = `
          <div style="margin: 20px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="background-color: #16a34a; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                🎯 Alerta de Interesse do Lead
              </span>
            </div>
            <p style="margin: 6px 0; font-size: 14px; color: #166534;">
              <strong>Página de Maior Interesse:</strong> <span style="font-size: 15px; font-weight: bold; color: #14532d;">${primaryInterest}</span>
            </p>            <p style="margin: 6px 0; font-size: 13px; color: #374151;">
              <strong>Jornada Navegada na Sessão:</strong> ${journeySummary}
            </p>
            ${stepsHtml}
          </div>
        `

        const fullAdminHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0284c7; margin-top: 0;">Novo Lead Cadastrado no Site</h2>
            ${journeyCardHtml}
            <div style="background-color: #f8fafc; padding: 14px 18px; border-radius: 6px; border: 1px solid #e2e8f0;">
              ${adminBody}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
              Notificação gerada automaticamente pela plataforma ibisoft Tecnologia.
            </p>
          </div>
        `

        const adminMailer = new MailerMessage({
          from: { address: senderAddress, name: senderName },
          to: [{ address: adminEmail }],
          subject: adminSubject,
          html: fullAdminHtml,
        })

        mailClient.send(adminMailer)
        console.log('[smtp_service v1.3.0] Alerta de novo lead enviado ao admin:', adminEmail)
      } catch (adminErr) {
        console.error('[smtp_service v1.3.0] Falha ao enviar alerta ao administrador:', adminErr)
      }
    }

    // ------------------------------------------------------------------------
    // B) Envio da Confirmação ao Visitante / Lead (se e-mail informado)
    // ------------------------------------------------------------------------
    if (leadEmail && leadEmail.indexOf('@') !== -1) {
      try {
        const rawLeadSubject =
          emailConfig.getString('lead_confirmation_subject') ||
          'Recebemos seu contato - ibisoft Tecnologia'
        const leadSubject = replaceVars(rawLeadSubject)

        let leadBody = emailConfig.getString('lead_confirmation_body')
        if (leadBody) {
          leadBody = replaceVars(leadBody)
        } else {
          leadBody = `
            <p>Olá <strong>${leadName}</strong>,</p>
            <p>Agradecemos seu interesse na <strong>ibisoft Tecnologia</strong>! Recebemos sua mensagem enviada através de nosso site e nossa equipe especializada entrará em contato em breve.</p>
            <p>Atenciosamente,<br>Equipe ibisoft Tecnologia</p>
          `
        }

        const fullLeadHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            ${leadBody}
          </div>
        `

        const userMailer = new MailerMessage({
          from: { address: senderAddress, name: senderName },
          to: [{ address: leadEmail }],
          subject: leadSubject,
          html: fullLeadHtml,
        })

        mailClient.send(userMailer)
        console.log('[smtp_service v1.3.0] E-mail de confirmação enviado ao lead:', leadEmail)
      } catch (userErr) {
        console.error('[smtp_service v1.3.0] Falha ao enviar confirmação ao lead:', userErr)
      }
    }
  } catch (outerErr) {
    // RESILIENTE: NUNCA interrompe o fluxo principal
    console.error('[smtp_service v1.3.0] Erro geral ao processar notificações de lead:', outerErr)
  }
}, 'leads')

// ============================================================================
// 5. GATILHOS ON RECORD AFTER CREATE/UPDATE SUCCESS (email_config)
//    Mantém as configurações SMTP do PocketBase sempre sincronizadas.
//    (Função inline dentro de cada callback para total compatibilidade com o JSVM)
// ============================================================================
onRecordAfterCreateSuccess((e) => {
  e.next()
  try {
    const record = e.record
    const host = (record.getString('smtp_host') || '').trim()
    const port = record.getInt('smtp_port') || 587
    const user = (record.getString('smtp_user') || '').trim()
    const pass = record.getString('smtp_pass') || ''
    const tls = record.getBool('smtp_tls')
    const senderAddress =
      (record.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
    const senderName = (record.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'

    const settings = e.app.settings()
    settings.meta.senderAddress = senderAddress
    settings.meta.senderName = senderName

    if (host) {
      settings.smtp.enabled = true
      settings.smtp.host = host
      settings.smtp.port = port
      settings.smtp.username = user
      if (pass) {
        settings.smtp.password = pass
      }
      settings.smtp.tls = tls
    }
    e.app.saveNoValidate(settings)
    console.log(
      '[smtp_service v1.3.0] Configurações SMTP sincronizadas a partir de email_config (create).',
    )
  } catch (err) {
    console.warn('[smtp_service v1.3.0] Falha ao sincronizar SMTP a partir de email_config:', err)
  }
}, 'email_config')

onRecordAfterUpdateSuccess((e) => {
  e.next()
  try {
    const record = e.record
    const host = (record.getString('smtp_host') || '').trim()
    const port = record.getInt('smtp_port') || 587
    const user = (record.getString('smtp_user') || '').trim()
    const pass = record.getString('smtp_pass') || ''
    const tls = record.getBool('smtp_tls')
    const senderAddress =
      (record.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
    const senderName = (record.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'

    const settings = e.app.settings()
    settings.meta.senderAddress = senderAddress
    settings.meta.senderName = senderName

    if (host) {
      settings.smtp.enabled = true
      settings.smtp.host = host
      settings.smtp.port = port
      settings.smtp.username = user
      if (pass) {
        settings.smtp.password = pass
      }
      settings.smtp.tls = tls
    }
    e.app.saveNoValidate(settings)
    console.log(
      '[smtp_service v1.3.0] Configurações SMTP sincronizadas a partir de email_config (update).',
    )
  } catch (err) {
    console.warn('[smtp_service v1.3.0] Falha ao sincronizar SMTP a partir de email_config:', err)
  }
}, 'email_config')
