module.exports = ({ env }) => ({
  host: env("HOST", "localhost"),
  port: env.int("PORT", 1337),
  url: env("FRONTEND_URL", "http://api.mobilheim-union.de"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
