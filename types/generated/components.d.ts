import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'konzepte.image': KonzepteImage;
      'konzepte.long-text': KonzepteLongText;
      'mobilheime.360-video': Mobilheime360Video;
      'mobilheime.datenblatt': MobilheimeDatenblatt;
      'mobilheime.highlight': MobilheimeHighlight;
      'mobilheime.links': MobilheimeLinks;
      'mobilheime.youtube-video': MobilheimeYoutubeVideo;
    }
  }
}
