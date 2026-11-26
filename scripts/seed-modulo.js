'use strict';

/**
 * Modellreihe "Modul'O" (IRM Sanitärmodule) mit Modul'O und Modul'O² anlegen.
 * Quellen: mobil-home.com/en/professional/sanitary/ (Übersicht, 720-modul1, 721-modul2) und die
 * Produktdatenblätter (PDF), ins Deutsche übertragen. Bilder/PDFs werden von IRM übernommen –
 * bitte nur mit Erlaubnis des Herstellers verwenden.
 *
 * Aufruf: npm run seed:modulo   (legt nur Fehlendes an, vorhandene Einträge bleiben unberührt)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const { ordner, dateiname, uploader, parallel } = require('./lib/medien');

const MEDIA = 'https://app.biohabitat-loisirs.com/static/media/default/';
const QUELLE = 'https://www.mobil-home.com/en/professional/sanitary/';

const txt = (t) => ({ type: 'text', text: t });
const p = (t) => ({ type: 'paragraph', children: [txt(t)] });
const h = (t) => ({ type: 'heading', level: 3, children: [txt(t)] });
const liste = (punkte) => ({
  type: 'list',
  format: 'unordered',
  children: punkte.map((t) => ({ type: 'list-item', children: [txt(t)] })),
});

const REIHE = {
  name: "Modul'O",
  slug: 'modul-o',
  badge: 'Sanitärmodul',
  kurzbeschreibung:
    'Private Sanitärmodule für Stellplätze: eigenes Bad mit Dusche, WC und überdachtem Waschplatz – direkt am Platz, mobil und schnell aufgestellt.',
  bild: `${MEDIA}HD/c09296f6351e4841c6e88028a25e9ea3.jpg`,
  beschreibung: [
    p(
      'Die Ansprüche von Urlaubern ändern sich: Sie suchen das ursprüngliche Camping-Erlebnis, ohne auf Komfort zu verzichten. Mit Modul’O und Modul’O² bringt IRM private Sanitärmodule, die direkt auf freien Stellplätzen aufgestellt werden. Ihre Gäste genießen volle Privatsphäre – der Weg zum Gemeinschafts-Sanitärgebäude entfällt.'
    ),
    h('Zwei Varianten für Ihren Platz'),
    liste([
      'Modul’O (Einzelmodul): eine völlig eigenständige Sanitärzelle – leicht zu versetzen und ideal, um einzelne Stellplätze auszustatten.',
      'Modul’O² (Doppelmodul): zwei vollständig getrennte Sanitärbereiche auf einem Chassis – die platzsparende Lösung für zwei benachbarte Stellplätze.',
    ]),
    h('Komfort wie in einer Unterkunft'),
    liste([
      'Großzügige Dusche 100 × 80 cm',
      'Separates WC',
      'Waschplatz im überdachten Außenbereich – ideal auch zum Spülen',
      'Gut zugänglicher Elektro-Warmwasserbereiter (beim Modul’O² zwei, je einer pro Bad)',
    ]),
    h('Mehr Wert für Ihren Campingplatz'),
    liste([
      'Aufwertung: Aus einfachen Stellplätzen werden Premium-Angebote mit höheren Übernachtungspreisen.',
      'Zufriedene Gäste: Hygiene, Privatsphäre und Zeitersparnis – genau das, was Gäste heute erwarten.',
      'Neue Zielgruppe: Gäste mit höherer Kaufkraft, die echtes Camping mit modernem Komfort verbinden möchten.',
    ]),
    h('Schnell aufgestellt'),
    p(
      'Dank mobilem Chassis sind die Module in kürzester Zeit aufgestellt – ohne aufwendige Umbauten oder Mauerarbeiten am Stellplatz. Die schlichte Außenoptik in natürlichen Tönen fügt sich harmonisch in jede Umgebung ein.'
    ),
  ],
};

// gemeinsame Ausstattung laut Datenblatt
const AUSSTATTUNG = [
  'Ideales Glamping-Design – fügt sich harmonisch in freie Stellplätze ein',
  'Komfort und Privatsphäre eines eigenen Bads',
  'Einfach aufzustellen und zu versetzen',
  'Duschwanne 100 × 80 cm mit Glastür, höhenverstellbarer Duschstange und extra flacher Schwelle',
  'Keramik-WC mit Papierhalter und Ablage',
  'Überdachter Waschplatz: Edelstahlbecken, Armatur mit Durchflussbegrenzer (7 l/min), Spiegel, Wandleuchte, Außensteckdosen',
  'Konstruktion: verzinktes Chassis mit Deichsel, Satteldach, Außenverkleidung aus schwarzem Fichtenholz, Dachdämmung 100 mm',
  'Pflegeleichter Lattenboden aus Verbundwerkstoff, LED-Beleuchtung',
  'Geprüft nach EN 1647 (Bureau Veritas)',
  'Optional: Heizlüfter mit integriertem Handtuchhalter',
];

const MODELLE = [
  {
    Name: "Modul'O",
    slug: 'modul-o',
    quelle: `${QUELLE}720-modul1/`,
    description:
      'Privates Bad für einen freien Stellplatz: Dusche, WC und überdachter Waschplatz in einem kompakten, mobilen Modul.',
    length: 2.5,
    width: 2.5,
    area: 6.2,
    baths: 1,
    hauptbild: `${MEDIA}HD/c09296f6351e4841c6e88028a25e9ea3.jpg`,
    grundriss: `${MEDIA}HD/b5d30f4c0f7ec945aab4a00958a83977.png`,
    galerie: ['9c73e8521e4c5ee1cbea46951892d957', '838529e900ea11656b0b77e2bed8c222', 'e86279d48567b31599d1aa14e2aabfe3'],
    datenblatt: `${MEDIA}3a30bada17dc2ff74f1bbaccf7e91f15.pdf`,
    highlights: [
      'Geschlossener Innenraum 2,99 m², überdachter Bereich 1,81 m²',
      ...AUSSTATTUNG.slice(0, 5),
      'Abschließbarer Technikraum mit 50-Liter-Elektroboiler und Sicherungskasten',
      ...AUSSTATTUNG.slice(5),
    ],
  },
  {
    Name: "Modul'O²",
    slug: 'modul-o2',
    quelle: `${QUELLE}721-modul2/`,
    description:
      'Doppeltes Sanitärmodul für zwei benachbarte Stellplätze: zwei vollständig getrennte Bäder auf einem Chassis.',
    length: 3.6,
    width: 3,
    area: 10.8,
    baths: 2,
    hauptbild: `${MEDIA}HD/6376f0b20ac9911051e0bce5d64a0812.jpg`,
    grundriss: `${MEDIA}HD/e6fa617fab9f35601e0600da40dd645f.png`,
    galerie: [
      '47778f6173b791c4725147c74aa2967f', '73eb782b87be0142efabc037f48ab267', '49353b7bc8800e0bab401de4cd5cf6b7',
      '787a3328c692e929bb3fdcd64fb87f40', 'aa39a31f5474fe4088b262c3db3462ab', 'be61d35087ea90bea5713b143e2aa116',
      '7d9d127f972b0bef15d876f5a156be66', '0b635d757ea50d178f122ced26b0ad2d', 'd4da231463dabd725a712b095d54d660',
      '6ed94b3d560a6a39ebdfdfe143fdd523', 'f73a84cdd4a1768a0982be3f3992bfd7', '5455210744cac21c0610f80aba1014e1',
      '8fb9cb7d3799109fb560e91c9c453483', '7ba9a1e439d8bf25ef9b5f75b5d31bf6', '336ce1ad346db47649d75f5101dda9e2',
      '1fd1a7010be00fc64c71f7e32b0212a4', 'b01bf58f942b1d34a6413b9efa0322e8', '0b4ea8e97e16b31b72b9825842f744b2',
    ],
    datenblatt: `${MEDIA}b639050e08d524fd59934442d8a40974.pdf`,
    highlights: [
      'Zwei getrennte Bäder für zwei benachbarte Stellplätze',
      'Geschlossener Innenraum 5,22 m², überdachter Bereich 3,35 m²',
      ...AUSSTATTUNG.slice(0, 5),
      'Abschließbarer Technikraum mit zwei 50-Liter-Elektroboilern und Sicherungskasten',
      'Für den Transport in Dreiergruppen kombinierbar',
      ...AUSSTATTUNG.slice(5),
    ],
  },
];

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const irm = await app.documents('api::hersteller.hersteller').findFirst({ filters: { slug: 'irm' } });
  if (!irm) throw new Error('Hersteller „irm“ nicht gefunden');

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'modulo-'));
  const hochladen = uploader(app, tmp);
  const wurzel = await ordner(app, "Modul'O");

  // --- Modellreihe
  const reihen = app.documents('api::modellreihe.modellreihe');
  let reihe = await reihen.findFirst({ filters: { slug: REIHE.slug }, status: 'draft' });
  if (reihe) {
    console.log(`übersprungen: Modellreihe „${REIHE.name}“ existiert bereits`);
  } else {
    const bild = await hochladen(REIHE.bild, dateiname('modul-o', 'reihe'), wurzel, "Modul'O Sanitärmodul am Stellplatz");
    reihe = await reihen.create({
      status: 'published',
      data: {
        name: REIHE.name,
        slug: REIHE.slug,
        badge: REIHE.badge,
        kurzbeschreibung: REIHE.kurzbeschreibung,
        beschreibung: REIHE.beschreibung,
        bild,
        hersteller: { connect: [{ documentId: irm.documentId }] },
      },
    });
    console.log(`angelegt: Modellreihe „${REIHE.name}“`);
  }

  // --- Modelle
  const docs = app.documents('api::mobilheim.mobilheim');
  for (const m of MODELLE) {
    if (await docs.findFirst({ filters: { slug: m.slug }, status: 'draft' })) {
      console.log(`übersprungen: „${m.Name}“ existiert bereits`);
      continue;
    }
    console.log(`lade Bilder für „${m.Name}“ …`);
    const mOrdner = await ordner(app, m.Name, wurzel);
    const [hauptbild, grundriss, pdf, ...galerie] = await parallel([
      () => hochladen(m.hauptbild, dateiname(m.slug, 'hauptbild'), mOrdner, `${m.Name} am Stellplatz`),
      () => hochladen(m.grundriss, dateiname(m.slug, 'grundriss'), mOrdner, `Grundriss ${m.Name}`),
      () => hochladen(m.datenblatt, dateiname(m.slug, 'datenblatt'), mOrdner),
      ...m.galerie.map((id, i) => () =>
        hochladen(`${MEDIA}HD/${id}.jpg`, dateiname(m.slug, 'galerie', i + 1), mOrdner, `${m.Name} – Bild ${i + 1}`)
      ),
    ]);

    await docs.create({
      status: 'published',
      data: {
        Name: m.Name,
        slug: m.slug,
        art: 'Sanitaermodul',
        description: m.description,
        length: m.length,
        width: m.width,
        area: m.area,
        baths: m.baths,
        mainImg: hauptbild,
        layout: grundriss,
        gallery: galerie,
        highlights: m.highlights.map((text) => ({ __component: 'mobilheime.highlight', text })),
        buttons: [{ __component: 'mobilheime.datenblatt', datasheet: pdf }],
        hersteller: { connect: [{ documentId: irm.documentId }] },
        modellreihes: { connect: [{ documentId: reihe.documentId }] },
      },
    });
    console.log(`angelegt: „${m.Name}“ (${galerie.length} Galeriebilder)`);
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  // Kein app.destroy() (sonst harmlose "aborted"-Meldung von knex)
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
