'use strict';

/**
 * Terrassen-Bereiche (Collection "Terrassen") nach dem Katalog 2027
 * (Terrasses bois, abris de jardin & accessoires), ins Deutsche übertragen.
 * Bilder werden NICHT importiert – bitte im Admin zu den Produkten hochladen.
 *
 * Aufruf:
 *   npm run seed:terrassen                 legt nur fehlende Bereiche an
 *   npm run seed:terrassen -- --ersetzen   ersetzt vorhandene Bereiche und entfernt veraltete –
 *                                          aber nur, wenn sie seit dem Import nicht bearbeitet wurden
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const ERSETZEN = process.argv.includes('--ersetzen');

// Bereiche aus dem alten Katalog, die es nicht mehr gibt
const VERALTET = ['terrassen-podien', 'optionen-eigenschaften'];

// --- Helfer für Blocks & Komponenten --------------------------------------------
const text = (t) => ({ type: 'text', text: t });
const p = (t) => ({ type: 'paragraph', children: [text(t)] });
const h = (t, level = 2) => ({ type: 'heading', level, children: [text(t)] });
const list = (items) => ({
  type: 'list',
  format: 'unordered',
  children: items.map((t) => ({ type: 'list-item', children: [text(t)] })),
});

const textblock = (...blocks) => ({ __component: 'design.beschreibung', beschreibung: blocks });
const produkt = (name, untertitel, beschreibung = [], merkmale = []) => ({
  __component: 'terrassen.produkt',
  name,
  untertitel,
  beschreibung,
  merkmale: merkmale.map((t) => ({ text: t })),
});
const tabelle = (titel, kopfzeile, zeilen, hinweis) => ({
  __component: 'terrassen.tabelle',
  titel,
  kopfzeile,
  zeilen: zeilen.join('\n'),
  hinweis,
});
const detail = (titel, beschreibung) => ({ __component: 'design.details', titel, beschreibung });
const button = (label, url, beschreibung) => ({
  __component: 'shared.link-button',
  label,
  url,
  beschreibung,
});

// Geländer-Auswahl: die Slugs werden beim Import in Einträge der Collection "Geländer" aufgelöst
const gelaender = (slugs, titel = 'Unsere Geländer') => ({
  __component: 'terrassen.gelaender-auswahl',
  titel,
  gelaender: slugs,
});

// Collection "Geländer" – jedes Modell nur einmal
const GELAENDER = [
  { slug: 'casa', name: 'Casa', beschreibung: 'Mit Stäben', reihenfolge: 1 },
  { slug: 'pyla', name: 'Pyla', beschreibung: 'Schwarzes Netz', reihenfolge: 2 },
  { slug: 'bella', name: 'Bella', beschreibung: '2 Alu-Rohre', reihenfolge: 3 },
  { slug: 'euca', name: 'Euca', beschreibung: 'Eukalyptusstäbe', neu: true, reihenfolge: 4 },
  { slug: 'ola', name: 'Ola', beschreibung: 'Unstrukturierte Optik', neu: true, reihenfolge: 5 },
  { slug: 'sahara', name: 'Sahara', beschreibung: 'Schräge Latten und Alu-Rohr', reihenfolge: 6 },
];

const M2 = 'Alle Planen schwer entflammbar (Brandschutzklasse M2)';

// --- Inhalte (Katalog 2027) -------------------------------------------------------
const BEREICHE = [
  // ---------------------------------------------------------------- Hauptstrukturen
  {
    titel: 'Terrassen Excellence',
    slug: 'excellence',
    thema: 'Terrassen',
    icon: 'star',
    reihenfolge: 1,
    kurzbeschreibung:
      'Überdachte All-inclusive-Podiumterrassen in braunem Holz – mit Pergola-Option und der neuen SUNNEW-Plane.',
    inhalt: [
      textblock(
        p(
          'Die Premium-Linie ist bereits in der Grundausstattung komplett: Podiumterrasse in braunem Holz mit Überdachung SUNNY, Sichtschutz auf der überdachten Seite und Unterkonstruktion.',
        ),
        h('Serienausstattung', 3),
        list([
          'Holz braun',
          'Längen 5.50 | 7.00 | 8.50 m',
          '4 Tiefen: 2.60 m oder 2.60/3.60 m (Ébène), 3.00 m oder 3.00/4.00 m (Terra)',
          '3 Geländer zur Auswahl',
          'Treppe 2 Stufen L 250 cm',
          'Pfosten 95 x 68 mm mit flachem Kopf',
          'Sichtschutz auf der überdachten Seite',
          'Unterkonstruktion auf 4 Latten in der Höhe',
        ]),
        h('Optionen', 3),
        list([
          'Treppe 3 Stufen',
          'Unterkonstruktion für das Mobilheim',
          'Pfostenkappen',
          'Sonnenschutz-Pergola mit Dach EUCA oder Holz braun',
        ]),
        h('Überdachung', 3),
        list([
          'Dach SUNNY, Länge 3.50 | 5.00 | 6.50 m',
          'Plane in PVC oder SUNNEW (neu 2027: Plane in gewebter Optik)',
          'Planenfarbe nach Wahl',
          M2,
        ]),
      ),
      produkt('ÉBÈNE', 'Podium überdacht · Tiefe 2.60 m oder 2.60/3.60 m'),
      produkt('TERRA', 'Podium überdacht · Tiefe 3.00 m oder 3.00/4.00 m', [
        p('TERRA Euca 7.00 x 3.00/4.00 m, überdacht mit Dach SUNNY 5.00 m und Option Sonnenschutz-Pergola mit Dach EUCA.'),
        p('TERRA Pyla 7.00 x 3.00/4.00 m, überdacht mit Dach SUNNY 5.00 m und Option Sonnenschutz-Pergola in braunem Holz (Sparren 35 x 68 mm).'),
      ]),
      produkt('Sichtschutz', 'Eukalyptus oder horizontale Latten'),
      gelaender(['pyla', 'euca', 'ola']),
    ],
  },
  {
    titel: 'Terrassen Classique',
    slug: 'classique',
    thema: 'Terrassen',
    icon: 'layer-group',
    reihenfolge: 2,
    kurzbeschreibung:
      'Die Klassiker in grünem oder braunem Holz: überdacht mit Dach STANDARD oder SUNNY, als Podium oder offen.',
    inhalt: [
      tabelle(
        'Modelle im Überblick',
        'Modell | Ausführung | Tiefe | Längen',
        [
          'SELECT | überdacht (Dach STANDARD oder SUNNY) | 2.60 m | 3.00 – 9.00 m',
          'PRESTIGE | überdacht (Dach STANDARD oder SUNNY) | 3.00 m | 3.00 – 9.00 m',
          'MOEA | Podium überdacht | 3.10 m | 4.50 – 7.50 m',
          'FIDJI | Podium überdacht | 3.45 m | 4.50 – 7.50 m',
          'ALLURE | nicht überdacht | 2.60 m | 3.00 – 9.00 m',
          'ELITE | nicht überdacht | 3.00 m | 3.00 – 9.00 m',
        ],
        'Alle Modelle in grünem oder braunem Holz erhältlich.',
      ),
      textblock(
        h('Überdachte Terrassen'),
        h('Serienausstattung', 3),
        list([
          'Längen 3.00 | 4.50 | 6.00 | 7.50 | 9.00 m',
          '5 Geländer zur Auswahl',
          'Treppe 2 Stufen L 128.5 cm, an Front oder Seite positionierbar',
          'Pfosten 95 x 68 mm mit flachem Kopf',
        ]),
        h('Optionen', 3),
        list([
          'Treppe 3 Stufen',
          'Unterkonstruktion für Terrasse und Mobilheim',
          'Tor 1- oder 2-flügelig oder Schiebetor (je nach Modell)',
          'Pfostenkappen',
        ]),
        h('Überdachung', 3),
        list([
          'Dach STANDARD (mit geraden Seitenblenden)',
          'Dach SUNNY in PVC oder SUNNEW',
          'Planenfarbe nach Wahl',
          M2,
        ]),
        p(
          'Neu 2027 – SUNNEW: PVC-Schattenplane in gewebter Textiloptik. Sie schützt vollständig vor Regen und wirkt dabei elegant und warm.',
        ),
      ),
      produkt('SELECT', 'Überdacht · Tiefe 2.60 m · Dach STANDARD oder SUNNY', [
        p('SELECT Ola, Holz grün, 6.00 x 2.60 m, überdacht 4.50 m, mit Option Unterkonstruktion und Treppen-Handläufen.'),
        p('SELECT Casa, Holz grün, 6.00 x 2.60 m, überdacht 6.00 m, mit Option Unterkonstruktion.'),
      ]),
      produkt('PRESTIGE', 'Überdacht · Tiefe 3.00 m · Dach STANDARD oder SUNNY', [
        p('PRESTIGE Euca, Holz braun, 7.50 x 3.00 m, überdacht 4.50 m, mit Option Unterkonstruktion und Treppe 3 Stufen.'),
        p('PRESTIGE Ola, Holz braun, 6.00 x 3.00 m, überdacht 3.50 m mit Plane SUNNEW.'),
        p('PRESTIGE Pyla, Holz grün, 6.00 x 3.00 m, überdacht 3.50 m, mit Sichtschutz aus horizontalen Latten und 2-flügeligem Tor.'),
        p('PRESTIGE Casa, Holz braun, 6.00 x 3.00 m, überdacht 5.00 m, mit Treppe 3 Stufen.'),
      ]),
      textblock(h('Überdachte Podiumterrassen')),
      produkt(
        'MOEA',
        'Podium überdacht · Tiefe 3.10 m',
        [
          p('MOEA Ola 6.00 x 2.60 m, überdacht mit Dach STANDARD 6.00 m, Treppe über die ganze Länge.'),
          p('MOEA Euca 6.00 x 2.60 m, überdacht mit Dach STANDARD 3.00 m, Treppe seitlich (neu 2027).'),
        ],
        ['Längen 4.50 | 6.00 | 7.50 m', '5 Geländer zur Auswahl', 'Podiumtreppe 2 Stufen', 'Dach STANDARD oder SUNNY'],
      ),
      produkt(
        'FIDJI',
        'Podium überdacht · Tiefe 3.45 m',
        [p('FIDJI Pyla 6.00 x 3.45 m, überdacht mit Dach SUNNY 3.50 m, mit Unterkonstruktion und Sichtschutz aus horizontalen Latten.')],
        ['Längen 4.50 | 6.00 | 7.50 m', '5 Geländer zur Auswahl', 'Podiumtreppe 2 Stufen', 'Dach STANDARD oder SUNNY'],
      ),
      textblock(
        h('Nicht überdachte Terrassen'),
        p(
          'Optionen: Treppe 3 Stufen, Unterkonstruktion für Terrasse und Mobilheim, Tor 1- oder 2-flügelig oder Schiebetor, Überdachungs-Kit, Pfostenkappen und Handläufe.',
        ),
      ),
      produkt(
        'ALLURE',
        'Nicht überdacht · Tiefe 2.60 m',
        [p('ALLURE Casa 4.50 x 2.60 m mit Handläufen, Pfostenkappen und Unterkonstruktion.')],
        ['Längen 3.00 – 9.00 m', '5 Geländer zur Auswahl', 'Treppe 2 Stufen L 128.5 cm, an Front oder Seite'],
      ),
      produkt(
        'ELITE',
        'Nicht überdacht · Tiefe 3.00 m',
        [p('ELITE Ola 6.00 x 3.00 m mit Unterkonstruktion.')],
        ['Längen 3.00 – 9.00 m', '5 Geländer zur Auswahl', 'Treppe 2 Stufen L 128.5 cm, an Front oder Seite'],
      ),
      gelaender(['casa', 'pyla', 'bella', 'euca', 'ola']),
    ],
  },
  {
    titel: 'Sonderterrassen & Zugänge',
    slug: 'sonderterrassen',
    thema: 'Terrassen',
    icon: 'stairs',
    reihenfolge: 4,
    kurzbeschreibung:
      'Giebelterrassen, barrierefreie Rampen, integrierte Erweiterungen, Bodenterrassen und Eingangspodeste.',
    inhalt: [
      produkt('ALLURE & SELECT PIGNON', 'Giebelterrasse · 4.00 x 2.60 m', [
        p('SELECT PIGNON Casa 4.00 x 2.60 m mit Satteldach. Auch mit den Geländern Bella, Ola und Pyla sowie als nicht überdachte Version erhältlich.'),
      ]),
      produkt('Rampe ZIG ZAG', 'Barrierefrei · an Front oder Seite', [
        p('Rampe für Personen mit eingeschränkter Mobilität (PMR), an der Front oder Seite der Terrasse positionierbar. Auch mit den Geländern Bella, Ola und Pyla.'),
      ]),
      produkt('Rampe PALACE', 'Barrierefrei · an der Front', [
        p('Rampe für Personen mit eingeschränkter Mobilität (PMR), an der Front der Terrasse positionierbar.'),
      ]),
      textblock(h('Erweiterungen für Mobilheime mit integrierter Terrasse')),
      produkt('Erweiterung mit Universal-Überdachung', 'Dachkonstruktion 3.09 x 1.68 m', [
        p('Geliefert mit Treppe 3 Stufen.'),
      ]),
      produkt('Erweiterung nicht überdacht', '3.00 x 1.50 m', [p('Geliefert mit Treppe 3 Stufen.')]),
      textblock(h('Bodenterrassen & Eingangspodeste')),
      produkt('CASTEL / CALVI', 'Bodenterrasse · Tiefe 2.53 m / 2.97 m', [
        p('CASTEL 6.00 x 2.53 m mit Option Treppe 2 Stufen L 155 cm mit Setzstufen.'),
      ]),
      produkt('Eingangspodest SIMPLE', '2.31 x 1.12 m', [p('Geliefert mit Treppe 3 Stufen und Unterkonstruktion.')]),
      produkt('Eingangspodest DOUBLE', '3.17 x 1.12 m', [p('Geliefert mit 2 Treppen mit 3 Stufen und Unterkonstruktion.')]),
    ],
  },
  {
    titel: 'Wohnterrassen',
    slug: 'wohnterrassen',
    thema: 'Terrassen',
    icon: 'house-chimney',
    reihenfolge: 3,
    kurzbeschreibung:
      'Überdachte Wohnterrassen DANUBE und TAMISE – neues Konzept 2027 mit Alu-Pfostenkappen sowie Seiten- und Frontplanen.',
    inhalt: [
      textblock(
        h('Serienausstattung', 3),
        list([
          'Holz grün',
          'Längen 4.50 | 6.00 | 7.50 | 9.00 m',
          '4 Geländer zur Auswahl',
          'Treppe 3 Stufen L 128.5 cm, an Front oder Seite positionierbar',
          'Pfosten 95 x 95 mm mit flachem Kopf und lackierten Aluminium-Kappen (neues Konzept 2027)',
        ]),
        h('Überdachung', 3),
        list(['PVC-Plane Classique oder PVC-Plane Serge Ferrari', 'Planenfarbe nach Wahl', M2]),
        h('Optionen', 3),
        list([
          'Seiten- und Frontplanen (Classique oder Serge Ferrari), serienmäßig mit Verdunklungsrollos und Schiebeschienen',
          'Unterkonstruktion für Terrasse und Mobilheim',
          'Tor 1- oder 2-flügelig oder Schiebetor (je nach Modell)',
        ]),
      ),
      produkt('DANUBE', 'Überdacht · Tiefe 2.60 m'),
      produkt('TAMISE', 'Überdacht · Tiefe 3.00 m', [
        p('TAMISE Casa 6.00 x 3.00 m, überdacht 6.00 m, mit Unterkonstruktion und Schiebetor.'),
      ]),
      produkt('Seiten- und Frontplanen PVC', 'Mit Schiebesystem und Verdunklungsrollo', [
        p('TAMISE Casa 6.00 x 3.00 m, überdacht 6.00 m, mit Unterkonstruktion sowie Seiten- und Frontplanen PVC Classique in Vanille. Schiebesystem und Verdunklungsrollo sind serienmäßig.'),
      ]),
      gelaender(['casa', 'sahara', 'ola', 'pyla']),
    ],
  },
  {
    titel: 'Gartenhäuser',
    slug: 'gartenhaeuser',
    thema: 'Gartenhaeuser',
    icon: 'warehouse',
    reihenfolge: 7,
    kurzbeschreibung:
      'Gartenhäuser aus Holz (neu 2027) und PVC von 2 bis 4.6 m² – montiert geliefert, auf Wunsch mit Premium- oder Elektro-Paket.',
    inhalt: [
      textblock(h('Gartenhäuser aus Holz'), p('Neu 2027: mit Holzverkleidung, montiert geliefert.')),
      produkt('BOSQUET 2 m²', 'Holz · L 198 x T 98 x H 148 cm'),
      produkt('CLAIRIÈRE 4 m²', 'Holz · L 194 x T 199 x H 220 cm'),
      produkt('LISIÈRE 4.6 m²', 'Holz · L 229 x T 199 x H 240 cm'),
      textblock(
        h('Gartenhäuser aus PVC'),
        p('Montiert geliefert, mit Ecken aus lackiertem Aluminium. PVC-Verkleidung in Weiß (11), Sand (12) oder Graublau (13).'),
      ),
      produkt('DUNE 2 m²', 'PVC · L 200 x T 96 x H 156 cm', [
        p('Mit umgekehrtem Pultdach oder mit Pultdach nach vorne.'),
      ]),
      produkt(
        'LITTORAL 4 m²',
        'PVC · L 197 x T 202 x H 217 cm',
        [p('Satteldach mit Tropfkante und Ecken aus lackiertem Aluminium.')],
        ['Version (A): Basis', 'Version (B): Pack Premium (Innenausbau)', 'Version (C): Pack Elektro', 'Option: Rollen-Kit zum Versetzen'],
      ),
      produkt(
        'RIVAGE 4.6 m²',
        'PVC · L 229 x T 199 x H 240 cm',
        [p('Mit Fenster und hochwertigem Innenausbau.')],
        ['Pack Premium (Innenausbau)', 'Option Pack Elektro'],
      ),
    ],
  },
  {
    titel: 'Unterkünfte',
    slug: 'unterkuenfte',
    thema: 'Gartenhaeuser',
    icon: 'bed',
    reihenfolge: 8,
    kurzbeschreibung:
      'Neu 2027: die kompakte Unterkunft L’ESCAPADE und das Sanitärmodul L’ESCALE – ideal für Durchreisende und Stellplätze.',
    inhalt: [
      produkt(
        'L’ESCAPADE',
        'Unterkunft für 1 bis 3 Personen · ca. 5.50 m²',
        [
          p('Eine Unterkunft, die den Empfang für Durchreisende neu erfindet – montiert geliefert, mit Ganzjahres-Isolierung und einer Optik, die sich in die Natur einfügt.'),
          h('Innen', 3),
          list([
            'Etagenbett mit 3 Schlafplätzen und Matratzen',
            'Wandleuchte und 2 Nachttischlampen mit USB-Anschluss',
            'Steckdosen und eigene Abschaltung',
            'Sicherungsautomat',
            'Verdunklungsvorhänge',
            'Klapptisch und 2 Hocker',
            'Spiegel mit Metallablage',
            'Garderobenhaken',
          ]),
          h('Außen', 3),
          list([
            'Verkleidung aus druckimprägniertem nordischem Holz',
            'Fenster und Glastür',
            '2 Ringe zum Anschließen von Fahrrädern',
            'Wasserdichte LED-Beleuchtung',
            'Wasserdichte Steckdosen',
            'Kabelausgang für den Anschluss',
          ]),
        ],
        [
          'Ca. 5.50 m² Nutzfläche',
          'Höhe 2.14 m an der niedrigsten Stelle',
          'Isolierung von Wänden, Decke und Boden',
          'Dach aus weißem Trapezblech',
        ],
      ),
      produkt(
        'L’ESCALE',
        'Sanitärmodul · ca. 4.60 m²',
        [
          p('Sanitärkomfort für die Außenbereiche des Campingplatzes – montiert und schlüsselfertig geliefert. Die Abwasseranschlüsse werden bauseits angeschlossen.'),
          h('Sanitärausstattung', 3),
          list(['Duschkabine XL 80 x 120 cm', 'Waschbecken mit Unterschrank', 'WC', 'Warmwasserspeicher']),
          h('Zwei Ausführungen', 3),
          list([
            'ESCALE Nature: Verkleidung aus druckimprägniertem nordischem Holz, anthrazitfarbene Fenster und Glastür (Milchglas)',
            'ESCALE Confort: PVC-Verkleidung in Weiß, Sand oder Graublau, weiße Fenster und geschlossene Tür',
          ]),
        ],
        ['Ca. 4.60 m² Nutzfläche', 'Höhe 2.01 m an der niedrigsten Stelle', 'Spiegel', 'Innenbeleuchtung', '2 Garderobenhaken'],
      ),
    ],
  },

  // ---------------------------------------------------------------- Schutz & Anpassung
  {
    titel: 'Planen & Überdachungen',
    slug: 'planen-ueberdachungen',
    thema: 'Ueberdachungen',
    icon: 'umbrella',
    reihenfolge: 5,
    kurzbeschreibung:
      'Pergolen, Universal-Überdachungen, Adaptions-Kits sowie Seiten- und Frontplanen – alle Planen schwer entflammbar (M2).',
    inhalt: [
      textblock(h('Pergolen & Überdachungen')),
      produkt('Pergola Sonnenschutz', 'Holzdach · 4.50 x 3.00 m'),
      produkt('Pergola Dach STANDARD', '4.50 x 2.60 m · auch mit Dach SUNNY'),
      produkt('Universal-Überdachung', '3.00 x 2.90 m · Dach STANDARD, auch SUNNY'),
      produkt('Universal-Überdachung für Erweiterungen', '3.00 x 1.92 m · Dach STANDARD', [
        p('Für Erweiterungen von Mobilheimen mit integrierter Terrasse.'),
      ]),
      produkt('Adaptions-Kit Vermietung', 'Nachrüstung', [
        p('Verwandelt eine nicht überdachte Terrasse in eine überdachte Version.'),
      ]),
      produkt('Adaptions-Kit O’Hara', 'Dachkonstruktion für O’Hara-Mobilheime'),
      textblock(
        h('Seiten- und Frontplanen (Classique)'),
        h('Serienausstattung', 3),
        list([
          'Fronten mit zu öffnenden Fenstern (Reißverschluss)',
          'Seiten mit festen Fenstern',
          'Mit oder ohne Tür',
          'Planenfarbe nach Wahl',
          M2,
        ]),
        h('Optionen', 3),
        list([
          'Zu öffnende Fenster an den Seiten',
          'Verdunklungsrollos innen',
          'Schiebesystem auf Schiene für Seiten und Fronten',
          'Panoramaplane',
        ]),
      ),
      produkt('Front 6.00 m', 'Mit zu öffnenden Fenstern und Rolltür', [
        p('Front L 6.00 m mit zu öffnenden Fenstern und Rolltür links, Seiten mit festen Fenstern.'),
      ]),
      produkt('Seitenplane mit Rolltür', 'Optional mit Schiebesystem', [
        p('Linke Seite mit Fenster und Rolltür.'),
      ]),
      tabelle(
        'Planenfarben',
        'Linie & Dach | Plane | Farben',
        [
          'Classique · Dach STANDARD | PVC Classique | Weiß (10), Vanille (80), Café (50), Grau (E9), Anthrazit (20), Grau/Weiß (45)',
          'Classique · Dach SUNNY | PVC Classique | Weiß (10), Vanille (80), Café (50), Grau (E9), Anthrazit (20), Grau/Weiß (45)',
          'Classique · Dach SUNNY | PVC SUNNEW (neu 2027, wasserdicht, gewebte Optik) | Vanille (D2), Grau (D3)',
          'Résidentielle · Dach STANDARD | PVC Classique | Weiß (10), Vanille (80), Café (50), Grau (E9), Grau/Weiß (45)',
          'Résidentielle · Dach STANDARD | PVC Serge Ferrari | Weiß (F1), Champagner (F2), Sand (F11), Hellgrau (F3), Grau/Weiß (F4)',
        ],
        M2 + '.',
      ),
    ],
  },
  {
    titel: 'Terrassenoptionen',
    slug: 'terrassenoptionen',
    thema: 'Ueberdachungen',
    icon: 'sliders',
    reihenfolge: 6,
    kurzbeschreibung: 'Tore, Sichtschutz, Unterkonstruktionen, Treppen und Terrassenlager.',
    inhalt: [
      textblock(h('Tore')),
      produkt('Schiebetor Casa', 'Neu 2027', [p('Mit Laufrolle und Zubehör.')]),
      produkt('Tor Casa einflügelig', 'Einflügelig'),
      produkt('Tor Pyla zweiflügelig', 'Zweiflügelig'),
      textblock(h('Sichtschutz')),
      produkt('Sichtschutz horizontale Latten', 'H 1.80 m · für die Terrassenseite'),
      produkt('Sichtschutz horizontale Latten – Front', 'H 1.80 m · Rückführung an der Terrassenfront, Holz braun'),
      textblock(h('Unterkonstruktionen')),
      produkt('Unterkonstruktion Terrasse', 'Bausatz · 3 bis 5 Latten Höhe', [
        p('Als Kit passend zur Terrasse, optional mit Klappe.'),
      ]),
      produkt('Unterkonstruktion Mobilheim, hochklappbar', 'Länge 2.00 oder 3.28 m', [
        p('Auf Gurten, als Kit oder als Set für den gesamten Umfang des Mobilheims.'),
      ]),
      textblock(h('Treppen & Terrassenlager')),
      produkt('Treppen', 'L 100, 128 und 155 cm · montiert geliefert', [p('Mit oder ohne Setzstufen.')]),
      produkt('Handlauf-Kit', 'Für Treppen mit 2, 3 und 4 Stufen'),
      produkt('Höhenverstellbares PVC-Lager', '2 Modelle: H 60–115 mm und H 145–245 mm'),
      produkt('Holz-Kit zur Bodenerhöhung', 'Für Terrassenböden'),
    ],
  },
  {
    titel: 'Maßanfertigung & Retrofit',
    slug: 'massanfertigung',
    thema: 'Massanfertigung',
    icon: 'ruler-combined',
    reihenfolge: 11,
    kurzbeschreibung:
      'Terrassen, Podien und Planen nach Maß – und neu 2027: Renovierung von Mobilheimen mit integrierter Terrasse.',
    inhalt: [
      textblock(
        p('Neben dem Standardsortiment realisieren wir Terrassen, Podien und Planen nach Maß. Eine Auswahl unserer Projekte:'),
      ),
      detail('Podium PALMA', '6.85 x 3.10 m mit Option Sonnenschutz-Pergola mit Holzdach 4.50 m.'),
      detail('Camping La Sirena (Spanien)', 'Podiumterrasse 4.50 x 2.50 m in braunem Holz mit umlaufender Treppe, überdacht mit Pergola 4.50 x 2.50 m mit Flachdach und Soltis-Plane (nicht wasserdicht).'),
      detail('Camping Le Lehan (Bretagne)', 'Terrasse PRIMA 4.50 x 3.00 m, Höhe 30 cm, fugenloser Boden, Unterkonstruktion auf 2 Latten rundum für ein Zeltmodul (nicht im Lieferumfang).'),
      detail('Camping Lac de Pouzauges (Vendée)', 'SELECT Pyla 9.00 x 2.60 m, überdacht SUNNY 5.00 m, plus Spa-Erweiterung 3.00 x 3.00 m mit Sonnenschutz-Überdachung.'),
      detail('Camping Domaine du Morbihan (Bretagne)', 'Terrasse 9.00 x 3.00 m, überdacht 6.00 m, mit Eukalyptus-Geländer, Unterkonstruktion und Sichtschutz an der überdachten Seite.'),
      detail('Camping Le Val Boisé (Normandie)', 'Terrasse 6.00 x 2.60 m, nicht überdacht, 2 Treppen, Sichtschutz aus horizontalen Latten in der Mitte – für Mobilheime im Hotelstil.'),
      detail('Camping Vallée de l’Indre', 'Planen für einen Bühnenbereich in PVC Anthrazit: eine Dachplane und eine Rückwandplane.'),
      detail('Camping Pont Mahé', 'PVC-Planen nach Maß in Café für den Gastronomiebereich.'),
      detail('Camping Romanée l’Évasion (Vendée)', 'Wohnterrasse 10.50 x 3.00 m, komplett überdacht, mit Unterkonstruktion, Schiebetor und seitlichem Sichtschutz.'),
      detail('Camping Lac d’Hautibus', 'Terrasse 6.00 x 3.00 m, überdacht SUNNY 5.00 m, mit Treppe zum Sonnendeck.'),
      textblock(
        h('Retrofit – neu 2027'),
        p(
          'Renovierung von Mobilheimen mit integrierter Terrasse: Wir erneuern den Terrassenbereich bestehender Mobilheime – von der Erneuerung des Bodens bis zur neuen Terrasse mit Erweiterung. Kontaktieren Sie uns.',
        ),
      ),
      button('Projekt anfragen', '/kontakt?anliegen=terrassen', 'Maßanfertigung oder Retrofit besprechen'),
    ],
  },

  // ---------------------------------------------------------------- Zubehör
  {
    titel: 'Zubehör & Outdoormöbel',
    slug: 'zubehoer-outdoormoebel',
    thema: 'Zubehoer',
    icon: 'chair',
    reihenfolge: 9,
    kurzbeschreibung: 'Gaskästen, Klima-Abdeckung, Plancha-Ablage, Tische und Pavillon.',
    inhalt: [
      textblock(h('Zubehör')),
      produkt('Gaskasten Holz', 'L 83 x T 54 x H 70/78 cm · montiert geliefert'),
      produkt('Gasabdeckung Holz', 'L 78 x T 52 x H 69 cm · als Bausatz'),
      produkt('Klimaanlagen-Abdeckung', 'L 111 x T 67 x H 74 cm · als Bausatz', [
        p('Front mit offenen Latten. Klimagerät nicht im Lieferumfang.'),
      ]),
      produkt('Plancha-Ablage', 'L 73.2 x T 55 x H 104.5 cm', [p('Zur Befestigung am Geländer.')]),
      textblock(h('Tische & Pavillon')),
      produkt('Tisch ACCESS', '4–6 oder 6–8 Plätze'),
      produkt('Tisch PIC-NIC', '4–6 oder 6–8 Plätze'),
      produkt('Tisch SNACK', '4–6 Plätze · überdacht'),
      produkt('Pavillon', 'L 320 x T 310 cm · Nutzhöhe 214 cm'),
      tabelle('Tische – Abmessungen', 'Modell | 4–6 Plätze | 6–8 Plätze', [
        'ACCESS | L 150 x T 139 cm | L 190 x T 139 cm',
        'PIC-NIC | L 150 x T 150 cm | L 190 x T 150 cm',
        'SNACK | L 150 x T 150 cm | –',
      ]),
    ],
  },
  {
    titel: 'Esprit Nature',
    slug: 'esprit-nature',
    thema: 'Zubehoer',
    icon: 'seedling',
    reihenfolge: 10,
    kurzbeschreibung:
      'Neu 2027: Komposter, Hochbeete, Pflanzkästen und Fahrradständer für einen grünen Campingplatz – als Bausatz geliefert.',
    inhalt: [
      textblock(
        p(
          'Unsere „grünen“ Ausstattungen für Campingplätze werden als montagefertiger Bausatz geliefert. Sie fördern nachhaltiges Verhalten, verschönern Gemeinschaftsflächen und stärken Ihr verantwortungsvolles Image bei den Gästen.',
        ),
      ),
      produkt('Komposter', 'Für die Bioabfälle des Campingplatzes', [], [
        'Gemeinschaftsnutzung, ca. 850 L',
        'Klappdeckel zum Befüllen',
        'Klappe zur Entnahme der Erde',
      ]),
      produkt('Hochbeet', '150 x 150 cm', [p('Tipp: mehrere Hochbeete versetzt kombinieren.')], [
        'Animation für Kinder',
        'Umweltbildung',
        'Gemeinsame Ernte',
      ]),
      produkt('Pflanzkästen', 'Länge 144 oder 106 cm', [], [
        'Am Boden oder auf dem Terrassenboden zu befestigen',
        'Mit Boden für einen Blumenkasten',
        'Option Rankgitter für Kletterpflanzen',
      ]),
      produkt('Fahrradständer', 'Für 4 Fahrräder', [], ['Passend für jedes Fahrrad', 'Zur Befestigung auf der Terrasse']),
    ],
  },
];

// --- Ausführung -----------------------------------------------------------------
(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents('api::terrassenkategorie.terrassenkategorie');
  const bearbeitet = (d) => new Date(d.updatedAt) - new Date(d.createdAt) > 60000;

  // Geländer einmalig anlegen (vorhandene bleiben unverändert) und Slug -> documentId merken
  const gelaenderDocs = app.documents('api::gelaendermodell.gelaendermodell');
  const gelaenderIds = {};
  for (const g of GELAENDER) {
    let d = await gelaenderDocs.findFirst({ filters: { slug: g.slug }, status: 'draft' });
    if (!d) {
      d = await gelaenderDocs.create({ data: g, status: 'published' });
      console.log(`Geländer angelegt: ${g.slug}`);
    }
    gelaenderIds[g.slug] = d.documentId;
  }
  for (const bereich of BEREICHE) {
    for (const block of bereich.inhalt) {
      if (block.__component === 'terrassen.gelaender-auswahl') {
        block.gelaender = block.gelaender.map((slug) => gelaenderIds[slug]).filter(Boolean);
      }
    }
  }

  // vorhandene ersetzen bzw. veraltete entfernen – nur unbearbeitete Einträge
  if (ERSETZEN) {
    for (const slug of [...BEREICHE.map((b) => b.slug), ...VERALTET]) {
      const d = await docs.findFirst({ filters: { slug }, status: 'draft' });
      if (!d) continue;
      if (bearbeitet(d)) {
        console.log(`behalten (im Admin bearbeitet): ${slug}`);
        continue;
      }
      await docs.delete({ documentId: d.documentId });
      console.log(`entfernt: ${slug}`);
    }
  }

  for (const bereich of BEREICHE) {
    const vorhanden = await docs.findFirst({ filters: { slug: bereich.slug }, status: 'draft' });
    if (vorhanden) {
      console.log(`übersprungen (existiert bereits): ${bereich.slug}`);
      continue;
    }
    await docs.create({ data: bereich, status: 'published' });
    console.log(`angelegt: ${bereich.slug}`);
  }

  // Alle Schreibvorgänge sind abgeschlossen. Kein app.destroy(): knex bricht dabei offene
  // Pool-Anfragen mit einer (harmlosen, aber verwirrenden) "aborted"-Meldung ab.
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
