module.exports = ({ env }) => ({
  host: env("HOST", "localhost"),
  port: env.int("PORT", 1337),
  url: env("FRONTEND_URL", "http://api.mobilheim-union.de"),
  // hinter Reverse-Proxy (nginx, Plesk …) true, damit ctx.request.ip die echte Besucher-IP ist
  proxy: { koa: env.bool("IS_PROXIED", false) },
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
