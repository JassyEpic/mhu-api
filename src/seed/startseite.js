'use strict';

// Legt den Single Type "Startseite" beim ersten Start mit den bisherigen Texten an,
// damit im Admin nichts leer ist. Existiert der Eintrag schon, passiert nichts.
// Bilder werden – falls in der Mediathek vorhanden – über ihren Datei-Hash verknüpft.

const UID = 'api::startseite.startseite';

const BILDER = {
  irm: 'IRM_AQUA_4_FR_2026_Exterieur_0675b9131a',
  ohara: '1175_HD_jpg_1200px_41b0a07508',
  coco: 'coco_chronoext202535279_91677b21f5',
  terrassen: '2_Castellas_premium_3256781531',
};

async function bildId(strapi, hash) {
  const file = await strapi.db.query('plugin::upload.file').findOne({ where: { hash } });
  return file?.id ?? null;
}

async function seedStartseite(strapi) {
  if (!strapi.contentTypes[UID]) return;
  const vorhanden = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (vorhanden) return;

  const bild = {};
  for (const [key, hash] of Object.entries(BILDER)) bild[key] = await bildId(strapi, hash);

  await strapi.documents(UID).create({
    status: 'published',
    data: {
      intro: {
        titel: 'Entdecken Sie Ihr Traum-Mobilheim',
        text:
          'Bei Mobilheim Union finden Sie eine große Auswahl an hochwertigen Mobilheimen, die perfekt auf Ihre Bedürfnisse zugeschnitten sind. Egal, ob Sie ein gemütliches Wochenendhaus oder ein luxuriöses Ferienhaus suchen – wir haben das Richtige für Sie.',
      },
      werte: {
        titel: 'Unsere Werte',
        eintraege: [
          {
            icon: 'secure-white',
            titel: 'Qualität & Preis‑Leistung',
            hervorhebung: 'Hochwertig gefertigt, fair im Preis.',
            text: 'Dank 22 Jahren Erfahrung und Serienproduktion bieten wir robuste Mobilheime mit hoher Verarbeitungsqualität — zu einem Preis, der überzeugt.',
          },
          {
            icon: 'handshake',
            titel: 'Vielfalt & Kundenorientierung',
            hervorhebung: 'Über 30 Modelle – das passende Mobilheim für Sie.',
            text: 'Stöbern Sie in unserer Modellvielfalt und finden Sie das Mobilheim, das genau Ihren Wünschen entspricht.',
          },
          {
            icon: 'checklist-white',
            titel: 'Sicherheit & Ganzjahresbetrieb',
            hervorhebung: 'Normgerecht, sicher und für alle Jahreszeiten geeignet.',
            text: 'Alle Modelle sind nach einschlägigen Normen gebaut, zugelassen und optional für den Ganzjahresbetrieb ausrüstbar.',
          },
        ],
      },
      marken: {
        eyebrow: 'Mobilheime & Terrassen',
        titel: 'Unsere Marken & Terrassen',
        text: 'Drei Hersteller mit eigenem Charakter – und die passende Terrasse dazu.',
        trennerText: 'passend dazu',
        karten: [
          {
            name: 'IRM',
            kategorie: 'Mobilheim-Hersteller',
            untertitel: 'Die Klassiker',
            text: 'Bewährte Robustheit und zeitloses Design für hohe Beanspruchung im Vermietungsgeschäft.',
            bild: bild.irm,
            farbe: '#1f4e79',
            link: '/hersteller/irm',
            buttonText: 'IRM entdecken',
            link2: '/modelle?hersteller=irm',
            link2Text: 'Alle IRM-Modelle',
            nachTrenner: false,
          },
          {
            name: "O'Hara",
            kategorie: 'Mobilheim-Hersteller',
            untertitel: 'Eco-Design',
            text: 'Moderne Linienführung gepaart mit einem starken Fokus auf nachhaltige Materialien und Energieeffizienz.',
            bild: bild.ohara,
            farbe: '#6b7d54',
            link: '/hersteller/o-hara',
            buttonText: "O'Hara entdecken",
            link2: '/modelle?hersteller=o-hara',
            link2Text: "Alle O'Hara-Modelle",
            nachTrenner: false,
          },
          {
            name: 'Coco',
            kategorie: 'Mobilheim-Hersteller',
            untertitel: 'Glamping Pur',
            text: 'Das unkonventionelle Erlebnis zwischen Zelt und Mobilheim. Gemütlich, spielerisch, naturnah.',
            bild: bild.coco,
            farbe: '#bd9a1c',
            link: '/hersteller/coco',
            buttonText: 'Coco entdecken',
            link2: '/modelle?hersteller=coco',
            link2Text: 'Alle Coco-Modelle',
            nachTrenner: false,
          },
          {
            name: 'Terrassen',
            kategorie: 'Für Ihr Mobilheim',
            untertitel: 'Wohnraum im Freien',
            text: 'Passgenaue Terrassen und Geländer für Ihr Mobilheim – langlebig, pflegeleicht und in verschiedenen Linien.',
            bild: bild.terrassen,
            farbe: '#8b5e3c',
            link: '/terrassen',
            buttonText: 'Terrassen entdecken',
            nachTrenner: true,
          },
        ],
      },
      neuheiten: {
        titel: 'Neuheiten',
        jahrAnzeigen: true,
        linkText: 'Alle ansehen',
        link: '/modelle',
        anzahl: 6,
      },
    },
  });
  strapi.log.info('Startseite mit Standardinhalten angelegt');
}

module.exports = { seedStartseite };
