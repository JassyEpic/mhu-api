'use strict';

/**
 * Legt den Single Type "Datenschutz" als ENTWURF an – mit dem Abschnitt zu lokal
 * eingebundenen Schriftarten und Icons. Die übrigen Abschnitte bitte im Admin
 * ergänzen und erst dann veröffentlichen.
 * Läuft nur, wenn noch keine Datenschutzerklärung existiert.
 *
 * Aufruf:  npm run seed:datenschutz
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const text = (t) => ({ type: 'text', text: t });
const p = (t) => ({ type: 'paragraph', children: [text(t)] });
const h = (t) => ({ type: 'heading', level: 2, children: [text(t)] });

const DATENSCHUTZ = {
  titel: 'Datenschutzerklärung',
  stand: '2026-10-29',
  inhalt: [
    h('Schriftarten und Icons (lokal eingebunden)'),
    p(
      'Diese Website verwendet die Schriftarten „Manrope“ und „Newsreader“ (Google Fonts) sowie die Icon-Schrift „Font Awesome“. ' +
        'Alle Schrift- und Icon-Dateien sind lokal auf unserem Server gespeichert und werden beim Aufruf der Website von dort geladen.',
    ),
    p(
      'Dabei wird keine Verbindung zu Servern von Google, Fonticons oder anderen Drittanbietern hergestellt; ' +
        'es werden in diesem Zusammenhang keine personenbezogenen Daten an Dritte übermittelt.',
    ),
  ],
};

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents('api::datenschutz.datenschutz');

  if (await docs.findFirst({ status: 'draft' })) {
    console.log('übersprungen: Datenschutzerklärung existiert bereits – Abschnitt bitte von Hand ergänzen');
    process.exit(0);
  }
  // bewusst nur als Entwurf: unvollständige Datenschutzerklärung nicht veröffentlichen
  await docs.create({ data: DATENSCHUTZ, status: 'draft' });
  console.log('angelegt (Entwurf): Datenschutzerklärung mit Abschnitt „Schriftarten und Icons“');

  // Kein app.destroy() (sonst harmlose "aborted"-Meldung von knex)
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
