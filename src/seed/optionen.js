'use strict';

// Option "Prêt-à-meubler" (Premium-Modelle unmöbliert), Text nach IRM
// "L'Innovation Prêt-à-meubler" (mobil-home.com), ins Deutsche übertragen.
// - seedOptionen: legt den Eintrag beim Start einmalig an (existiert er – auch als Entwurf
//   oder umbenannt, erkannt am Slug –, passiert nichts)
// - scripts/update-pret-a-meubler.js: lädt das Bild hoch und aktualisiert einen vorhandenen Eintrag

const UID = 'api::optionsgruppe.optionsgruppe';
const SLUG = 'pret-a-meubler';
const BILD_NAME = 'pret-a-meubler.jpg'; // Dateiname in der Mediathek

const txt = (t) => ({ type: 'text', text: t });
const p = (t) => ({ type: 'paragraph', children: [txt(t)] });
const h = (t, level = 3) => ({ type: 'heading', level, children: [txt(t)] });

// erscheint im Modell-Konfigurator bei der Innenansicht (Sofa und Vorhänge entfallen ja)
const KONFIGURATOR_HINWEIS =
  'Lieber selbst einrichten? Premium-Modelle gibt es auch unmöbliert („Prêt-à-meubler“) – Sofa, Tische, Stühle, Betten und Vorhänge wählen Sie dann ganz nach Ihrem Geschmack.';

const KURZBESCHREIBUNG =
  'Premium-Modelle gibt es auf Wunsch auch ohne Möblierung – so richten Sie Ihr Mobilheim ganz nach Ihrem eigenen Stil ein.';

// Inhalt der Dynamic Zone; bildId = Mediathek-ID des Bildes (ohne Bild nur Text)
function inhalt(bildId) {
  const intro = {
    titel: 'Ein Interieur, das zu Ihnen passt',
    beschreibung:
      'Bei „Prêt-à-meubler“ wird das Mobiliar nicht mitgeliefert: Sofa, Couchtisch, Esstisch, Stühle, Betten, Nachttische und Vorhänge.\n\n' +
      'Geben Sie Ihrem Mobilheim mit der Option „Prêt-à-meubler“ einen einzigartigen Stil, der zu Ihnen passt: Sie richten Ihren Innenraum in Ihrem eigenen Tempo ein und dekorieren ihn nach Ihren Wünschen und Ihrem Budget.',
  };
  return [
    bildId
      ? { __component: 'design.details', ...intro, bild: bildId, nebeneinander: true }
      : { __component: 'design.beschreibung', beschreibung: [h(intro.titel), ...intro.beschreibung.split('\n\n').map(p)] },
    {
      __component: 'design.beschreibung',
      beschreibung: [
        h('Volle Freiheit'),
        p(
          'Mit „Prêt-à-meubler“ gestalten Sie Ihr Mobilheim ganz persönlich – zum Beispiel mit einer Bettausstattung, die genau zu Ihren Bedürfnissen passt, oder mit Möbeln und Accessoires aus Ihrer Familie, an denen Sie hängen.'
        ),
        p('Eine exklusive Neuheit von IRM – Frankreichs Mobilheim-Hersteller Nr. 1.'),
        p('Kontaktieren Sie uns – wir beraten Sie gern, welche Modelle und Ausführungen möglich sind.'),
      ],
    },
  ];
}

async function bildIdAusMediathek(strapi) {
  const file = await strapi.db.query('plugin::upload.file').findOne({ where: { name: BILD_NAME } });
  return file?.id ?? null;
}

async function seedOptionen(strapi) {
  if (!strapi.contentTypes[UID]) return;
  const vorhanden = await strapi.documents(UID).findFirst({ filters: { slug: SLUG }, status: 'draft' });
  if (vorhanden) return;

  const irm = await strapi.documents('api::hersteller.hersteller').findFirst({ filters: { slug: 'irm' } });
  const premium = await strapi
    .documents('api::modellreihe.modellreihe')
    .findFirst({ filters: { slug: 'premium' } });
  if (!irm || !premium) return; // ohne Hersteller/Reihe nicht sinnvoll zuordenbar

  await strapi.documents(UID).create({
    status: 'published',
    data: {
      titel: 'Prêt-à-meubler – unmöbliert kaufen',
      slug: SLUG,
      kurzbeschreibung: KURZBESCHREIBUNG,
      reihenfolge: 10,
      aufModellseite: true,
      konfiguratorHinweis: KONFIGURATOR_HINWEIS,
      hersteller: { connect: [{ documentId: irm.documentId }] },
      modellreihen: { connect: [{ documentId: premium.documentId }] },
      inhalt: inhalt(await bildIdAusMediathek(strapi)),
    },
  });
  strapi.log.info('Option „Prêt-à-meubler“ angelegt');
}

module.exports = { seedOptionen, inhalt, UID, SLUG, BILD_NAME, KONFIGURATOR_HINWEIS };
