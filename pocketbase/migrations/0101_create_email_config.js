migrate(
  (app) => {
    // 1. Criar a coleção email_config
    const collection = new Collection({
      name: 'email_config',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'smtp_host', type: 'text' },
        { name: 'smtp_port', type: 'number', min: 1, max: 65535, onlyInt: true },
        { name: 'smtp_user', type: 'text' },
        { name: 'smtp_pass', type: 'text' },
        { name: 'sender_address', type: 'email' },
        { name: 'sender_name', type: 'text' },
        { name: 'smtp_tls', type: 'bool' },
        { name: 'admin_email', type: 'email' },
        { name: 'lead_confirmation_subject', type: 'text' },
        { name: 'lead_confirmation_body', type: 'editor' },
        { name: 'admin_alert_subject', type: 'text' },
        { name: 'admin_alert_body', type: 'editor' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })

    app.save(collection)

    // 2. Criar registro inicial padrão se não existir
    try {
      const existing = app.findRecordsByFilter('email_config', '', '', 1, 0)
      if (existing.length === 0) {
        const record = new Record(collection)
        record.set('smtp_host', '')
        record.set('smtp_port', 587)
        record.set('smtp_user', '')
        record.set('smtp_pass', '')
        record.set('sender_address', 'contato@ibisoft.com.br')
        record.set('sender_name', 'ibisoft Tecnologia')
        record.set('smtp_tls', true)
        record.set('admin_email', 'contato@ibisoft.com.br')
        record.set('lead_confirmation_subject', 'Recebemos seu contato - ibisoft Tecnologia')
        record.set(
          'lead_confirmation_body',
          '<p>Olá <strong>{name}</strong>,</p><p>Agradecemos seu interesse na <strong>ibisoft Tecnologia</strong>! Recebemos sua mensagem enviada através de nosso site e nossa equipe especializada entrará em contato em breve.</p><p>Atenciosamente,<br>Equipe ibisoft Tecnologia</p>',
        )
        record.set('admin_alert_subject', 'Novo lead recebido pelo site: {name}')
        record.set(
          'admin_alert_body',
          '<h3>Novo contato cadastrado pelo site</h3><p><strong>Nome:</strong> {name}</p><p><strong>E-mail:</strong> {email}</p><p><strong>Telefone:</strong> {phone}</p><p><strong>Página de Origem:</strong> {source_page}</p><p><strong>Mensagem:</strong></p><blockquote>{message}</blockquote>',
        )
        app.save(record)
      }
    } catch (e) {
      console.log('Aviso ao inicializar registro email_config:', e)
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('email_config')
      app.delete(collection)
    } catch (_) {}
  },
)
