'use strict';

/**
 * Füllt den Single Type "Terrassen-Übersicht" (Texte der Seite /terrassen) mit den
 * Startinhalten. Läuft nur, wenn noch kein Eintrag existiert – vorhandene Texte
 * werden nie überschrieben.
 *
 * Aufruf:  npm run seed:terrassen-uebersicht
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const DATEN = {
  eyebrow: 'Terrassen & Außenbereich',
  titel: 'Terrassenwelten',
  lead: 'Erweitern Sie den Wohnraum in die Natur – mit Holzterrassen, Überdachungen, Gartenhäusern und Zubehör, passend zu Ihren Mobilheimen.',
  themen: [
    {
      thema: 'Terrassen',
      label: 'Terrassen',
      icon: 'house-chimney',
      lead: 'Holzterrassen für Ihr Mobilheim – überdacht, als Podium oder offen.',
    },
    {
      thema: 'Ueberdachungen',
      label: 'Überdachungen & Optionen',
      icon: 'umbrella',
      lead: 'Pergolen, Planen, Tore, Sichtschutz und Treppen – zum Ergänzen und Nachrüsten.',
    },
    {
      thema: 'Gartenhaeuser',
      label: 'Gartenhäuser & Unterkünfte',
      icon: 'warehouse',
      lead: 'Stauraum aus Holz oder PVC – und neu: kompakte Unterkünfte und Sanitärmodule.',
    },
    {
      thema: 'Zubehoer',
      label: 'Zubehör & Esprit Nature',
      icon: 'seedling',
      lead: 'Tische, Gaskästen und „grüne“ Ausstattung für Ihren Campingplatz.',
    },
    {
      thema: 'Massanfertigung',
      label: 'Maßanfertigung',
      icon: 'ruler-combined',
      lead: 'Terrassen, Podien und Planen nach Maß – und Retrofit bestehender Mobilheime.',
    },
  ],
  vergleichTitel: 'Welche Terrasse passt zu Ihnen?',
  vergleichText: 'Unsere drei Linien im Überblick.',
  linien: [
    {
      name: 'Excellence',
      bereichSlug: 'excellence',
      claim: 'All-inclusive',
      modelle: 'Ébène, Terra',
      holz: 'Braun',
      tiefen: '2.60 – 4.00 m',
      laengen: '5.50 – 8.50 m',
      dach: 'Dach SUNNY serienmäßig',
      besonders: 'Sichtschutz und Unterkonstruktion inklusive',
    },
    {
      name: 'Classique',
      bereichSlug: 'classique',
      claim: 'Die größte Auswahl',
      modelle: 'Select, Prestige, Moea, Fidji, Allure, Elite',
      holz: 'Grün oder braun',
      tiefen: '2.60 – 3.45 m',
      laengen: '3.00 – 9.00 m',
      dach: 'Dach STANDARD oder SUNNY – oder offen',
      besonders: '5 Geländer, auch als Podium',
    },
    {
      name: 'Résidentielle',
      bereichSlug: 'wohnterrassen',
      claim: 'Zum Wohnen',
      modelle: 'Danube, Tamise',
      holz: 'Grün',
      tiefen: '2.60 / 3.00 m',
      laengen: '4.50 – 9.00 m',
      dach: 'PVC Classique oder Serge Ferrari',
      besonders: 'Seiten- und Frontplanen, Pfosten 95 x 95 mm',
    },
  ],
  versprechen: [
    { icon: 'industry', titel: 'Hergestellt in Frankreich', text: 'seit über 30 Jahren' },
    { icon: 'tree', titel: 'Nordisches Holz', text: 'druckimprägniert, Klasse 3 und 4' },
    { icon: 'fire-extinguisher', titel: 'Planen M2', text: 'schwer entflammbar' },
    { icon: 'shield-halved', titel: '10 Jahre', text: 'Nutzungsgarantie auf das Holz' },
  ],
};

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = app.documents('api::terrassen-uebersicht.terrassen-uebersicht');

  const vorhanden = await docs.findFirst({ status: 'draft' });
  if (vorhanden) {
    console.log('übersprungen: Terrassen-Übersicht existiert bereits');
    process.exit(0);
  }

  // Linien mit ihren Terrassen-Bereichen verknüpfen (Slug -> documentId)
  const bereiche = app.documents('api::terrassenkategorie.terrassenkategorie');
  const linien = [];
  for (const { bereichSlug, ...linie } of DATEN.linien) {
    const b = await bereiche.findFirst({ filters: { slug: bereichSlug }, status: 'draft' });
    linien.push({ ...linie, bereich: b?.documentId ?? null });
    if (!b) console.log(`Hinweis: Bereich "${bereichSlug}" nicht gefunden – Linie ohne Link`);
  }

  await docs.create({ data: { ...DATEN, linien }, status: 'published' });
  console.log('angelegt: Terrassen-Übersicht');

  // Alle Schreibvorgänge sind abgeschlossen. Kein app.destroy(): knex bricht dabei offene
  // Pool-Anfragen mit einer (harmlosen, aber verwirrenden) "aborted"-Meldung ab.
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
