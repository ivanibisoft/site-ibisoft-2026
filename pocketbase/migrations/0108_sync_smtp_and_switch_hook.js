migrate(
  (app) => {
    // Migration 0108: Sincroniza configurações SMTP diretamente no app.settings()
    // e garante que a tabela de email_config reflita as configurações operacionais.
    console.log('[migration 0108] Executando sincronização de email_config e SMTP...')
    try {
      const records = app.findRecordsByFilter('email_config', '', '-created', 1, 0)
      if (records && records.length > 0) {
        const config = records[0]
        const host = (config.getString('smtp_host') || '').trim()
        const port = config.getInt('smtp_port') || 587
        const user = (config.getString('smtp_user') || '').trim()
        const pass = config.getString('smtp_pass') || ''
        const tls = config.getBool('smtp_tls')
        const senderAddress =
          (config.getString('sender_address') || '').trim() || 'contato@ibisoft.com.br'
        const senderName = (config.getString('sender_name') || '').trim() || 'ibisoft Tecnologia'

        const settings = app.settings()
        settings.meta.senderAddress = senderAddress
        settings.meta.senderName = senderName

        if (host) {
          settings.smtp.enabled = true
          settings.smtp.host = host
          settings.smtp.port = port
          settings.smtp.username = user
          settings.smtp.password = pass || settings.smtp.password || ''
          settings.smtp.tls = tls
        }
        app.saveNoValidate(settings)
        console.log('[migration 0108] Configurações SMTP sincronizadas via migration.')
      }
    } catch (err) {
      console.warn('[migration 0108] Falha ao sincronizar SMTP:', err)
    }
  },
  (app) => {},
)
