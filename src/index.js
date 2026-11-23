'use strict';

// Rechte der öffentlichen Rolle (Website ohne Login). Neue Content-Types hier
// eintragen, statt die Rechte im Admin von Hand zu setzen.
const PUBLIC_PERMISSIONS = {
  // nur lesen
  'api::hersteller.hersteller': ['find', 'findOne'],
  'api::modellreihe.modellreihe': ['find', 'findOne'],
  'api::mobilheim.mobilheim': ['find', 'findOne'],
  'api::concept.concept': ['find', 'findOne'],
  'api::design.design': ['find', 'findOne'],
  'api::konstruktion.konstruktion': ['find', 'findOne'],
  'api::optionsgruppe.optionsgruppe': ['find', 'findOne'],
  'api::tradefair.tradefair': ['find', 'findOne'],
  'api::leistung.leistung': ['find', 'findOne'],
  'api::faq.faq': ['find', 'findOne'],
  'api::terrassenkategorie.terrassenkategorie': ['find', 'findOne'],
  'api::gelaendermodell.gelaendermodell': ['find', 'findOne'],
  'api::terrassen-uebersicht.terrassen-uebersicht': ['find'],
  'api::impressum.impressum': ['find'],
  'api::datenschutz.datenschutz': ['find'],
  // Kontaktformular: nur anlegen, niemals lesen
  'api::anfrage.anfrage': ['create'],
};

async function grantPublicPermissions(strapi) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!role) return;

  for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
    if (!strapi.contentTypes[uid]) continue;
    for (const action of actions) {
      const name = `${uid}.${action}`;
      const exists = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: name, role: role.id } });
      if (!exists) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .create({ data: { action: name, role: role.id } });
        strapi.log.info(`Public-Recht gesetzt: ${name}`);
      }
    }
  }
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await grantPublicPermissions(strapi);
  },
};
