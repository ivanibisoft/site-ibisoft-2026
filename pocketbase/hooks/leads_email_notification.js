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

function replacePlaceholders(template, data) {
  if (!template) return ''
  return template
    .replace(/\{name\}/g, data.name || '')
    .replace(/\{email\}/g, data.email || '')
    .replace(/\{phone\}/g, data.phone || '')
    .replace(/\{message\}/g, data.message || '')
    .replace(/\{source_page\}/g, data.source_page || '')
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function applySmtpSettings(app, config) {
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
    let changed = false

    if (settings.meta.senderAddress !== senderAddress) {
      settings.meta.senderAddress = senderAddress
      changed = true
    }
    if (settings.meta.senderName !== senderName) {
      settings.meta.senderName = senderName
      changed = true
    }

    if (host) {
      const isConfigured =
        settings.smtp.enabled &&
        settings.smtp.host === host &&
        settings.smtp.port === port &&
        settings.smtp.username === user &&
        settings.smtp.tls === tls

      if (!isConfigured) {
        settings.smtp.enabled = true
        settings.smtp.host = host
        settings.smtp.port = port
        settings.smtp.username = user
        if (pass) {
          settings.smtp.password = pass
        }
        settings.smtp.tls = tls
        changed = true
      }
    }

    if (changed) {
      app.save(settings)
    }
  } catch (err) {
    console.warn('[email-hooks] Falha ao sincronizar configurações SMTP:', err)
  }
}

// Quando o admin salva/atualiza as configurações de e-mail na coleção "email_config",
// sincronizamos imediatamente o app.settings() do PocketBase
onRecordAfterCreateSuccess((e) => {
  applySmtpSettings(e.app, e.record)
  e.next()
}, 'email_config')

onRecordAfterUpdateSuccess((e) => {
  applySmtpSettings(e.app, e.record)
  e.next()
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
    applySmtpSettings(e.app, config)
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
