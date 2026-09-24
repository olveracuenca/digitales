export interface ItineraryItem {
  id: number | string;
  time: string;
  title: string;
  icon: string;
}

export interface GiftItem {
  id: number | string;
  store: string;
  url: string;
}

export type SectionBlockType =
  | 'hero'
  | 'quote'
  | 'countdown'
  | 'datetime'
  | 'carousel'
  | 'photoFrame'
  | 'location'
  | 'secondaryLocation'
  | 'itinerary'
  | 'dressCode'
  | 'gifts'
  | 'bankDetails'
  | 'generalText'
  | 'whatsappRsvp'
  | 'rsvpForm';

export interface SectionBlock {
  id: string;
  type: SectionBlockType;
  title: string; // Título visible en la barra de capas
  visible: boolean;
  locked?: boolean;
  data: Record<string, any>;
}

export interface TemplateData {
  // Metadatos globales del evento
  eventName: string;
  title: string;
  subtitle: string;
  date: string;

  // Lista dinámica de secciones modulares (Estilo CP1500 Studio)
  sections: SectionBlock[];

  // Configuración de estilo global
  design: {
    bgColor: string;
    textColor: string;
    font: string;
    titleFont: string;
    bgImage: string;
    accentColor?: string;
  };

  // Efectos y ambientación global
  music: string;
  emojis: {
    countdown: string;
    carousel: string;
    itinerary: string;
    location: string;
    secondaryLocation: string;
    gifts: string;
    dressCode: string;
    generalGift: string;
    generalText: string;
    whatsapp: string;
    falling: string;
    rsvp: string;
  };
  decorations: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };

  // Propiedades para retrocompatibilidad total con vistas previas y templates
  countdownDesign: {
    bgColor: string;
    textColor: string;
    font: string;
  };
  location: string;
  address: string;
  locationUrl: string;
  secondaryLocation: string;
  secondaryAddress: string;
  secondaryLocationUrl: string;
  whatsapp: string;
  whatsappMessage?: string;
  whatsappDeclineMessage?: string;
  rsvpPhone: string;
  rsvpContacts?: { label: string; phone: string }[];
  mainPhoto: string;
  carouselPhotos: string[];
  itinerary: ItineraryItem[];
  gifts: GiftItem[];
  dressCode: {
    him: string;
    her: string;
    general: string;
  };
  generalGift: string;
  generalText: string;
  quote: {
    text: string;
    color: string;
    font: string;
    size: string;
  };
  visibility: {
    quote: boolean;
    carousel: boolean;
    countdown: boolean;
    location: boolean;
    secondaryLocation: boolean;
    gifts: boolean;
    whatsapp: boolean;
    bgImage: boolean;
    fallingIcons: boolean;
    music: boolean;
    decorations: boolean;
    itinerary: boolean;
    dressCode: boolean;
    generalGift: boolean;
    generalText: boolean;
    rsvp: boolean;
  };
}
