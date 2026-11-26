'use strict';

/**
 * Konfigurator eines Mobilheims von der Herstellerseite (IRM / O'Hara) übernehmen.
 * Die Hersteller-Simulatoren bestehen aus einem Grundbild und transparenten PNG-Ebenen je Option.
 * Das Skript liest diese Struktur, lädt Ebenen + Farbmuster in die Mediathek
 * (Ordner "Konfigurator/<Modell>", Farbmuster in "Konfigurator/Farbmuster") und legt den
 * Eintrag "Konfigurator" für das Mobilheim an.
 *
 * Bitte nur mit Erlaubnis des Herstellers verwenden – die Bilder gehören IRM bzw. O'Hara.
 *
 * Aufruf:
 *   npm run import:konfigurator -- <Hersteller-URL> <Mobilheim-Slug>
 *   npm run import:konfigurator -- <URL> <Slug> --ersetzen   vorhandenen Konfigurator überschreiben
 *   npm run import:konfigurator -- <URL> --probe             nur anzeigen, was gefunden wird (schreibt nichts)
 *
 * Bereits hochgeladene Bilder werden wiederverwendet (erkannt an der Quell-URL im Feld "Bildunterschrift").
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { parseDocument, DomUtils } = require('htmlparser2');

const args = process.argv.slice(2);
const FLAGS = new Set(args.filter((a) => a.startsWith('--')));
const [URL_QUELLE, SLUG] = args.filter((a) => !a.startsWith('--'));
const PROBE = FLAGS.has('--probe');
const ERSETZEN = FLAGS.has('--ersetzen');

// Kategorien der Hersteller-Simulatoren -> deutsche Gruppennamen
const GRUPPEN = { 1: 'Polster', 2: '4 Seiten', 3: 'Front', 4: 'Vorhänge', 7: 'Rahmen', 8: 'Signature' };
// Simulator "ext-N": N = Dachform
const DAECHER = { 0: 'Flachdach', 1: 'Pultdach', 2: 'Satteldach' };

const klassen = (el) => (el.attribs?.class || '').split(/\s+/).filter(Boolean);
const text = (el) => DomUtils.textContent(el).replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- HTML auswerten
function auswerten(html) {
  const doc = parseDocument(html);
  const tags = DomUtils.findAll((el) => el.type === 'tag', doc.children);

  const sims = new Map(); // sim -> { grund: [{src,z}], optionen: Map(id -> {cat,src,z}) }
  const sim = (key) => {
    if (!sims.has(key)) sims.set(key, { grund: [], optionen: new Map() });
    return sims.get(key);
  };
  const buttons = new Map(); // `${sim}:${id}` -> { name, muster, ordnung }
  const dachReihenfolge = [];

  tags.forEach((el, z) => {
    const a = el.attribs || {};

    // Bild-Ebenen
    if (el.name === 'img' && a['data-sim-src']) {
      const k = klassen(el);
      const opt = k.map((c) => c.match(/^js-sim-(ext-\d+|int)-option-(\d+)$/)).find(Boolean);
      if (opt) {
        const cat = k.map((c) => c.match(/^js-sim-(?:ext-\d+|int)-option-cat-(\d+)$/)).find(Boolean);
        sim(opt[1]).optionen.set(opt[2], { cat: cat ? Number(cat[1]) : 0, src: a['data-sim-src'], z });
      } else {
        const base = k.map((c) => c.match(/^js-sim-(ext-\d+|int)$/)).find(Boolean);
        // Hersteller-CSS: background (1) < skeleton (2) < Optionen (3) < facade (4, Fenster/Türen)
        const rang = k.includes('background') ? 1 : k.includes('skeleton') ? 2 : k.includes('facade') ? 4 : 2;
        if (base) sim(base[1]).grund.push({ src: a['data-sim-src'], z, rang });
      }
    }

    // Auswahl-Buttons mit Farbmuster
    if (a['data-sim-option'] && a['data-simulator']) {
      const s = a['data-simulator'].replace(/^js-sim-/, '');
      const id = (a['data-sim-option'].match(/(\d+)$/) || [])[1];
      const key = `${s}:${id}`;
      if (id && !buttons.has(key)) {
        const nameEl = DomUtils.findOne((n) => klassen(n).includes('vignette-name'), el.children);
        const musterEl = DomUtils.findOne((n) => klassen(n).includes('vignette'), el.children);
        const style = musterEl?.attribs?.style || '';
        const muster =
          musterEl?.attribs?.['data-background'] || (style.match(/url\(['"]?([^'")]+)['"]?\)/) || [])[1] || null;
        // exclusive-info 0 (ohne Unterkategorie): Ebene zeigt das ganze Haus und ersetzt andere
        // solche Auswahlen (Front ↔ 4 Seiten); sonst gilt die Auswahl nur in der eigenen Kategorie
        const exklusiv =
          Number(a['data-exclusive-info'] ?? -1) === 0 && Number(a['data-exclusive-sub-cat-info'] ?? 0) === 0;
        buttons.set(key, { name: nameEl ? text(nameEl) : `Option ${id}`, muster, ordnung: z, exklusiv });
      }
    }

    // Dach-Auswahl (Reihenfolge = Standard zuerst)
    if (el.name === 'button' && /select ?Roof|onRoofSelect/i.test(a['data-action'] || '')) {
      const s = (a['data-simulator'] || '').replace(/^js-sim-/, '');
      if (s && !dachReihenfolge.includes(s)) dachReihenfolge.push(s);
    }
  });

  // Simulatoren in Anzeigereihenfolge: Dächer wie auf der Seite, dann übrige, Innen zuletzt
  const reihenfolge = [
    ...dachReihenfolge.filter((s) => sims.has(s)),
    ...[...sims.keys()].filter((s) => s.startsWith('ext-') && !dachReihenfolge.includes(s)),
    ...[...sims.keys()].filter((s) => s === 'int'),
  ];

  return reihenfolge.map((s) => {
    const { grund, optionen } = sims.get(s);
    const innen = s === 'int';
    const dach = innen ? null : DAECHER[Number(s.split('-')[1])] || null;

    // Optionen nach Gruppe; Gruppen in der Reihenfolge ihrer Buttons auf der Seite
    const gruppen = new Map();
    const opts = [...optionen.entries()]
      .map(([id, o]) => ({ id, ...o, ...(buttons.get(`${s}:${id}`) || {}) }))
      .filter((o) => o.name) // Ebene ohne Button = nicht auswählbar
      .sort((a, b) => (a.ordnung ?? 1e9) - (b.ordnung ?? 1e9));
    for (const o of opts) {
      if (!gruppen.has(o.cat)) gruppen.set(o.cat, []);
      gruppen.get(o.cat).push(o);
    }

    const sortiert = grund.sort((a, b) => a.rang - b.rang || a.z - b.z);

    return {
      sim: s,
      name: innen ? 'Innenraum' : dach || `Außen ${s}`,
      typ: innen ? 'Innen' : 'Aussen',
      dach,
      grund: sortiert.filter((g) => g.rang < 3).map((g) => g.src),
      deck: sortiert.filter((g) => g.rang > 3).map((g) => g.src),
      gruppen: [...gruppen.entries()].map(([cat, liste]) => {
        // Hersteller benennen verschiedene Muster teils gleich (z. B. zweimal „Châtaigne“,
        // glatt und in Holzoptik) – ab dem zweiten Vorkommen eindeutig machen
        const gesehen = new Map();
        return {
          schluessel: String(cat),
          name: GRUPPEN[cat] || `Auswahl ${cat}`,
          exklusiv: liste.some((o) => o.exklusiv),
          optionen: liste.map((o) => {
            const n = (gesehen.get(o.name) || 0) + 1;
            gesehen.set(o.name, n);
            const name = n > 1 ? `${o.name} (Variante ${n})` : o.name;
            return { name, muster: o.muster, src: o.src, ebene: o.z };
          }),
        };
      }),
    };
  });
}

function ausgeben(ansichten) {
  for (const a of ansichten) {
    console.log(`\n${a.typ} – ${a.name} (${a.sim}): ${a.grund.length} Grund-, ${a.deck.length} Deckebene(n)`);
    for (const g of a.gruppen) {
      const ex = g.exklusiv ? ' (exklusiv)' : '';
      console.log(`  ${g.name} [${g.schluessel}]${ex}: ${g.optionen.map((o) => o.name).join(', ')}`);
    }
  }
  const urls = new Set(
    ansichten.flatMap((a) => [
      ...a.grund,
      ...a.deck,
      ...a.gruppen.flatMap((g) => g.optionen.flatMap((o) => [o.src, o.muster])),
    ])
  );
  urls.delete(null);
  console.log(`\n${urls.size} verschiedene Bilddateien`);
}

// ---------------------------------------------------------------- Mediathek
const { ordner, dateiname, uploader, parallel, USER_AGENT } = require('./lib/medien');

// ---------------------------------------------------------------- Ablauf
(async () => {
  if (!URL_QUELLE || (!SLUG && !PROBE)) {
    console.log('Aufruf: npm run import:konfigurator -- <Hersteller-URL> <Mobilheim-Slug> [--ersetzen | --probe]');
    process.exit(1);
  }

  const res = await fetch(URL_QUELLE, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Seite nicht erreichbar (${res.status})`);
  const ansichten = auswerten(await res.text());
  if (!ansichten.length) {
    console.log('Auf der Seite wurde kein Konfigurator gefunden.');
    process.exit(1);
  }
  ausgeben(ansichten);
  if (PROBE) process.exit(0);

  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();

  const mh = await app.documents('api::mobilheim.mobilheim').findFirst({ filters: { slug: SLUG }, status: 'draft' });
  if (!mh) {
    console.log(`Kein Mobilheim mit dem Slug „${SLUG}“ gefunden.`);
    process.exit(1);
  }
  const docs = app.documents('api::konfigurator.konfigurator');
  const vorhanden = await docs.findFirst({ filters: { mobilheim: { documentId: mh.documentId } }, status: 'draft' });
  if (vorhanden && !ERSETZEN) {
    console.log(`übersprungen: „${mh.Name}“ hat schon einen Konfigurator – mit --ersetzen überschreiben`);
    process.exit(0);
  }

  console.log(`\nLade Bilder für „${mh.Name}“ …`);
  const wurzel = await ordner(app, 'Konfigurator');
  const modellOrdner = await ordner(app, mh.Name || SLUG, wurzel);
  const musterOrdner = await ordner(app, 'Farbmuster', wurzel);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'konfigurator-'));
  const hochladen = uploader(app, tmp);

  // alle Uploads sammeln und begrenzt parallel ausführen
  const aufgaben = [];
  const ids = new Map();
  const merken = (src, name, folder) => {
    if (!src || ids.has(src)) return;
    ids.set(src, null);
    aufgaben.push(async () => ids.set(src, await hochladen(src, name, folder)));
  };
  for (const a of ansichten) {
    a.grund.forEach((src, i) => merken(src, dateiname(SLUG, a.name, 'grund', i + 1), modellOrdner));
    a.deck.forEach((src, i) => merken(src, dateiname(SLUG, a.name, 'deck', i + 1), modellOrdner));
    for (const g of a.gruppen) {
      for (const o of g.optionen) {
        merken(o.src, dateiname(SLUG, a.name, g.name, o.name), modellOrdner);
        merken(o.muster, dateiname('muster', g.name, o.name), musterOrdner);
      }
    }
  }
  let fertig = 0;
  await parallel(
    aufgaben.map((fn) => async () => {
      await fn();
      if (++fertig % 10 === 0 || fertig === aufgaben.length) console.log(`  ${fertig}/${aufgaben.length}`);
    })
  );
  fs.rmSync(tmp, { recursive: true, force: true });

  const data = {
    titel: mh.Name || SLUG,
    quelle: URL_QUELLE,
    mobilheim: { connect: [{ documentId: mh.documentId }] },
    ansichten: ansichten.map((a) => ({
      name: a.name,
      typ: a.typ,
      dach: a.dach,
      grundebenen: a.grund.map((src) => ids.get(src)).filter(Boolean),
      deckebenen: a.deck.map((src) => ids.get(src)).filter(Boolean),
      gruppen: a.gruppen.map((g) => ({
        name: g.name,
        schluessel: g.schluessel,
        exklusiv: g.exklusiv,
        optionen: g.optionen.map((o) => ({
          name: o.name,
          farbmuster: ids.get(o.muster) || null,
          bild: ids.get(o.src) || null,
          ebene: o.ebene,
        })),
      })),
    })),
  };

  if (vorhanden) {
    await docs.update({ documentId: vorhanden.documentId, data });
    await docs.publish({ documentId: vorhanden.documentId });
  } else {
    await docs.create({ data, status: 'published' });
  }
  console.log(`\nKonfigurator für „${mh.Name}“ ${vorhanden ? 'ersetzt' : 'angelegt'} und veröffentlicht.`);

  // Kein app.destroy() (sonst harmlose "aborted"-Meldung von knex)
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
