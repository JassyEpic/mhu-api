'use strict';

/**
 * Ordnet die Terrassen-Bereiche den 5 Themen zu und setzt die Reihenfolge.
 * Ändert NUR die Felder "thema" und "reihenfolge" – in Entwurf und veröffentlichter
 * Fassung gleichermaßen –, sonst nichts. Kann gefahrlos mehrfach laufen.
 *
 * Aufruf:  npm run terrassen:themen
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const ZUORDNUNG = {
  excellence: ['Terrassen', 1],
  classique: ['Terrassen', 2],
  wohnterrassen: ['Terrassen', 3],
  sonderterrassen: ['Terrassen', 4],
  'planen-ueberdachungen': ['Ueberdachungen', 5],
  terrassenoptionen: ['Ueberdachungen', 6],
  gartenhaeuser: ['Gartenhaeuser', 7],
  unterkuenfte: ['Gartenhaeuser', 8],
  'zubehoer-outdoormoebel': ['Zubehoer', 9],
  'esprit-nature': ['Zubehoer', 10],
  massanfertigung: ['Massanfertigung', 11],
};

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const uid = 'api::terrassenkategorie.terrassenkategorie';

  for (const [slug, [thema, reihenfolge]] of Object.entries(ZUORDNUNG)) {
    // direkt auf DB-Ebene: betrifft alle Fassungen (Entwurf + veröffentlicht) des Eintrags
    const { count } = await app.db.query(uid).updateMany({ where: { slug }, data: { thema, reihenfolge } });
    console.log(`${slug.padEnd(24)} -> ${thema} (${reihenfolge})${count ? '' : '  – nicht gefunden'}`);
  }

  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
