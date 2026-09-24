import { TemplateData, SectionBlock, SectionBlockType } from './types';

export function createDefaultSection(type: SectionBlockType, customData: Record<string, any> = {}): SectionBlock {
  const id = `${type}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  switch (type) {
    case 'hero':
      return {
        id,
        type: 'hero',
        title: 'Portada Principal',
        visible: true,
        data: {
          title: customData.title || 'Nuestra Boda',
          subtitle: customData.subtitle || 'María & Juan',
          badgeText: customData.badgeText || '¡Te invitamos a celebrar!',
          mainPhoto: customData.mainPhoto || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
          overlayDarkness: customData.overlayDarkness !== undefined ? customData.overlayDarkness : 0.45,
          style: customData.style || 'classic',
        }
      };

    case 'quote':
      return {
        id,
        type: 'quote',
        title: 'Frase / Dedicatoria',
        visible: true,
        data: {
          text: customData.text || 'Gracias por ser parte de este momento tan especial en nuestras vidas.',
          author: customData.author || '',
          font: customData.font || 'serif',
          color: customData.color || '',
          size: customData.size || '1.25rem',
          italic: customData.italic !== false,
          cardStyle: customData.cardStyle || 'minimal',
        }
      };

    case 'countdown':
      return {
        id,
        type: 'countdown',
        title: 'Cuenta Regresiva',
        visible: true,
        data: {
          label: customData.label || 'Faltan',
          targetDate: customData.targetDate || '2026-12-31T18:00',
          bgColor: customData.bgColor || 'rgba(0, 0, 0, 0.15)',
          textColor: customData.textColor || '',
          font: customData.font || 'sans-serif',
          style: customData.style || 'boxes',
        }
      };

    case 'datetime':
      return {
        id,
        type: 'datetime',
        title: 'Fecha & Horario',
        visible: true,
        data: {
          title: customData.title || '¿Cuándo?',
          icon: customData.icon || '📅',
          date: customData.date || '2026-12-31T18:00',
          note: customData.note || 'Favor de ser puntuales',
        }
      };

    case 'carousel':
      return {
        id,
        type: 'carousel',
        title: 'Galería de Fotos',
        visible: true,
        data: {
          title: customData.title || 'Nuestros Momentos',
          icon: customData.icon || '📸',
          photos: customData.photos || [
            'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800',
          ],
          interval: 5,
        }
      };

    case 'photoFrame':
      return {
        id,
        type: 'photoFrame',
        title: 'Foto Destacada',
        visible: true,
        data: {
          photoUrl: customData.photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
          caption: customData.caption || 'Juntos por siempre',
          shape: customData.shape || 'polaroid',
        }
      };

    case 'location':
      return {
        id,
        type: 'location',
        title: 'Ubicación Principal',
        visible: true,
        data: {
          title: customData.title || 'Recepción & Banquete',
          icon: customData.icon || '📍',
          name: customData.name || 'Hacienda San José',
          address: customData.address || 'Carretera Nacional Km 250, Monterrey, N.L.',
          locationUrl: customData.locationUrl || 'https://maps.google.com/?q=Hacienda+San+Jose',
          btnText: customData.btnText || 'Abrir en Google Maps',
        }
      };

    case 'secondaryLocation':
      return {
        id,
        type: 'secondaryLocation',
        title: 'Ceremonia Religiosa / Civil',
        visible: true,
        data: {
          title: customData.title || 'Ceremonia Religiosa',
          icon: customData.icon || '⛪',
          name: customData.name || 'Parroquia Nuestra Señora de Guadalupe',
          address: customData.address || 'Centro Histórico',
          locationUrl: customData.locationUrl || 'https://maps.google.com',
          btnText: customData.btnText || 'Abrir en Google Maps',
        }
      };

    case 'itinerary':
      return {
        id,
        type: 'itinerary',
        title: 'Itinerario / Cronograma',
        visible: true,
        data: {
          title: customData.title || 'Itinerario del Evento',
          icon: customData.icon || '📋',
          items: customData.items || [
            { id: 1, time: '17:00 hs', title: 'Ceremonia Religiosa', icon: '💍' },
            { id: 2, time: '18:30 hs', title: 'Recepción & Cóctel', icon: '🥂' },
            { id: 3, time: '20:00 hs', title: 'Cena & Banquete', icon: '🍽️' },
            { id: 4, time: '21:30 hs', title: 'Vals de los Novios', icon: '✨' },
            { id: 5, time: '22:30 hs', title: 'Apertura de Pista & Fiesta', icon: '🎵' },
          ],
        }
      };

    case 'dressCode':
      return {
        id,
        type: 'dressCode',
        title: 'Código de Vestimenta',
        visible: true,
        data: {
          title: customData.title || 'Código de Vestimenta',
          icon: customData.icon || '👗',
          general: customData.general || 'Rigurosa Etiqueta / Formal',
          him: customData.him || 'Traje oscuro y corbata',
          her: customData.her || 'Vestido largo de noche',
          note: customData.note || 'Nos reservamos el color blanco y beige para la novia.',
          palette: customData.palette || ['#1E293B', '#334155', '#475569', '#64748B'],
        }
      };

    case 'gifts':
      return {
        id,
        type: 'gifts',
        title: 'Mesa de Regalos',
        visible: true,
        data: {
          title: customData.title || 'Mesa de Regalos',
          icon: customData.icon || '🎁',
          message: customData.message || 'Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, te dejamos nuestras mesas:',
          stores: customData.stores || [
            { id: 1, store: 'Liverpool', url: 'https://liverpool.com.mx' },
            { id: 2, store: 'Amazon México', url: 'https://amazon.com.mx' },
          ],
        }
      };

    case 'bankDetails':
      return {
        id,
        type: 'bankDetails',
        title: 'Datos Bancarios / Sobres',
        visible: true,
        data: {
          title: customData.title || 'Lluvia de Sobres / Transferencia',
          icon: customData.icon || '✉️',
          notes: customData.notes || 'Si prefieres realizarnos una aportación económica para nuestra luna de miel, puedes hacerlo a esta cuenta:',
          bankName: customData.bankName || 'BBVA Bancomer',
          clabe: customData.clabe || '012180001234567890',
          accountHolder: customData.accountHolder || 'María & Juan',
        }
      };

    case 'generalText':
      return {
        id,
        type: 'generalText',
        title: 'Nota o Mensaje Libre',
        visible: true,
        data: {
          title: customData.title || 'Información Importante',
          icon: customData.icon || '💡',
          content: customData.content || 'Agradecemos de antemano su puntualidad y consideración. Hemos preparado una velada inolvidable para todos.',
          align: customData.align || 'center',
        }
      };

    case 'whatsappRsvp':
      return {
        id,
        type: 'whatsappRsvp',
        title: 'Confirmación WhatsApp',
        visible: true,
        data: {
          title: customData.title || 'Confirmación de Asistencia',
          icon: customData.icon || '💬',
          phone: customData.phone || '521234567890',
          confirmText: customData.confirmText || '✓ Confirmar por WhatsApp',
          declineText: customData.declineText || '✕ No podré asistir',
          confirmMessage: customData.confirmMessage || '¡Hola! Confirmo la asistencia de {{nombre}} al evento {{evento}}. ¡Ahí nos vemos!',
          declineMessage: customData.declineMessage || '¡Hola! Lamentablemente {{nombre}} no podré asistir al evento {{evento}}. ¡Muchas gracias!',
        }
      };

    case 'rsvpForm':
      return {
        id,
        type: 'rsvpForm',
        title: 'Formulario de Asistencia Web',
        visible: true,
        data: {
          title: customData.title || 'Pase de Invitados & RSVP',
          icon: customData.icon || '🎟️',
          rsvpPhone: customData.rsvpPhone || '',
          instruction: customData.instruction || 'Por favor confirma el número de asistentes antes de la fecha límite.',
        }
      };

    default:
      return {
        id,
        type: 'generalText',
        title: 'Bloque Libre',
        visible: true,
        data: customData,
      };
  }
}

// Objeto base completamente poblado con tipos no-opcionales
function getBaseTemplate(): TemplateData {
  const baseSections: SectionBlock[] = [
    createDefaultSection('hero', {
      title: 'Nuestra Boda',
      subtitle: 'María & Juan',
      mainPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
    }),
    createDefaultSection('quote', {
      text: 'Con la bendición de Dios y de nuestros padres cariñosamente los invitamos a compartir nuestra alegría.',
      font: "'Playfair Display', serif",
      size: '1.2rem',
    }),
    createDefaultSection('countdown', {
      label: 'Faltan',
      targetDate: '2026-12-31T18:00',
      bgColor: '#1f2937',
      textColor: '#fdfbf7',
      font: 'sans-serif',
    }),
    createDefaultSection('datetime', {
      date: '2026-12-31T18:00',
      title: '¿Cuándo?',
    }),
    createDefaultSection('carousel', {
      title: 'Nuestros Momentos',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800',
      ],
    }),
    createDefaultSection('itinerary', {
      title: 'Itinerario',
      items: [
        { id: 1, time: '17:00 hs', title: 'Ceremonia Religiosa', icon: '💍' },
        { id: 2, time: '18:30 hs', title: 'Recepción & Cóctel', icon: '🥂' },
        { id: 3, time: '20:00 hs', title: 'Cena & Banquete', icon: '🍽️' },
        { id: 4, time: '22:00 hs', title: 'Baile & Fiesta', icon: '🎵' },
      ],
    }),
    createDefaultSection('location', {
      name: 'Hacienda San José',
      address: 'Carretera Nacional Km 250',
      locationUrl: 'https://maps.google.com/?q=Hacienda+San+Jose',
    }),
    createDefaultSection('dressCode', {
      general: 'Formal Elegante',
      him: 'Traje oscuro',
      her: 'Vestido largo de fiesta',
    }),
    createDefaultSection('gifts', {
      stores: [{ id: 1, store: 'Liverpool', url: 'https://liverpool.com.mx' }],
    }),
    createDefaultSection('bankDetails', {
      notes: '¡Tu presencia es nuestro mejor regalo! Si deseas tener un detalle adicional en efectivo:',
      bankName: 'BBVA',
      clabe: '012180001234567890',
      accountHolder: 'María & Juan',
    }),
    createDefaultSection('whatsappRsvp', {
      phone: '521234567890',
      confirmMessage: '¡Hola! Confirmo la asistencia al evento. ¡Ahí nos vemos!',
    }),
  ];

  return {
    eventName: 'Mi Nuevo Evento',
    title: 'Nuestra Boda',
    subtitle: 'María & Juan',
    date: '2026-12-31T18:00',
    sections: baseSections,
    design: {
      bgColor: '#fdfbf7',
      textColor: '#1f2937',
      font: 'serif',
      titleFont: 'serif',
      bgImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&opacity=0.1',
      accentColor: '#6366f1',
    },
    music: '',
    emojis: {
      countdown: '⏳',
      carousel: '📸',
      itinerary: '📋',
      location: '📍',
      secondaryLocation: '⛪',
      gifts: '🎁',
      dressCode: '👗',
      generalGift: '✉️',
      generalText: '💬',
      whatsapp: '💬',
      falling: '✨ 💖 🌸 💍 🥂',
      rsvp: '🎟️',
    },
    decorations: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
    countdownDesign: {
      bgColor: '#1f2937',
      textColor: '#fdfbf7',
      font: 'sans-serif',
    },
    location: 'Hacienda San José',
    address: 'Carretera Nacional Km 250',
    locationUrl: 'https://maps.google.com/?q=Hacienda+San+Jose',
    secondaryLocation: '',
    secondaryAddress: '',
    secondaryLocationUrl: '',
    whatsapp: '521234567890',
    whatsappMessage: '¡Hola! Confirmo la asistencia de {{nombre}} a {{evento}}. ¡Ahí nos vemos!',
    whatsappDeclineMessage: '¡Hola! Lamentablemente {{nombre}} no podrá asistir a {{evento}}. ¡Gracias por la invitación!',
    rsvpPhone: '',
    rsvpContacts: [],
    mainPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
    carouselPhotos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800',
    ],
    itinerary: [
      { id: 1, time: '17:00 hs', title: 'Ceremonia Religiosa', icon: '💍' },
      { id: 2, time: '18:30 hs', title: 'Recepción & Cóctel', icon: '🥂' },
      { id: 3, time: '20:00 hs', title: 'Cena & Banquete', icon: '🍽️' },
      { id: 4, time: '22:00 hs', title: 'Baile & Fiesta', icon: '🎵' },
    ],
    gifts: [
      { id: 1, store: 'Liverpool', url: 'https://liverpool.com.mx' },
    ],
    dressCode: {
      him: 'Traje oscuro',
      her: 'Vestido largo de fiesta',
      general: 'Formal Elegante',
    },
    generalGift: '¡Tu presencia es nuestro mejor regalo! Si deseas tener un detalle adicional en efectivo:',
    generalText: 'Nota adicional para nuestros invitados.',
    quote: {
      text: 'Con la bendición de Dios y de nuestros padres cariñosamente los invitamos a compartir nuestra alegría.',
      font: "'Playfair Display', serif",
      color: '#1f2937',
      size: '1.2rem',
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
      fallingIcons: true,
      music: false,
      decorations: false,
      itinerary: true,
      dressCode: true,
      generalGift: true,
      generalText: false,
      rsvp: false,
    },
  };
}

export function normalizeTemplateData(raw: any, templateId: string = 't-boda-01'): TemplateData {
  const base = getBaseTemplate();

  if (!raw) {
    return getDefaultData(templateId);
  }

  // Si ya tiene el array de sections y es válido
  if (Array.isArray(raw.sections) && raw.sections.length > 0) {
    return {
      ...base,
      ...raw,
      sections: raw.sections,
      design: {
        ...base.design,
        ...(raw.design || {}),
      },
      emojis: {
        ...base.emojis,
        ...(raw.emojis || {}),
      },
      decorations: {
        ...base.decorations,
        ...(raw.decorations || {}),
      },
      countdownDesign: {
        ...base.countdownDesign,
        ...(raw.countdownDesign || {}),
      },
      quote: {
        ...base.quote,
        ...(raw.quote || {}),
      },
      dressCode: {
        ...base.dressCode,
        ...(raw.dressCode || {}),
      },
      visibility: {
        ...base.visibility,
        ...(raw.visibility || {}),
      },
      carouselPhotos: raw.carouselPhotos || base.carouselPhotos,
      itinerary: raw.itinerary || base.itinerary,
      gifts: raw.gifts || base.gifts,
    };
  }

  // --- MIGRACIÓN DE DATOS LEGACY A SECCIONES MODULARES ---
  const sections: SectionBlock[] = [];

  // 1. Portada Hero
  sections.push(createDefaultSection('hero', {
    title: raw.title || base.title,
    subtitle: raw.subtitle || base.subtitle,
    mainPhoto: raw.mainPhoto || base.mainPhoto,
    date: raw.date || base.date,
  }));

  // 2. Frase / Dedicatoria
  if (raw.quote?.text) {
    const qBlock = createDefaultSection('quote', {
      text: raw.quote.text,
      font: raw.quote.font || raw.design?.font || 'serif',
      color: raw.quote.color || raw.design?.textColor || '#1f2937',
      size: raw.quote.size || '1.25rem',
    });
    qBlock.visible = raw.visibility?.quote !== false;
    sections.push(qBlock);
  }

  // 3. Cuenta Regresiva
  if (raw.visibility?.countdown !== false) {
    const cdBlock = createDefaultSection('countdown', {
      targetDate: raw.date || base.date,
      bgColor: raw.countdownDesign?.bgColor || raw.design?.textColor || '#1f2937',
      textColor: raw.countdownDesign?.textColor || raw.design?.bgColor || '#fdfbf7',
      font: raw.countdownDesign?.font || raw.design?.font || 'sans-serif',
    });
    cdBlock.visible = raw.visibility?.countdown ?? true;
    sections.push(cdBlock);
  }

  // 4. Fecha del Evento
  if (raw.date) {
    sections.push(createDefaultSection('datetime', {
      date: raw.date,
      title: '¿Cuándo?',
    }));
  }

  // 5. Carrusel de Fotos
  if (raw.carouselPhotos && raw.carouselPhotos.length > 0) {
    const cBlock = createDefaultSection('carousel', {
      photos: raw.carouselPhotos,
      icon: raw.emojis?.carousel || '📸',
    });
    cBlock.visible = raw.visibility?.carousel !== false;
    sections.push(cBlock);
  }

  // 6. Itinerario
  if (raw.itinerary && raw.itinerary.length > 0) {
    const itBlock = createDefaultSection('itinerary', {
      items: raw.itinerary,
      icon: raw.emojis?.itinerary || '📋',
    });
    itBlock.visible = raw.visibility?.itinerary !== false;
    sections.push(itBlock);
  }

  // 7. Ubicación Principal
  if (raw.location) {
    const locBlock = createDefaultSection('location', {
      name: raw.location,
      address: raw.address || '',
      locationUrl: raw.locationUrl || '',
      icon: raw.emojis?.location || '📍',
    });
    locBlock.visible = raw.visibility?.location !== false;
    sections.push(locBlock);
  }

  // 8. Ubicación Secundaria
  if (raw.secondaryLocation) {
    const secBlock = createDefaultSection('secondaryLocation', {
      name: raw.secondaryLocation,
      address: raw.secondaryAddress || '',
      locationUrl: raw.secondaryLocationUrl || '',
      icon: raw.emojis?.secondaryLocation || '⛪',
    });
    secBlock.visible = raw.visibility?.secondaryLocation !== false;
    sections.push(secBlock);
  }

  // 9. Código de Vestimenta
  if (raw.dressCode && (raw.dressCode.him || raw.dressCode.her || raw.dressCode.general)) {
    const dressBlock = createDefaultSection('dressCode', {
      him: raw.dressCode.him || '',
      her: raw.dressCode.her || '',
      general: raw.dressCode.general || '',
      icon: raw.emojis?.dressCode || '👗',
    });
    dressBlock.visible = raw.visibility?.dressCode !== false;
    sections.push(dressBlock);
  }

  // 10. Mesa de Regalos
  if (raw.gifts && raw.gifts.length > 0) {
    const gBlock = createDefaultSection('gifts', {
      stores: raw.gifts,
      icon: raw.emojis?.gifts || '🎁',
    });
    gBlock.visible = raw.visibility?.gifts !== false;
    sections.push(gBlock);
  }

  // 11. Datos Bancarios / Lluvia de Sobres
  if (raw.generalGift) {
    const bankBlock = createDefaultSection('bankDetails', {
      notes: raw.generalGift,
      icon: raw.emojis?.generalGift || '✉️',
    });
    bankBlock.visible = raw.visibility?.generalGift !== false;
    sections.push(bankBlock);
  }

  // 12. Mensaje libre
  if (raw.generalText) {
    const txtBlock = createDefaultSection('generalText', {
      content: raw.generalText,
      icon: raw.emojis?.generalText || '💬',
    });
    txtBlock.visible = raw.visibility?.generalText !== false;
    sections.push(txtBlock);
  }

  // 13. Confirmación WhatsApp
  if (raw.whatsapp || raw.visibility?.whatsapp) {
    const waBlock = createDefaultSection('whatsappRsvp', {
      phone: raw.whatsapp || '',
      confirmMessage: raw.whatsappMessage || '',
      declineMessage: raw.whatsappDeclineMessage || '',
      icon: raw.emojis?.whatsapp || '💬',
    });
    waBlock.visible = raw.visibility?.whatsapp !== false;
    sections.push(waBlock);
  }

  // 14. Formulario RSVP
  if (raw.visibility?.rsvp) {
    sections.push(createDefaultSection('rsvpForm', {
      rsvpPhone: raw.rsvpPhone || raw.whatsapp || '',
      icon: raw.emojis?.rsvp || '🎟️',
    }));
  }

  return {
    ...base,
    ...raw,
    sections,
    design: {
      ...base.design,
      ...(raw.design || {}),
    },
    emojis: {
      ...base.emojis,
      ...(raw.emojis || {}),
    },
    decorations: {
      ...base.decorations,
      ...(raw.decorations || {}),
    },
    countdownDesign: {
      ...base.countdownDesign,
      ...(raw.countdownDesign || {}),
    },
    quote: {
      ...base.quote,
      ...(raw.quote || {}),
    },
    dressCode: {
      ...base.dressCode,
      ...(raw.dressCode || {}),
    },
    visibility: {
      ...base.visibility,
      ...(raw.visibility || {}),
    },
    carouselPhotos: raw.carouselPhotos || base.carouselPhotos,
    itinerary: raw.itinerary || base.itinerary,
    gifts: raw.gifts || base.gifts,
  };
}

export const getDefaultData = (id: string): TemplateData => {
  const base = getBaseTemplate();

  // Lienzo en blanco
  if (id === 'blank') {
    return {
      ...base,
      eventName: 'Nuevo Proyecto En Blanco',
      title: 'Mi Gran Evento',
      subtitle: 'Celebración Especial',
      date: '2026-12-31T18:00',
      sections: [
        createDefaultSection('hero', {
          title: 'Mi Gran Evento',
          subtitle: 'Celebración Especial',
          mainPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
        }),
      ],
      design: {
        bgColor: '#0f172a',
        textColor: '#f8fafc',
        font: 'sans-serif',
        titleFont: 'serif',
        bgImage: '',
        accentColor: '#38bdf8',
      },
    };
  }

  // Plantilla Baby Shower (Inspirada en el conejito tierno de CP1500 Studio)
  if (id === 't-baby-shower') {
    return {
      ...base,
      title: 'Baby Shower',
      subtitle: 'Esperando con amor a nuestra pequeña',
      date: '2026-10-10T16:00',
      design: {
        bgColor: '#FFF5F5',
        textColor: '#6C4B49',
        font: "'Montserrat', sans-serif",
        titleFont: "'Great Vibes', cursive",
        bgImage: '',
        accentColor: '#e11d48',
      },
      emojis: {
        ...base.emojis,
        falling: '☁️ 💖 ✨ 🌸 🐰',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Baby Shower',
          subtitle: 'Grettell Georgina',
          badgeText: '¡Te invitamos a celebrar!',
          mainPhoto: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Un rayito de luz y amor está por llegar a nuestras vidas para llenarlas de alegría.',
          font: "'Great Vibes', cursive",
          color: '#6C4B49',
          size: '2.2rem',
        }),
        createDefaultSection('countdown', {
          label: 'Faltan para conocerla',
          targetDate: '2026-10-10T16:00',
          bgColor: 'rgba(255, 255, 255, 0.7)',
          textColor: '#6C4B49',
          font: "'Montserrat', sans-serif",
        }),
        createDefaultSection('datetime', {
          date: '2026-10-10T16:00',
          title: '¿Cuándo?',
        }),
        createDefaultSection('location', {
          name: 'Jardín de Eventos Las Nubes',
          address: 'Av. Primavera #450',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('gifts', {
          title: 'Sugerencias de Regalo',
          stores: [
            { id: 1, store: 'Mesa de Regalos Liverpool', url: 'https://liverpool.com.mx' },
            { id: 2, store: 'Amazon Baby Registry', url: 'https://amazon.com.mx' },
          ],
        }),
        createDefaultSection('bankDetails', {
          title: 'Lluvia de Sobres / Pañales',
          notes: 'Etapa de pañales sugerida: Etapa 2 y 3. Si deseas apoyarnos con sobre, habrá un buzón el día del evento.',
        }),
        createDefaultSection('whatsappRsvp', {
          phone: '521234567890',
          confirmMessage: '¡Hola! Confirmo mi asistencia al Baby Shower de Grettell Georgina.',
        }),
      ],
    };
  }

  // Plantilla XV Años
  if (id.includes('xv') || id === 't-xv-01') {
    return {
      ...base,
      title: 'Mis XV Años',
      subtitle: 'Sofía Valenzuela',
      date: '2026-08-15T19:00',
      design: {
        bgColor: '#ffe4e6',
        textColor: '#881337',
        font: "'Playfair Display', serif",
        titleFont: "'Dancing Script', cursive",
        bgImage: '',
        accentColor: '#db2777',
      },
      emojis: {
        ...base.emojis,
        falling: '✨ 👑 💖 🌸 🦋',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Mis XV Años',
          subtitle: 'Sofía Valenzuela',
          badgeText: 'Una noche mágica',
          mainPhoto: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con quienes más quiero los hace inolvidables.',
          font: "'Dancing Script', cursive",
          size: '1.6rem',
        }),
        createDefaultSection('countdown', {
          label: 'Faltan para la gran noche',
          targetDate: '2026-08-15T19:00',
          bgColor: '#881337',
          textColor: '#ffffff',
        }),
        createDefaultSection('datetime', {
          date: '2026-08-15T19:00',
        }),
        createDefaultSection('carousel', {
          title: 'Sesión Fotográfica',
          photos: [
            'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
          ],
        }),
        createDefaultSection('location', {
          name: 'Salón de Eventos Esplendor',
          address: 'Boulevard del Sol #1200',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('dressCode', {
          general: 'Rigurosa Etiqueta',
          note: 'Se reserva el color palo de rosa para la quinceañera.',
        }),
        createDefaultSection('whatsappRsvp', {
          phone: '521234567890',
        }),
      ],
    };
  }

  // Plantilla Boda Playa
  if (id === 't-boda-02') {
    return {
      ...base,
      title: 'Juliana & Carlos',
      subtitle: 'Nuestra Boda en la Playa',
      date: '2026-03-21T17:30',
      design: {
        bgColor: '#f0fdfa',
        textColor: '#0f766e',
        font: 'sans-serif',
        titleFont: "'Playfair Display', serif",
        bgImage: '',
        accentColor: '#0d9488',
      },
      emojis: {
        ...base.emojis,
        falling: '🌴 ✨ 🌊 💍 🐚',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Juliana & Carlos',
          subtitle: 'Nuestra Boda en la Playa',
          mainPhoto: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Frente al mar y bajo el atardecer, prometemos amarnos por siempre.',
          font: "'Playfair Display', serif",
        }),
        createDefaultSection('countdown', {
          targetDate: '2026-03-21T17:30',
          bgColor: '#0f766e',
          textColor: '#ffffff',
        }),
        createDefaultSection('datetime', { date: '2026-03-21T17:30' }),
        createDefaultSection('location', {
          name: 'Hotel Playa Paraíso Resort',
          address: 'Playa del Carmen, Quintana Roo',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('dressCode', {
          general: 'Guayabera y Vestido Playero',
          him: 'Guayabera blanca o lino claro',
          her: 'Vestido fresco y calzado cómodo para arena',
        }),
        createDefaultSection('whatsappRsvp', { phone: '521234567890' }),
      ],
    };
  }

  // Plantilla Boda Dark Night
  if (id === 't-boda-03') {
    return {
      ...base,
      title: 'Mariana & Andrés',
      subtitle: 'Noche de Bodas',
      date: '2026-07-20T19:00',
      design: {
        bgColor: '#090d16',
        textColor: '#f1f5f9',
        font: 'serif',
        titleFont: "'Cinzel', serif",
        bgImage: '',
        accentColor: '#a855f7',
      },
      emojis: {
        ...base.emojis,
        falling: '✨ 💜 💫 🥂 🌙',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Mariana & Andrés',
          subtitle: 'Nuestra Boda',
          mainPhoto: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Bajo las estrellas y la luna sellamos nuestro pacto de amor.',
          font: "'Cinzel', serif",
        }),
        createDefaultSection('countdown', {
          targetDate: '2026-07-20T19:00',
          bgColor: '#a855f7',
          textColor: '#ffffff',
        }),
        createDefaultSection('datetime', { date: '2026-07-20T19:00' }),
        createDefaultSection('location', {
          name: 'Quinta Las Luces',
          address: 'Valle Alto #500',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('whatsappRsvp', { phone: '521234567890' }),
      ],
    };
  }

  // Plantilla Boda Girasoles (Pro)
  if (id === 't-boda-04') {
    return {
      ...base,
      title: 'Miguel & Cristina',
      subtitle: '¡Contamos contigo!',
      date: '2026-09-19T16:15',
      design: {
        bgColor: '#fefce8',
        textColor: '#713f12',
        font: 'serif',
        titleFont: "'Dancing Script', cursive",
        bgImage: '',
        accentColor: '#eab308',
      },
      emojis: {
        ...base.emojis,
        falling: '🌻 ✨ 💛 🥂 🌸',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Miguel & Cristina',
          subtitle: '¡Contamos contigo!',
          mainPhoto: 'https://images.unsplash.com/photo-1597148563725-7bc096738c64?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Con la bendición de Dios y de nuestros padres cariñosamente los invitamos a nuestro matrimonio.',
          font: "'Dancing Script', cursive",
          size: '1.4rem',
        }),
        createDefaultSection('countdown', {
          targetDate: '2026-09-19T16:15',
          bgColor: '#ca8a04',
          textColor: '#ffffff',
        }),
        createDefaultSection('datetime', { date: '2026-09-19T16:15' }),
        createDefaultSection('carousel', {
          title: 'Nuestros Momentos',
          photos: [
            'https://images.unsplash.com/photo-1597148563725-7bc096738c64?q=80&w=800',
            'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
          ],
        }),
        createDefaultSection('location', {
          name: 'Hacienda El Girasol',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('whatsappRsvp', { phone: '521234567890' }),
      ],
    };
  }

  // Plantilla Bautizo
  if (id.includes('bautizo') || id === 't-bautizo-01') {
    return {
      ...base,
      title: 'Mi Bautizo',
      subtitle: 'Mateo Alejandro',
      date: '2026-11-20T12:00',
      design: {
        bgColor: '#e0f2fe',
        textColor: '#0369a1',
        font: 'serif',
        titleFont: "'Playfair Display', serif",
        bgImage: '',
        accentColor: '#0284c7',
      },
      emojis: {
        ...base.emojis,
        falling: '🕊️ ✨ 🤍 👼 💧',
      },
      sections: [
        createDefaultSection('hero', {
          title: 'Mi Bautizo',
          subtitle: 'Mateo Alejandro',
          badgeText: 'Recibiendo el sacramento de Dios',
          mainPhoto: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000',
        }),
        createDefaultSection('quote', {
          text: 'Señor, guía mis pasos con tu luz y bendice a mi familia y padrinos.',
          font: "'Playfair Display', serif",
        }),
        createDefaultSection('datetime', { date: '2026-11-20T12:00' }),
        createDefaultSection('location', {
          name: 'Parroquia Sagrado Corazón',
          address: 'Plaza Principal #100',
          locationUrl: 'https://maps.google.com',
        }),
        createDefaultSection('whatsappRsvp', { phone: '521234567890' }),
      ],
    };
  }

  return base;
};
