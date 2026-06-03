migrate(
  (app) => {
    app
      .db()
      .newQuery(
        "UPDATE team_members SET photo = 'ivan-2-7b6a6.jpg' WHERE name = 'Ivan Christófolli'",
      )
      .execute()
  },
  (app) => {
    app
      .db()
      .newQuery("UPDATE team_members SET photo = '' WHERE name = 'Ivan Christófolli'")
      .execute()
  },
)
