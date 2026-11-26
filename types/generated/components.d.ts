import type { Schema, Struct } from '@strapi/strapi';

export interface DesignBeschreibung extends Struct.ComponentSchema {
  collectionName: 'components_design_beschreibungs';
  info: {
    displayName: 'Textblock';
    icon: 'layer';
  };
  attributes: {
    beschreibung: Schema.Attribute.Blocks;
  };
}

export interface DesignDetails extends Struct.ComponentSchema {
  collectionName: 'components_design_details';
  info: {
    displayName: 'Details';
    icon: 'bulletList';
  };
  attributes: {
    beschreibung: Schema.Attribute.Text;
    bild: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    nebeneinander: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    titel: Schema.Attribute.String;
  };
}

export interface DesignGalerie extends Struct.ComponentSchema {
  collectionName: 'components_design_galeries';
  info: {
    displayName: 'Galerie';
    icon: 'landscape';
  };
  attributes: {
    beschreibung: Schema.Attribute.Text;
    bilder: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    titel: Schema.Attribute.String;
  };
}

export interface DesignSofa extends Struct.ComponentSchema {
  collectionName: 'components_design_sofas';
  info: {
    displayName: 'Sofa';
    icon: 'brush';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface DesignVorhang extends Struct.ComponentSchema {
  collectionName: 'components_design_vorhangs';
  info: {
    displayName: 'Vorhang';
    icon: 'brush';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
  };
}

export interface HerstellerCta extends Struct.ComponentSchema {
  collectionName: 'components_hersteller_ctas';
  info: {
    displayName: 'Call-to-Action';
    icon: 'cursor';
  };
  attributes: {
    buttonLink: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String;
  };
}

export interface HerstellerFeature extends Struct.ComponentSchema {
  collectionName: 'components_hersteller_features';
  info: {
    displayName: 'Feature';
    icon: 'check';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String;
  };
}

export interface HerstellerHubItem extends Struct.ComponentSchema {
  collectionName: 'components_hersteller_hub_items';
  info: {
    displayName: 'Hub-Kachel';
    icon: 'apps';
  };
  attributes: {
    icon: Schema.Attribute.String;
    link: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String;
  };
}

export interface KonfiguratorAnsicht extends Struct.ComponentSchema {
  collectionName: 'components_konfigurator_ansichten';
  info: {
    description: 'Eine Vorschau (z. B. Au\u00DFen mit Satteldach, Au\u00DFen mit Pultdach oder Innenraum). Grundebenen liegen unter den Optionen, Deckebenen (z. B. Fenster/T\u00FCren) dar\u00FCber \u2013 jeweils in dieser Reihenfolge';
    displayName: 'Ansicht';
    icon: 'picture';
  };
  attributes: {
    dach: Schema.Attribute.Enumeration<['Satteldach', 'Pultdach', 'Flachdach']>;
    deckebenen: Schema.Attribute.Media<'images', true>;
    grundebenen: Schema.Attribute.Media<'images', true>;
    gruppen: Schema.Attribute.Component<'konfigurator.gruppe', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    typ: Schema.Attribute.Enumeration<['Aussen', 'Innen']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aussen'>;
  };
}

export interface KonfiguratorGruppe extends Struct.ComponentSchema {
  collectionName: 'components_konfigurator_gruppen';
  info: {
    description: 'Auswahlgruppe (z. B. Front, 4 Seiten, Rahmen, Polster, Vorh\u00E4nge). Gleicher Schl\u00FCssel = gleiche Gruppe in allen Dachvarianten. Exklusiv = Ebenen zeigen das ganze Haus; eine Auswahl hebt die anderer exklusiver Gruppen auf (Front \u2194 4 Seiten)';
    displayName: 'Gruppe';
    icon: 'apps';
  };
  attributes: {
    exklusiv: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    optionen: Schema.Attribute.Component<'konfigurator.option', true>;
    schluessel: Schema.Attribute.String;
  };
}

export interface KonfiguratorOption extends Struct.ComponentSchema {
  collectionName: 'components_konfigurator_optionen';
  info: {
    description: 'Eine Farbe/ein Muster: rundes Farbmuster und transparente Bild-Ebene. Ebene = Stapelreihenfolge (h\u00F6her liegt oben)';
    displayName: 'Option';
    icon: 'brush';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images'>;
    ebene: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    farbmuster: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KonstruktionGallerie extends Struct.ComponentSchema {
  collectionName: 'components_konstruktion_galleries';
  info: {
    displayName: 'Gallerie';
    icon: 'landscape';
  };
  attributes: {
    bilder: Schema.Attribute.Media<
      'images' | 'videos' | 'audios' | 'files',
      true
    >;
  };
}

export interface KonstruktionList extends Struct.ComponentSchema {
  collectionName: 'components_konstruktion_lists';
  info: {
    displayName: 'list';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface KonstruktionMainImg extends Struct.ComponentSchema {
  collectionName: 'components_konstruktion_main_imgs';
  info: {
    displayName: 'mainImg';
    icon: 'landscape';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface KonstruktionTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_konstruktion_text_blocks';
  info: {
    displayName: 'Text-Block';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
  };
}

export interface KonzepteImage extends Struct.ComponentSchema {
  collectionName: 'components_konzepte_images';
  info: {
    displayName: 'Image';
    icon: 'crop';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface KonzepteLongText extends Struct.ComponentSchema {
  collectionName: 'components_konzepte_long_texts';
  info: {
    displayName: 'Long Text';
    icon: 'layer';
  };
  attributes: {
    Heading: Schema.Attribute.String;
    text: Schema.Attribute.Blocks;
  };
}

export interface KonzepteName extends Struct.ComponentSchema {
  collectionName: 'components_konzepte_names';
  info: {
    displayName: 'name';
  };
  attributes: {
    name: Schema.Attribute.String;
  };
}

export interface Mobilheime360Video extends Struct.ComponentSchema {
  collectionName: 'components_mobilheime_360_videos';
  info: {
    displayName: '360-Video';
    icon: 'eye';
  };
  attributes: {
    videoLink: Schema.Attribute.String;
  };
}

export interface MobilheimeDatenblatt extends Struct.ComponentSchema {
  collectionName: 'components_mobilheime_datenblatts';
  info: {
    displayName: 'Datenblatt';
    icon: 'filePdf';
  };
  attributes: {
    datasheet: Schema.Attribute.Media<'files'>;
  };
}

export interface MobilheimeHighlight extends Struct.ComponentSchema {
  collectionName: 'components_mobilheime_highlights';
  info: {
    displayName: 'highlight';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface MobilheimeLinks extends Struct.ComponentSchema {
  collectionName: 'components_mobilheime_links';
  info: {
    displayName: 'Links';
    icon: 'cursor';
  };
  attributes: {
    linkTo: Schema.Attribute.String;
  };
}

export interface MobilheimeYoutubeVideo extends Struct.ComponentSchema {
  collectionName: 'components_mobilheime_youtube_videos';
  info: {
    displayName: 'YoutubeVideo';
    icon: 'eye';
  };
  attributes: {
    name: Schema.Attribute.String;
    videoId: Schema.Attribute.String;
  };
}

export interface SharedHinweis extends Struct.ComponentSchema {
  collectionName: 'components_shared_hinweise';
  info: {
    description: 'Hervorgehobener Hinweiskasten, z. B. \u201EKeine Ausstellung vor Ort\u201C';
    displayName: 'Hinweis';
    icon: 'information';
  };
  attributes: {
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedKontaktperson extends Struct.ComponentSchema {
  collectionName: 'components_shared_kontaktpersonen';
  info: {
    displayName: 'Kontaktperson';
    icon: 'user';
  };
  attributes: {
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String;
    rolle: Schema.Attribute.String;
    telefon: Schema.Attribute.String;
  };
}

export interface SharedLinkButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_buttons';
  info: {
    description: 'Button zu einer internen Seite (/kontakt) oder externen Website';
    displayName: 'Link-Button';
    icon: 'link';
  };
  attributes: {
    beschreibung: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StartseiteIntro extends Struct.ComponentSchema {
  collectionName: 'components_startseite_intros';
  info: {
    description: 'Gro\u00DFes Bild mit \u00DCberschrift ganz oben auf der Startseite';
    displayName: 'Intro';
    icon: 'picture';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String;
  };
}

export interface StartseiteMarkenBereich extends Struct.ComponentSchema {
  collectionName: 'components_startseite_marken_bereiche';
  info: {
    description: 'Panorama mit Marken und Terrassen. Karten mit \u201EnachTrenner\u201C erscheinen hinter dem Trenner (z. B. Terrassen)';
    displayName: 'Marken-Bereich';
    icon: 'layout';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    karten: Schema.Attribute.Component<'startseite.marken-karte', true>;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String;
    trennerText: Schema.Attribute.String;
  };
}

export interface StartseiteMarkenKarte extends Struct.ComponentSchema {
  collectionName: 'components_startseite_marken_karten';
  info: {
    description: 'Ein Streifen im Panorama. Links intern mit \u201E/\u201C beginnen (z. B. /hersteller/irm), extern mit https://';
    displayName: 'Marken-Karte';
    icon: 'picture';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images'>;
    buttonText: Schema.Attribute.String;
    farbe: Schema.Attribute.String;
    kategorie: Schema.Attribute.String;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    link2: Schema.Attribute.String;
    link2Text: Schema.Attribute.String;
    nachTrenner: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
    untertitel: Schema.Attribute.String;
  };
}

export interface StartseiteNeuheitenBereich extends Struct.ComponentSchema {
  collectionName: 'components_startseite_neuheiten_bereiche';
  info: {
    description: 'Welche Modelle erscheinen, steuert der Haken \u201Eneuheit\u201C am Mobilheim. Das Jahr wird automatisch angeh\u00E4ngt (ab September das Folgejahr)';
    displayName: 'Neuheiten-Bereich';
    icon: 'bell';
  };
  attributes: {
    anzahl: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    jahrAnzeigen: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    link: Schema.Attribute.String;
    linkText: Schema.Attribute.String;
    titel: Schema.Attribute.String;
  };
}

export interface StartseiteWert extends Struct.ComponentSchema {
  collectionName: 'components_startseite_werte';
  info: {
    description: 'Eine Karte unter \u201EUnsere Werte\u201C. Icon = Font-Awesome-Name (z. B. handshake, leaf, shield-halved)';
    displayName: 'Wert';
    icon: 'check';
  };
  attributes: {
    hervorhebung: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StartseiteWerteBereich extends Struct.ComponentSchema {
  collectionName: 'components_startseite_werte_bereiche';
  info: {
    description: '\u00DCberschrift und Karten von \u201EUnsere Werte\u201C';
    displayName: 'Werte-Bereich';
    icon: 'star';
  };
  attributes: {
    eintraege: Schema.Attribute.Component<'startseite.wert', true>;
    titel: Schema.Attribute.String;
  };
}

export interface TerrassenGelaenderAuswahl extends Struct.ComponentSchema {
  collectionName: 'components_terrassen_gelaender_auswahl';
  info: {
    description: 'Zeigt ausgew\u00E4hlte Gel\u00E4nder aus der Collection \u201EGel\u00E4nder\u201C';
    displayName: 'Gel\u00E4nder-Auswahl';
    icon: 'bulletList';
  };
  attributes: {
    gelaender: Schema.Attribute.Relation<
      'oneToMany',
      'api::gelaendermodell.gelaendermodell'
    >;
    text: Schema.Attribute.Text;
    titel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Unsere Gel\u00E4nder'>;
  };
}

export interface TerrassenLinie extends Struct.ComponentSchema {
  collectionName: 'components_terrassen_linien';
  info: {
    description: 'Eine Terrassen-Linie im Vergleich auf der \u00DCbersicht';
    displayName: 'Linie (Vergleich)';
    icon: 'layout';
  };
  attributes: {
    bereich: Schema.Attribute.Relation<
      'oneToOne',
      'api::terrassenkategorie.terrassenkategorie'
    >;
    besonders: Schema.Attribute.String;
    claim: Schema.Attribute.String;
    dach: Schema.Attribute.String;
    holz: Schema.Attribute.String;
    laengen: Schema.Attribute.String;
    modelle: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    tiefen: Schema.Attribute.String;
  };
}

export interface TerrassenProdukt extends Struct.ComponentSchema {
  collectionName: 'components_terrassen_produkte';
  info: {
    description: 'Ein Terrassen-/Zubeh\u00F6r-Modell mit Bildern, Beschreibung und Merkmalen';
    displayName: 'Terrassen-Produkt';
    icon: 'store';
  };
  attributes: {
    beschreibung: Schema.Attribute.Blocks;
    bilder: Schema.Attribute.Media<'images', true>;
    merkmale: Schema.Attribute.Component<'mobilheime.highlight', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    untertitel: Schema.Attribute.String;
  };
}

export interface TerrassenTabelle extends Struct.ComponentSchema {
  collectionName: 'components_terrassen_tabellen';
  info: {
    description: 'Kopfzeile und Zeilen: Zellen mit | trennen, eine Zeile pro Absatz';
    displayName: 'Tabelle';
    icon: 'grid';
  };
  attributes: {
    hinweis: Schema.Attribute.Text;
    kopfzeile: Schema.Attribute.String;
    titel: Schema.Attribute.String;
    zeilen: Schema.Attribute.Text;
  };
}

export interface TerrassenThema extends Struct.ComponentSchema {
  collectionName: 'components_terrassen_themen';
  info: {
    description: 'Ein Thema der Terrassenwelt (Kachel auf der \u00DCbersicht, \u00DCberschrift im Men\u00FC)';
    displayName: 'Thema';
    icon: 'apps';
  };
  attributes: {
    bild: Schema.Attribute.Media<'images'>;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    lead: Schema.Attribute.Text;
    thema: Schema.Attribute.Enumeration<
      [
        'Terrassen',
        'Ueberdachungen',
        'Gartenhaeuser',
        'Zubehoer',
        'Massanfertigung',
      ]
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'design.beschreibung': DesignBeschreibung;
      'design.details': DesignDetails;
      'design.galerie': DesignGalerie;
      'design.sofa': DesignSofa;
      'design.vorhang': DesignVorhang;
      'hersteller.cta': HerstellerCta;
      'hersteller.feature': HerstellerFeature;
      'hersteller.hub-item': HerstellerHubItem;
      'konfigurator.ansicht': KonfiguratorAnsicht;
      'konfigurator.gruppe': KonfiguratorGruppe;
      'konfigurator.option': KonfiguratorOption;
      'konstruktion.gallerie': KonstruktionGallerie;
      'konstruktion.list': KonstruktionList;
      'konstruktion.main-img': KonstruktionMainImg;
      'konstruktion.text-block': KonstruktionTextBlock;
      'konzepte.image': KonzepteImage;
      'konzepte.long-text': KonzepteLongText;
      'konzepte.name': KonzepteName;
      'mobilheime.360-video': Mobilheime360Video;
      'mobilheime.datenblatt': MobilheimeDatenblatt;
      'mobilheime.highlight': MobilheimeHighlight;
      'mobilheime.links': MobilheimeLinks;
      'mobilheime.youtube-video': MobilheimeYoutubeVideo;
      'shared.hinweis': SharedHinweis;
      'shared.kontaktperson': SharedKontaktperson;
      'shared.link-button': SharedLinkButton;
      'startseite.intro': StartseiteIntro;
      'startseite.marken-bereich': StartseiteMarkenBereich;
      'startseite.marken-karte': StartseiteMarkenKarte;
      'startseite.neuheiten-bereich': StartseiteNeuheitenBereich;
      'startseite.wert': StartseiteWert;
      'startseite.werte-bereich': StartseiteWerteBereich;
      'terrassen.gelaender-auswahl': TerrassenGelaenderAuswahl;
      'terrassen.linie': TerrassenLinie;
      'terrassen.produkt': TerrassenProdukt;
      'terrassen.tabelle': TerrassenTabelle;
      'terrassen.thema': TerrassenThema;
    }
  }
}
