'use strict';

/**
 * Legt die Service-Seiten (Collection "Service") mit Startinhalten an.
 * Inhalte sinngemäß von der alten Website übernommen – bitte im Admin prüfen.
 *
 * Aufruf:  npm run seed:services
 * Bereits vorhandene Slugs werden übersprungen, das Skript kann also gefahrlos
 * mehrfach (auch auf dem Live-Server) laufen.
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

// --- kleine Helfer für Strapi "Blocks"-Rich-Text --------------------------------
const text = (t) => ({ type: 'text', text: t });
const p = (t) => ({ type: 'paragraph', children: [text(t)] });
const h = (t, level = 2) => ({ type: 'heading', level, children: [text(t)] });
const list = (items, format = 'unordered') => ({
  type: 'list',
  format,
  children: items.map((t) => ({ type: 'list-item', children: [text(t)] })),
});

const textblock = (...blocks) => ({ __component: 'design.beschreibung', beschreibung: blocks });
const button = (label, url, beschreibung) => ({
  __component: 'shared.link-button',
  label,
  url,
  beschreibung,
});
const kontakt = (data) => ({ __component: 'shared.kontaktperson', ...data });

// --- Inhalte --------------------------------------------------------------------
const SERVICES = [
  {
    titel: 'Gebrauchte Mobilheime',
    slug: 'gebrauchte-mobilheime',
    icon: 'recycle',
    reihenfolge: 1,
    kurzbeschreibung:
      'Kauf und Verkauf gebrauchter Mobilheime – kostenlos über das europaweit professionelle Netzwerk.',
    inhalt: [
      textblock(
        h('Kauf und Verkauf von gebrauchten Mobilheimen'),
        p(
          'Sie suchen ein gebrauchtes Mobilheim oder möchten Ihre bestehenden Mobilheime verkaufen? ' +
            'Unser kostenloser Service bringt Käufer und Verkäufer zusammen – schnell, unkompliziert und mit großer Reichweite.',
        ),
        p('Nutzen Sie das europäisch professionellste Netzwerk für gebrauchte Mobilheime.'),
        p('Neu: Lassen Sie den Wiederverkaufswert Ihres Mobilheims ganz einfach online schätzen.'),
      ),
      button(
        'Gebrauchte Mobilheime ansehen',
        'https://www.mobilhomedoccasion.com',
        'Aktuelle Angebote und Online-Wertschätzung auf mobilhomedoccasion.com',
      ),
      button(
        'Anfrage stellen',
        '/kontakt?anliegen=gebrauchte',
        'Sie möchten kaufen oder verkaufen? Wir melden uns bei Ihnen.',
      ),
      kontakt({
        name: 'Anthony Chiron',
        rolle: 'Gebrauchtmarkt · Mobil: +33 (0)6 07 71 46 86',
        email: 'info@mobilhomedoccasion.com',
        telefon: '+33 (0)2 51 26 20 23',
      }),
    ],
  },
  {
    titel: 'Besichtigung',
    slug: 'besichtigung',
    icon: 'eye',
    reihenfolge: 2,
    kurzbeschreibung:
      'Mobilheime live erleben – im Werk, bei Geschäftskunden in Ihrer Nähe oder auf Messen.',
    inhalt: [
      textblock(
        h('Werksbesichtigung'),
        p(
          'Für ausführliche Produktinformationen bieten wir regelmäßig Führungen in einem unserer sieben ' +
            'Produktionswerke an – inklusive Besichtigung aller dort gefertigten Modelle. Unterkunft und ' +
            'Verpflegung organisieren wir für Sie, lediglich die Anreise tragen Sie selbst.',
        ),
        h('So können Sie unsere Mobilheime besichtigen'),
        list(
          [
            'Bei einem Geschäftskunden in Ihrer Nähe – sprechen Sie uns an, wir stellen den Kontakt her.',
            'Auf Messen, z. B. dem Salon Atlantica (Frankreich) oder der Recreatie Vakbeurs (Niederlande).',
            'In der Hauptausstellung in Givrand (Frankreich) direkt am Hauptwerk. Direktflüge nach Nantes gibt es von vielen Flughäfen, von dort sind es knapp eine Stunde mit dem Mietwagen. Gern schlagen Sie uns einen Wunschtermin vor.',
          ],
          'ordered',
        ),
        p('Bitte beachten Sie: An unserem eigenen Standort bieten wir keine Ausstellung an.'),
      ),
      button('Besichtigung anfragen', '/kontakt?anliegen=besichtigung', 'Wir organisieren Ihren Termin.'),
      button('Messetermine', '/messen', 'Alle kommenden Messen im Überblick'),
    ],
  },
  {
    titel: 'Camping 4.0',
    slug: 'camping-4-0',
    icon: 'campground',
    reihenfolge: 3,
    externerLink: 'https://www.mobilhome-biohabitat.com/en/camping',
    kurzbeschreibung:
      'Die Camping-Welt von BIO-Habitat – der Gruppe hinter IRM, O’Hara und Coco Sweet.',
    inhalt: [],
  },
  {
    titel: 'After-Sales',
    slug: 'after-sales',
    icon: 'screwdriver-wrench',
    reihenfolge: 4,
    kurzbeschreibung:
      'Ersatzteile, Renovierung und Schulungen – damit Ihre Mobilheime lange rentabel bleiben.',
    inhalt: [
      textblock(
        h('Ersatzteile für Ihr Mobilheim'),
        p('Über 2.000 Ersatzteile – ganz einfach über Chassis-Nummer und Teiletyp zu finden.'),
        list([
          'Zugang rund um die Uhr (24/7)',
          'Hohe Verfügbarkeit der Ersatzteile',
          'Schnelle Bearbeitung Ihrer Anfragen',
          'Bestellhistorie und Sendungsverfolgung',
        ]),
        h('Renovierungsservice'),
        p(
          'Vorhänge, Polster, Duschwannen, Armaturen und vieles mehr lassen sich schrittweise oder auf einmal ' +
            'austauschen. Unsere Techniker beraten Sie, welche Maßnahmen sinnvoll sind – so verlängern Sie die ' +
            'Lebensdauer Ihrer Mobilheime und sichern ihren Wiederverkaufswert.',
        ),
        h('Schulungsprogramm'),
        p(
          'Mobil Home Services schult jedes Jahr die Teams auf den Plätzen – fast 150 Techniker pro Jahr. ' +
            'So werden kleinere Arbeiten effizienter erledigt und das Sicherheitsbewusstsein gestärkt.',
        ),
      ),
      button('Zum Ersatzteilshop', 'https://www.mobilhome-sav.com', 'Ersatzteile online finden und bestellen'),
      button('After-Sales anfragen', '/kontakt?anliegen=after-sales', 'Fragen zu Ersatzteilen oder Renovierung'),
      kontakt({
        name: 'Mobil Home Services',
        rolle: 'After-Sales & Ersatzteile',
        telefon: '+33 (0)2 28 14 03 33',
      }),
    ],
  },
  {
    titel: 'Bilddatenbanken',
    slug: 'bilddatenbanken',
    icon: 'images',
    reihenfolge: 5,
    kurzbeschreibung:
      'HD-Bilder, Grundrisse, Videos, 360°-Touren und Datenblätter für Ihre Website und Vermarktung.',
    inhalt: [
      textblock(
        p(
          'Für Ihre Mieter, Urlaubsgäste oder Ihre eigene Website stellen unsere Hersteller umfangreiches ' +
            'Material zum Download bereit: HD-Bilder, Pläne, Videos und 360°-Touren, Datenblätter usw.',
        ),
      ),
      button('IRM Mediathek', 'https://media.mobil-home.com/', 'HD-Bilder, Pläne, Videos, 360°-Touren und Datenblätter'),
      button(
        'O’Hara Mediathek',
        'https://media.mobilhome-ohara.com/',
        'Produktfotos, Grundrisse und Datenblätter – vorbehalten für Geschäftskunden',
      ),
      button('Coco Sweet Mediathek', 'https://media.mobilhome-coco.com/', 'Fotos und Videos der Coco-Modelle'),
    ],
  },
];

// --- Ausführung -----------------------------------------------------------------
(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents('api::leistung.leistung');

  for (const service of SERVICES) {
    const vorhanden = await docs.findFirst({ filters: { slug: service.slug }, status: 'draft' });
    if (vorhanden) {
      console.log(`übersprungen (existiert bereits): ${service.slug}`);
      continue;
    }
    await docs.create({ data: service, status: 'published' });
    console.log(`angelegt: ${service.slug}`);
  }

  // Alle Schreibvorgänge sind abgeschlossen. Kein app.destroy(): knex bricht dabei offene
  // Pool-Anfragen mit einer (harmlosen, aber verwirrenden) "aborted"-Meldung ab.
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
