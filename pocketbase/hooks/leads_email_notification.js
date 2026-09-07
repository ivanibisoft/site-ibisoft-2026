/**
 * Hook disparado após a criação com sucesso de um registro na coleção "leads".
 * Envia dois e-mails:
 * 1. Confirmação ao lead agradecendo o contato.
 * 2. Aviso ao administrador com os detalhes do lead.
 *
 * Utiliza as configurações salvas na coleção "email_config" e sincroniza
 * o cliente SMTP do PocketBase ($app.newMailClient()).
 * Se a configuração SMTP estiver ausente ou incompleta, registra um aviso amigável
 * nos logs do backend sem lançar erro nem interromper o cadastro do lead.
 */

console.log('[email-hooks] Hook leads_email_notification.js v3.1 inicializado!')

var syncSmtpSettings = function (app, config) {
  try {
    const host = (config.getString('smtp_host') || '').trim()
    const port = config.getInt('smtp_port') || 587
    const user = (config.getString('smtp_user') || '').trim()
    const pass = config.getString('smtp_pass') || ''
    const tls = config.getBool('smtp_tls')
    const senderAddress =
      (config.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
    const senderName = (config.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'

    const settings = app.settings()
    console.log(
      '[email-hooks] syncSmtpSettings iniciando. host:',
      host,
      'port:',
      port,
      'user:',
      user,
      'hasPass:',
      !!pass,
    )
    let changed = false

    if (senderAddress && settings.meta.senderAddress !== senderAddress) {
      settings.meta.senderAddress = senderAddress
      changed = true
    }
    if (senderName && settings.meta.senderName !== senderName) {
      settings.meta.senderName = senderName
      changed = true
    }

    if (host) {
      // Se não há senha fornecida agora, preservamos a senha existente do settings.smtp
      const effectivePass = pass || settings.smtp.password || ''
      const isConfigured =
        settings.smtp.enabled &&
        settings.smtp.host === host &&
        settings.smtp.port === port &&
        settings.smtp.username === user &&
        settings.smtp.password === effectivePass &&
        settings.smtp.tls === tls

      if (!isConfigured) {
        settings.smtp.enabled = true
        settings.smtp.host = host
        settings.smtp.port = port
        settings.smtp.username = user
        settings.smtp.password = effectivePass
        settings.smtp.tls = tls
        changed = true
      }
    } else {
      if (settings.smtp.enabled) {
        settings.smtp.enabled = false
        changed = true
      }
    }

    if (changed) {
      console.log('[email-hooks] Salvando novas configurações SMTP...')
      try {
        app.saveNoValidate(settings)
        console.log('[email-hooks] Configurações SMTP salvas com sucesso!')
      } catch (saveErr) {
        console.warn('[email-hooks] saveNoValidate falhou, tentando app.save:', saveErr)
        try {
          app.save(settings)
        } catch (saveErr2) {
          console.error('[email-hooks] Erro ao salvar settings do PocketBase:', saveErr2)
        }
      }
    }
  } catch (err) {
    console.warn('[email-hooks] Falha ao sincronizar configurações SMTP:', err)
  }
}

var replacePlaceholders = function (template, data) {
  if (!template) return ''
  return template
    .replace(/\{name\}/g, data.name || '')
    .replace(/\{email\}/g, data.email || '')
    .replace(/\{phone\}/g, data.phone || '')
    .replace(/\{message\}/g, data.message || '')
    .replace(/\{source_page\}/g, data.source_page || '')
}

var escapeHtml = function (str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Quando o admin salva/atualiza as configurações de e-mail na coleção "email_config",
// sincronizamos o app.settings() do PocketBase de forma segura e não bloqueante.
// IMPORTANTE: nunca relançar (throw) erros dentro do hook de sincronização de settings
// para não abortar a persistência da requisição HTTP do Admin (evita erro 400 no PATCH).
onRecordAfterCreateSuccess((e) => {
  e.next()
  try {
    syncSmtpSettings(e.app, e.record)
  } catch (err) {
    console.error(
      '[email-hooks] Falha ignorada ao sincronizar SMTP após create de email_config:',
      err,
    )
  }
}, 'email_config')

onRecordAfterUpdateSuccess((e) => {
  e.next()
  try {
    syncSmtpSettings(e.app, e.record)
  } catch (err) {
    console.error(
      '[email-hooks] Falha ignorada ao sincronizar SMTP após update de email_config:',
      err,
    )
  }
}, 'email_config')

// Gatilho principal para novos leads
onRecordAfterCreateSuccess((e) => {
  e.next()

  const lead = e.record
  const leadName = lead.getString('name') || ''
  const leadEmail = lead.getString('email') || ''
  const leadPhone = lead.getString('phone') || ''
  const leadMessage = lead.getString('message') || ''
  const leadSource = lead.getString('source_page') || ''

  console.log(`[email-hooks] Novo lead cadastrado: "${leadName}" <${leadEmail}> (id: ${lead.id})`)

  // 1. Buscar a configuração de e-mail
  let config = null
  try {
    const records = e.app.findRecordsByFilter('email_config', '', '-created', 1, 0)
    if (records && records.length > 0) {
      config = records[0]
    }
  } catch (err) {
    console.warn('[email-hooks] Erro ao consultar coleção email_config:', err)
  }

  // 2. Verificar credenciais SMTP
  const smtpHost = config ? (config.getString('smtp_host') || '').trim() : ''

  // Fallback defaults hardcoded
  const defaultSenderAddress = 'contato@ibisoft.com.br'
  const defaultSenderName = 'ibisoft Tecnologia'
  const defaultAdminEmail = 'contato@ibisoft.com.br'
  const defaultLeadSubject = 'Recebemos seu contato - ibisoft Tecnologia'
  const defaultLeadBody =
    '<p>Olá <strong>{name}</strong>,</p><p>Agradecemos seu interesse na <strong>ibisoft Tecnologia</strong>! Recebemos sua mensagem enviada através de nosso site e nossa equipe especializada entrará em contato em breve.</p><p>Atenciosamente,<br>Equipe ibisoft Tecnologia</p>'
  const defaultAdminSubject = 'Novo lead recebido pelo site: {name}'
  const defaultAdminBody =
    '<h3>Novo contato cadastrado pelo site</h3><p><strong>Nome:</strong> {name}</p><p><strong>E-mail:</strong> {email}</p><p><strong>Telefone:</strong> {phone}</p><p><strong>Página de Origem:</strong> {source_page}</p><p><strong>Mensagem:</strong></p><blockquote>{message}</blockquote>'

  const senderAddress =
    (config && config.getString('sender_address')
      ? config.getString('sender_address').trim()
      : '') || defaultSenderAddress
  const senderName =
    (config && config.getString('sender_name') ? config.getString('sender_name').trim() : '') ||
    defaultSenderName
  const adminEmail =
    (config && config.getString('admin_email') ? config.getString('admin_email').trim() : '') ||
    defaultAdminEmail

  const leadSubjectTpl =
    (config && config.getString('lead_confirmation_subject')
      ? config.getString('lead_confirmation_subject').trim()
      : '') || defaultLeadSubject
  const leadBodyTpl =
    (config && config.getString('lead_confirmation_body')
      ? config.getString('lead_confirmation_body').trim()
      : '') || defaultLeadBody

  const adminSubjectTpl =
    (config && config.getString('admin_alert_subject')
      ? config.getString('admin_alert_subject').trim()
      : '') || defaultAdminSubject
  const adminBodyTpl =
    (config && config.getString('admin_alert_body')
      ? config.getString('admin_alert_body').trim()
      : '') || defaultAdminBody

  // Se o SMTP não estiver configurado com host mínimo, loga aviso claro e encerra graciosamente
  if (!smtpHost) {
    console.warn(
      `[email-hooks] Envio de e-mail cancelado: Servidor SMTP não configurado no painel Admin (email_config.smtp_host vazio). O lead ${lead.id} foi registrado com sucesso.`,
    )
    return
  }

  // Garantir que as configurações de SMTP do PocketBase estejam atualizadas antes de criar o cliente
  if (config) {
    syncSmtpSettings(e.app, config)
  }

  const templateData = {
    name: escapeHtml(leadName),
    email: escapeHtml(leadEmail),
    phone: escapeHtml(leadPhone) || 'Não informado',
    message: escapeHtml(leadMessage).replace(/\n/g, '<br>'),
    source_page: escapeHtml(leadSource) || 'Site ibisoft',
  }

  const rawTemplateData = {
    name: leadName,
    email: leadEmail,
    phone: leadPhone || 'Não informado',
    message: leadMessage,
    source_page: leadSource || 'Site ibisoft',
  }

  // Criar cliente de e-mail nativo do PocketBase
  let mailClient = null
  try {
    mailClient = e.app.newMailClient()
  } catch (err) {
    console.error('[email-hooks] Erro ao instanciar newMailClient:', err)
    return
  }

  // (a) Enviar e-mail de confirmação para o Lead (se tiver e-mail válido)
  if (leadEmail) {
    try {
      const leadSubject = replacePlaceholders(leadSubjectTpl, rawTemplateData)
      const leadHtml = replacePlaceholders(leadBodyTpl, templateData)

      const leadMsg = new MailerMessage({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ address: leadEmail, name: leadName }],
        subject: leadSubject,
        html: leadHtml,
      })

      mailClient.send(leadMsg)
      console.log(`[email-hooks] E-mail de confirmação enviado para o lead: ${leadEmail}`)
    } catch (err) {
      console.error(
        `[email-hooks] Falha ao enviar e-mail de confirmação para o lead (${leadEmail}):`,
        err,
      )
    }
  }

  // (b) Enviar e-mail de aviso para o Administrador
  if (adminEmail) {
    try {
      const adminSubject = replacePlaceholders(adminSubjectTpl, rawTemplateData)
      const adminHtml = replacePlaceholders(adminBodyTpl, templateData)

      const adminMsg = new MailerMessage({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ address: adminEmail, name: 'Administrador ibisoft' }],
        subject: adminSubject,
        html: adminHtml,
      })

      mailClient.send(adminMsg)
      console.log(`[email-hooks] E-mail de aviso enviado para o administrador: ${adminEmail}`)
    } catch (err) {
      console.error(
        `[email-hooks] Falha ao enviar e-mail de aviso para o admin (${adminEmail}):`,
        err,
      )
    }
  }
}, 'leads')

// Endpoint para testar o envio de e-mail SMTP diretamente pelo painel Admin
console.log('[email-hooks] Registrando endpoint POST /api/ibisoft/test-email...')
routerAdd(
  'POST',
  '/api/ibisoft/test-email',
  (e) => {
    try {
      // 1. Buscar a configuração de e-mail salva
      let config = null
      try {
        const records = e.app.findRecordsByFilter('email_config', '', '-created', 1, 0)
        if (records && records.length > 0) {
          config = records[0]
        }
      } catch (findErr) {
        return e.json(500, {
          success: false,
          message:
            'Erro ao consultar configurações de e-mail no banco de dados: ' + String(findErr),
        })
      }

      if (!config) {
        return e.json(400, {
          success: false,
          message:
            'Nenhuma configuração de e-mail encontrada. Salve as configurações antes de testar.',
        })
      }

      const smtpHost = (config.getString('smtp_host') || '').trim()
      const smtpPort = config.getInt('smtp_port') || 587
      const smtpUser = (config.getString('smtp_user') || '').trim()
      const adminEmail = (config.getString('admin_email') || '').trim()
      const senderAddress =
        (config.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
      const senderName = (config.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'

      if (!smtpHost) {
        return e.json(400, {
          success: false,
          message: 'Host SMTP não configurado. Preencha e salve o Servidor SMTP antes do teste.',
        })
      }

      if (!adminEmail) {
        return e.json(400, {
          success: false,
          message: 'E-mail do Administrador não configurado para receber o teste.',
        })
      }

      // Sincronizar configurações SMTP para o app.settings()
      syncSmtpSettings(e.app, config)

      // Instanciar cliente de e-mail
      const mailClient = e.app.newMailClient()

      const now = new Date()
      const formattedDate = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

      const testMsg = new MailerMessage({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ address: adminEmail, name: 'Administrador ibisoft' }],
        subject: `[ibisoft] Teste de Envio SMTP - ${formattedDate}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="border-bottom: 2px solid #0066cc; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #0066cc; margin: 0;">ibisoft Tecnologia</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">Validação de Configuração SMTP</p>
            </div>
            <p>Olá,</p>
            <p>Este é um e-mail de teste disparado pelo painel administrativo do site <strong>ibisoft Tecnologia</strong>.</p>
            <div style="background-color: #f4f6f8; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #222;">Detalhes da conexão utilizada:</p>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Servidor Host:</strong> ${escapeHtml(smtpHost)}</li>
                <li><strong>Porta:</strong> ${smtpPort}</li>
                <li><strong>Usuário:</strong> ${escapeHtml(smtpUser || '(não informado)')}</li>
                <li><strong>Remetente (From):</strong> ${escapeHtml(senderName)} &lt;${escapeHtml(senderAddress)}&gt;</li>
                <li><strong>Destinatário (To):</strong> ${escapeHtml(adminEmail)}</li>
                <li><strong>Data/Hora do Teste:</strong> ${escapeHtml(formattedDate)}</li>
              </ul>
            </div>
            <p style="color: #28a745; font-weight: bold;">Se você está lendo esta mensagem, o envio de e-mails via SMTP está operando perfeitamente!</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0 15px 0;" />
            <p style="font-size: 12px; color: #999; margin: 0;">ibisoft Tecnologia da Informação — Sistema de Notificações</p>
          </div>
        `,
      })

      mailClient.send(testMsg)

      console.log(`[email-hooks] E-mail de teste SMTP enviado com sucesso para: ${adminEmail}`)

      return e.json(200, {
        success: true,
        message: `E-mail de teste enviado com sucesso para ${adminEmail}!`,
        recipient: adminEmail,
      })
    } catch (sendErr) {
      const errStr = String(sendErr && sendErr.message ? sendErr.message : sendErr)
      console.error('[email-hooks] Falha no teste de envio SMTP:', errStr)
      return e.json(500, {
        success: false,
        message: `Falha no envio de e-mail SMTP: ${errStr}`,
      })
    }
  },
  $apis.requireAuth(),
)
