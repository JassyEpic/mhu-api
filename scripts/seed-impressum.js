'use strict';

/**
 * Legt den Single Type "Impressum" mit den Angaben der alten Website an
 * (mobilheim-union.de/doc/impressum.html, Stand Oktober 2026). Nur die Pflichtangaben –
 * Haftungsausschluss/Urheberrecht bitte im Admin wörtlich ergänzen.
 * Läuft nur, wenn noch kein Impressum existiert.
 *
 * Aufruf:  npm run seed:impressum
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const text = (t, extra = {}) => ({ type: 'text', text: t, ...extra });
const p = (...children) => ({ type: 'paragraph', children });
const h = (t) => ({ type: 'heading', level: 2, children: [text(t)] });
const link = (url, label) => ({ type: 'link', url, children: [text(label)] });

const IMPRESSUM = {
  titel: 'Impressum',
  stand: '2026-10-29',
  inhalt: [
    // TMG wurde am 14.05.2024 durch das Digitale-Dienste-Gesetz (DDG) abgelöst
    h('Angaben gemäß § 5 DDG'),
    p(text('Mobilheimunion GmbH\nStockacher Str. 48\n78357 Mühlingen')),
    p(text('Dies ist der Hauptsitz und Postanschrift.')),
    h('Kontakt'),
    p(
      text('Tel.: +49 (0) 77 75 / 20 90 101\nE-Mail: '),
      link('mailto:info@mobilheim-union.de', 'info@mobilheim-union.de'),
    ),
    h('Vertreten durch die Geschäftsführerin'),
    p(text('Jasmin Kucharz')),
    h('Registereintrag'),
    p(text('Eintragung im Handelsregister.\nRegistergericht: Freiburg\nRegisternummer: HRB 709833')),
    h('Umsatzsteuer-ID'),
    p(text('Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:\nDE290228105')),
    h('Zweck der Webseite'),
    p(text('Handel mit Mobilheimen nebst Zubehör sowie dazugehörige Dienstleistungen.')),
  ],
};

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents('api::impressum.impressum');

  if (await docs.findFirst({ status: 'draft' })) {
    console.log('übersprungen: Impressum existiert bereits');
    process.exit(0);
  }
  await docs.create({ data: IMPRESSUM, status: 'published' });
  console.log('angelegt: Impressum');

  // Kein app.destroy() (sonst harmlose "aborted"-Meldung von knex)
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
