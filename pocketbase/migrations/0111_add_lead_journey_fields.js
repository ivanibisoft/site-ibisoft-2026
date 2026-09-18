migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads')

    // 1. Campo session_id para relacionar com os eventos de audiência
    if (!col.fields.getByName('session_id')) {
      col.fields.add(
        new TextField({
          name: 'session_id',
          required: false,
          max: 120,
        }),
      )
    }

    // 2. Campo primary_interest: seção de maior interesse (ex: "Soluções / Segmentos")
    if (!col.fields.getByName('primary_interest')) {
      col.fields.add(
        new TextField({
          name: 'primary_interest',
          required: false,
          max: 200,
        }),
      )
    }

    // 3. Campo journey_summary: resumo textual legível da jornada (ex: "Soluções (3x) → Cases (2x) → Contato")
    if (!col.fields.getByName('journey_summary')) {
      col.fields.add(
        new TextField({
          name: 'journey_summary',
          required: false,
          max: 1000,
        }),
      )
    }

    // 4. Campo journey_details: JSON completo com os passos navegados pelo visitante antes da conversão
    if (!col.fields.getByName('journey_details')) {
      col.fields.add(
        new JSONField({
          name: 'journey_details',
          required: false,
          maxSize: 524288,
        }),
      )
    }

    app.save(col)

    // Index para busca ou filtro de leads por session_id
    try {
      col.addIndex('idx_leads_session_id', false, 'session_id', '')
      app.save(col)
    } catch (_) {}
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('leads')
      try {
        col.removeIndex('idx_leads_session_id')
      } catch (_) {}
      const f1 = col.fields.getByName('session_id')
      if (f1) col.fields.remove(f1)
      const f2 = col.fields.getByName('primary_interest')
      if (f2) col.fields.remove(f2)
      const f3 = col.fields.getByName('journey_summary')
      if (f3) col.fields.remove(f3)
      const f4 = col.fields.getByName('journey_details')
      if (f4) col.fields.remove(f4)
      app.save(col)
    } catch (_) {}
  },
)
