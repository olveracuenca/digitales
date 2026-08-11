export interface ItineraryItem {
  id: number;
  time: string;
  title: string;
  icon: string;
}

export interface GiftItem {
  id: number;
  store: string;
  url: string;
}

export interface TemplateData {
  eventName: string;
  title: string;
  subtitle: string;
  date: string;
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
  music: string;
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
  design: {
    bgColor: string;
    textColor: string;
    font: string;
    titleFont: string;
    bgImage: string;
  };
  decorations: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
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
