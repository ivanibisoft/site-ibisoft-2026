migrate(
  (app) => {
    try {
      let record
      try {
        record = app.findFirstRecordByData('modules', 'name', 'Segurança da Informação')
      } catch (_) {
        record = app.findFirstRecordByData('modules', 'slug', 'seguranca-da-informacao')
      }

      if (record) {
        record.set(
          'description',
          'Proteja as informações da sua empresa com recursos avançados de segurança, controle de acessos e auditoria. O sistema permite definir permissões detalhadas por usuário ou departamento, garantindo que cada colaborador tenha acesso apenas às informações necessárias para sua função.',
        )
        app.save(record)
      }
    } catch (_) {
      console.log("Module 'Segurança da Informação' not found.")
    }
  },
  (app) => {
    // Revert is not implemented as previous description is unknown
  },
)
