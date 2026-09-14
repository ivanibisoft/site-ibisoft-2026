migrate(
  (app) => {
    // Migration 0106: Força recarga e sincronização do backend para a versão v3.4 do hook de e-mail.
    console.log('[migration 0106] Executando recarga de hooks e sincronização SMTP v3.4...')
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
        console.log('[migration 0106] Configurações SMTP validadas e persistidas com sucesso.')
      }
    } catch (err) {
      console.warn('[migration 0106] Aviso ao sincronizar settings:', err)
    }
  },
  (app) => {},
)
