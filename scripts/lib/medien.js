'use strict';

// Gemeinsame Helfer der Import-Skripte: Bilder/PDFs von einer URL in die Strapi-Mediathek laden.
// Bereits importierte Dateien werden wiederverwendet – erkannt an der Quell-URL im Feld
// "Bildunterschrift" (caption).

const fs = require('fs');
const path = require('path');

const USER_AGENT = 'Mozilla/5.0 (Import Mobilheim Union)';

// Ordner in der Mediathek (anlegen, falls nötig); bei Problemen Upload ohne Ordner
async function ordner(app, name, parent = null) {
  try {
    const vorhanden = await app.db.query('plugin::upload.folder').findOne({ where: { name, parent } });
    if (vorhanden) return vorhanden.id;
    const neu = await app.plugin('upload').service('folder').create({ name, parent });
    return neu.id;
  } catch (err) {
    console.warn(`Ordner „${name}“ konnte nicht angelegt werden (${err.message}) – Upload ohne Ordner`);
    return null;
  }
}

// "Cahita Riviera", "Front", "Châtaigne" -> "cahita-riviera-front-chataigne"
const dateiname = (...teile) =>
  teile
    .filter(Boolean)
    .join('-')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

// liefert hochladen(src, name, folder, alt?) -> Datei-ID; jede URL wird nur einmal geladen
function uploader(app, tmp) {
  const cache = new Map();
  return function hochladen(src, name, folder, alternativeText = '') {
    if (!src) return Promise.resolve(null);
    if (cache.has(src)) return cache.get(src);
    const promise = (async () => {
      const vorhanden = await app.db.query('plugin::upload.file').findOne({ where: { caption: src } });
      if (vorhanden) return vorhanden.id;

      const res = await fetch(src, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`Download fehlgeschlagen (${res.status}): ${src}`);
      const typ = res.headers.get('content-type') || 'application/octet-stream';
      const ext = (path.extname(new URL(src).pathname) || '').toLowerCase();
      const datei = path.join(tmp, `${name}${ext}`);
      fs.writeFileSync(datei, Buffer.from(await res.arrayBuffer()));

      const [hochgeladen] = await app
        .plugin('upload')
        .service('upload')
        .upload({
          data: { fileInfo: { name: `${name}${ext}`, caption: src, alternativeText, folder } },
          files: { filepath: datei, originalFilename: `${name}${ext}`, mimetype: typ, size: fs.statSync(datei).size },
        });
      return hochgeladen.id;
    })();
    cache.set(src, promise);
    return promise;
  };
}

// Aufgaben begrenzt parallel ausführen
async function parallel(aufgaben, anzahl = 6) {
  const ergebnisse = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: anzahl }, async () => {
      while (i < aufgaben.length) {
        const n = i++;
        ergebnisse[n] = await aufgaben[n]();
      }
    })
  );
  return ergebnisse;
}

module.exports = { USER_AGENT, ordner, dateiname, uploader, parallel };
