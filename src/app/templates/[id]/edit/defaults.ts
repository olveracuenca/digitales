import { TemplateData } from './types';

export const getDefaultData = (id: string): TemplateData => {
  const base: TemplateData = {
    eventName: "Mi Nuevo Evento",
    title: "Nuestra Boda",
    subtitle: "María & Juan",
    date: "2026-12-31T18:00",
    countdownDesign: {
      bgColor: "#1f2937",
      textColor: "#fdfbf7",
      font: "sans-serif"
    },
    location: "Hacienda San José",
    address: "",
    locationUrl: "https://maps.google.com/?q=Hacienda+San+Jose",
    secondaryLocation: "Iglesia San Juan",
    secondaryAddress: "",
    secondaryLocationUrl: "https://maps.google.com/?q=Iglesia+San+Juan",
    whatsapp: "",
    rsvpPhone: "",
    mainPhoto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
    carouselPhotos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800"
    ],
    music: "",
    itinerary: [
      { id: 1, time: "20:00 hs", title: "Ceremonia", icon: '<i class="fa-solid fa-ring"></i>' },
      { id: 2, time: "21:30 hs", title: "Recepción", icon: '<i class="fa-solid fa-champagne-glasses"></i>' },
      { id: 3, time: "22:30 hs", title: "Cena", icon: '<i class="fa-solid fa-utensils"></i>' },
      { id: 4, time: "00:00 hs", title: "Baile", icon: '<i class="fa-solid fa-music"></i>' }
    ],
    gifts: [
      { id: 1, store: "Liverpool", url: "https://liverpool.com.mx" }
    ],
    dressCode: {
      him: "Traje Formal",
      her: "Vestido Largo",
      general: "Formal"
    },
    generalGift: "¡Tu presencia es nuestro mejor regalo! Si deseas tener un detalle adicional, puedes usar este sobre.",
    generalText: "Nota adicional para nuestros invitados.",
    quote: {
      text: "Gracias por ser parte de este momento tan especial.",
      color: "#1f2937",
      font: "serif",
      size: "1.2rem"
    },
    emojis: {
      countdown: '<i class="fa-solid fa-hourglass-half"></i>',
      carousel: '<i class="fa-solid fa-camera"></i>',
      itinerary: '<i class="fa-solid fa-list"></i>',
      location: '<i class="fa-solid fa-location-dot"></i>',
      secondaryLocation: '<i class="fa-solid fa-church"></i>',
      gifts: '<i class="fa-solid fa-gift"></i>',
      dressCode: '<i class="fa-solid fa-shirt"></i>',
      generalGift: '<i class="fa-solid fa-envelope"></i>',
      generalText: '<i class="fa-solid fa-message"></i>',
      whatsapp: '<i class="fa-brands fa-whatsapp"></i>',
      falling: "✨ 💖 🌸 💍 🥂",
      rsvp: '<i class="fa-solid fa-check-to-slot"></i>'
    },
    design: {
      bgColor: "#fdfbf7",
      textColor: "#1f2937",
      font: "serif",
      titleFont: "serif",
      bgImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&opacity=0.1"
    },
    decorations: {
      topLeft: "",
      topRight: "",
      bottomLeft: "",
      bottomRight: ""
    },
    visibility: {
      quote: true,
      carousel: true,
      countdown: true,
      location: true,
      secondaryLocation: false,
      gifts: true,
      whatsapp: true,
      bgImage: false,
      fallingIcons: false,
      music: false,
      decorations: false,
      itinerary: false,
      dressCode: false,
      generalGift: false,
      generalText: false,
      rsvp: false
    }
  };

  if (id === 't-boda-02') {
    return {
      ...base,
      title: "Juliana & Carlos",
      subtitle: "Nuestra Boda",
      date: "2026-03-21T18:30",
      mainPhoto: "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000",
      quote: {
        text: "Con la bendición de Dios y de nuestros padres nos gustaría que nos acompañaras en nuestra boda",
        color: "#475569",
        font: "sans-serif",
        size: "1rem"
      },
      design: {
        ...base.design,
        bgColor: "#f1f5f9",
        textColor: "#1e293b",
        font: "sans-serif"
      },
      visibility: {
        ...base.visibility,
        bgImage: true
      }
    };
  }

  if (id === 't-xv-02') {
    return {
      ...base,
      title: "Valeria",
      subtitle: "Mis 15 Años",
      date: "2026-06-25T20:00",
      mainPhoto: "https://images.unsplash.com/photo-1595955054117-7e61a00a0d69?q=80&w=1000",
      quote: {
        text: "Te espero para celebrar conmigo",
        color: "#ffffff",
        font: "serif",
        size: "1.2rem"
      },
      design: {
        ...base.design,
        bgColor: "#14532d",
        textColor: "#ffffff",
        font: "serif",
        bgImage: ""
      },
      emojis: {
        ...base.emojis,
        falling: "✨ 🦋 🌸 💚"
      },
      decorations: {
        topLeft: "https://cdn-icons-png.flaticon.com/512/6122/6122561.png",
        topRight: "https://cdn-icons-png.flaticon.com/512/6122/6122561.png",
        bottomLeft: "",
        bottomRight: ""
      },
      visibility: {
        ...base.visibility,
        fallingIcons: true,
        bgImage: false,
        decorations: true
      }
    };
  }

  if (id === 't-boda-03') {
    return {
      ...base,
      title: "Mariana & Andrés",
      subtitle: "Nuestra Boda",
      date: "2026-07-20T17:00",
      mainPhoto: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
      design: {
        ...base.design,
        bgColor: "#0f172a",
        textColor: "#f472b6",
        font: "serif",
        bgImage: ""
      },
      countdownDesign: {
        bgColor: "#f472b6",
        textColor: "#0f172a",
        font: "serif"
      },
      emojis: {
        ...base.emojis,
        falling: "✨ 💜 💫 🥂"
      },
      visibility: {
        ...base.visibility,
        fallingIcons: true,
        bgImage: false
      }
    };
  }

  if (id === 't-boda-04') {
    return {
      ...base,
      title: "Miguel & Cristina",
      subtitle: "¡Contamos contigo!",
      date: "2026-09-19T16:15",
      mainPhoto: "https://images.unsplash.com/photo-1597148563725-7bc096738c64?q=80&w=1000",
      quote: {
        text: "Con la bendición de Dios y de nuestros padres cariñosamente nos invitan a su matrimonio",
        color: "#422006",
        font: "'Dancing Script', cursive",
        size: "1.4rem"
      },
      design: {
        ...base.design,
        bgColor: "#fefce8",
        textColor: "#713f12",
        font: "serif",
        bgImage: ""
      },
      countdownDesign: {
        bgColor: "#ca8a04",
        textColor: "#ffffff",
        font: "sans-serif"
      },
      visibility: {
        ...base.visibility,
        bgImage: false
      }
    };
  }

  if (id === 't-baby-shower') {
    return {
      ...base,
      title: "Baby Shower",
      subtitle: "Esperando con amor a nuestra pequeña",
      date: "2026-10-10T16:00",
      mainPhoto: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000",
      quote: {
        text: "Grettell Georgina",
        color: "#6C4B49",
        font: "'Great Vibes', cursive",
        size: "2.5rem"
      },
      design: {
        ...base.design,
        bgColor: "#FFF5F5",
        textColor: "#6C4B49",
        font: "'Montserrat', sans-serif",
        bgImage: ""
      },
      countdownDesign: {
        bgColor: "rgba(255, 255, 255, 0.45)",
        textColor: "#6C4B49",
        font: "'Montserrat', sans-serif"
      },
      emojis: {
        ...base.emojis,
        falling: "☁️ 💖 ✨ 🌸"
      },
      visibility: {
        ...base.visibility,
        fallingIcons: true,
        bgImage: false,
        decorations: false
      }
    };
  }

  if (id.includes('xv')) {
    return {
      ...base,
      title: "Mis XV Años",
      subtitle: "Sofía",
      mainPhoto: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000",
      design: { ...base.design, bgColor: "#ffe4e6", textColor: "#9f1239" }
    };
  }

  if (id.includes('bautizo')) {
    return {
      ...base,
      title: "Mi Bautizo",
      subtitle: "Mateo",
      mainPhoto: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000",
      design: { ...base.design, bgColor: "#e0f2fe", textColor: "#0369a1" }
    };
  }

  return base;
};
