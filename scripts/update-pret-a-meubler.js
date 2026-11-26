'use strict';

/**
 * Option "Prêt-à-meubler": Bild in die Mediathek laden (falls noch nicht vorhanden) und den
 * Inhalt des vorhandenen Eintrags durch den vollständigen Text mit Bild ersetzen.
 * Titel, Kurzbeschreibung, Zuordnungen und Haken bleiben unverändert.
 *
 * Aufruf:
 *   npm run update:pret-a-meubler               nur, wenn der Eintrag seit dem Anlegen nicht bearbeitet wurde
 *   npm run update:pret-a-meubler -- --ersetzen  Inhalt auch nach Bearbeitung ersetzen
 */

const fs = require('fs');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const { inhalt, UID, SLUG, BILD_NAME, KONFIGURATOR_HINWEIS } = require('../src/seed/optionen');

const ERSETZEN = process.argv.includes('--ersetzen');
const BILD_PFAD = path.join(__dirname, 'assets', BILD_NAME);

async function bildHochladen(app) {
  const vorhanden = await app.db.query('plugin::upload.file').findOne({ where: { name: BILD_NAME } });
  if (vorhanden) return vorhanden.id;

  const [datei] = await app
    .plugin('upload')
    .service('upload')
    .upload({
      data: {
        fileInfo: {
          name: BILD_NAME,
          alternativeText:
            'Mobilheim-Wohnraum mit Küche; Esstisch, Stühle, Lampen und Vorhang sind nur als Skizze eingezeichnet',
        },
      },
      files: {
        filepath: BILD_PFAD,
        originalFilename: BILD_NAME,
        mimetype: 'image/jpeg',
        size: fs.statSync(BILD_PFAD).size,
      },
    });
  console.log(`Bild hochgeladen: ${datei.url}`);
  return datei.id;
}

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents(UID);

  const eintrag = await docs.findFirst({ filters: { slug: SLUG }, status: 'draft' });
  if (!eintrag) {
    console.log('übersprungen: Eintrag „Prêt-à-meubler“ fehlt – wird beim nächsten Strapi-Start angelegt');
    process.exit(0);
  }
  const bearbeitet = new Date(eintrag.updatedAt) - new Date(eintrag.createdAt) > 2000;
  const war = await docs.findFirst({ filters: { slug: SLUG }, status: 'published' });
  const data = {};

  if (bearbeitet && !ERSETZEN) {
    console.log('Inhalt übersprungen: Eintrag wurde im Admin bearbeitet – mit --ersetzen trotzdem überschreiben');
  } else {
    data.inhalt = inhalt(await bildHochladen(app));
  }
  // Hinweis im Konfigurator: nur ergänzen, wenn das Feld noch leer ist (überschreibt nie Eigenes)
  if (!eintrag.konfiguratorHinweis) data.konfiguratorHinweis = KONFIGURATOR_HINWEIS;

  if (!Object.keys(data).length) {
    console.log('nichts zu tun');
    process.exit(0);
  }
  await docs.update({ documentId: eintrag.documentId, data });
  // nur wieder veröffentlichen, wenn der Eintrag vorher veröffentlicht war
  if (war) await docs.publish({ documentId: eintrag.documentId });
  console.log(
    `aktualisiert (${Object.keys(data).join(', ')})${war ? ' und veröffentlicht' : ' (Entwurf)'}: Prêt-à-meubler`
  );

  // Kein app.destroy() (sonst harmlose "aborted"-Meldung von knex)
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
