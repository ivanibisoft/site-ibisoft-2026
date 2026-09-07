migrate(
  (app) => {
    // Sincroniza as credenciais existentes de email_config diretamente nas settings SMTP do PocketBase
    // Isso garante que o app.settings().smtp esteja ativo e correto imediatamente no banco SQLite.
    try {
      const config = app.findFirstRecordByData('email_config', 'id', '9r6txqusjj3c8cz')
      if (config) {
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
        console.log(
          '[migration 0103] SMTPSettings sincronizadas com sucesso a partir do email_config!',
        )
      }
    } catch (err) {
      console.warn('[migration 0103] Aviso ao sincronizar settings:', err)
    }
  },
  (app) => {},
)
