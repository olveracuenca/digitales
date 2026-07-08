import { PrismaClient } from "@prisma/client";
import styles from "../../templates/[id]/edit/editor.module.css";
import { notFound } from "next/navigation";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import { MapPin } from "lucide-react";

const prisma = new PrismaClient();

export default async function PublicInvitation({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const sp = await searchParams;
  
  // 1. Buscar la invitación en la base de datos
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  // 2. Si no existe o no está publicada, mostrar 404
  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  // 3. Extraer y parsear la configuración JSON
  const data = JSON.parse(invitation.data);

  // Mensajes predefinidos para WhatsApp
  const eventTitle = data.title || "el evento";
  let confirmMsg = encodeURIComponent(`¡Hola! Confirmo mi asistencia a ${eventTitle}. ¡Ahí nos vemos!`);
  let declineMsg = encodeURIComponent(`¡Hola! Lamentablemente no podré asistir a ${eventTitle}. ¡Gracias por la invitación!`);

  if (typeof sp.p === 'string') {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(sp.p)));
      if (decoded.n) {
        confirmMsg = encodeURIComponent(`¡Hola! Confirmo la asistencia de ${decoded.n}${decoded.q ? ` (${decoded.q} pases)` : ''} a ${eventTitle}. ¡Ahí nos vemos!`);
        declineMsg = encodeURIComponent(`¡Hola! Lamentablemente la familia/invitado ${decoded.n} no podrá asistir a ${eventTitle}. ¡Gracias por la invitación!`);
      }
    } catch (e) {
      // Ignore
    }
  } else if (typeof sp.n === 'string') {
    confirmMsg = encodeURIComponent(`¡Hola! Confirmo la asistencia de ${sp.n}${sp.q ? ` (${sp.q} pases)` : ''} a ${eventTitle}. ¡Ahí nos vemos!`);
    declineMsg = encodeURIComponent(`¡Hola! Lamentablemente la familia/invitado ${sp.n} no podrá asistir a ${eventTitle}. ¡Gracias por la invitación!`);
  }

  // --- PLANTILLA t-xv-02 (Pantalla Única Sin Scroll) ---
  if (invitation.templateId === 't-xv-02') {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '100vh', 
          overflow: 'hidden', 
          backgroundColor: data.design.bgColor, 
          color: data.design.textColor,
          fontFamily: data.design.font,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Decoraciones Editables */}
        {data.visibility.decorations && (
          <>
            {data.decorations?.topLeft && <img src={data.decorations.topLeft} alt="" style={{position: 'absolute', top: '10px', left: '10px', width: '120px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.topRight && <img src={data.decorations.topRight} alt="" style={{position: 'absolute', top: '10px', right: '10px', width: '120px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.bottomLeft && <img src={data.decorations.bottomLeft} alt="" style={{position: 'absolute', bottom: '10px', left: '10px', width: '120px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.bottomRight && <img src={data.decorations.bottomRight} alt="" style={{position: 'absolute', bottom: '10px', right: '10px', width: '120px', zIndex: 20, pointerEvents: 'none'}} />}
          </>
        )}

        {data.visibility.fallingIcons && <FallingIcons iconString={data.emojis.falling} />}
        {data.visibility.music && data.music && <AudioPlayer src={data.music} />}

        {/* Top Half - Image */}
        <div style={{
          height: '45%',
          width: '100%',
          backgroundImage: `url(${data.mainPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 10
        }}></div>

        {/* Bottom Half - Content */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem', width: '100%', flex: 1, justifyContent: 'center' }}>
          <h4 style={{ fontFamily: data.design.font, fontSize: '1.25rem', letterSpacing: '0.1em', opacity: 0.9, marginBottom: '0.5rem' }}>{data.subtitle}</h4>
          <h1 style={{ fontFamily: data.design.font, fontSize: '3.5rem', fontWeight: 700, margin: '0 0 1rem 0', lineHeight: 1.1 }}>{data.title}</h1>
          
          <div style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p style={{ fontSize: '1.1rem' }}>
              {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {data.visibility.quote && (
            <p style={{ fontFamily: data.quote.font, fontSize: data.quote.size || '1.1rem', marginBottom: '2rem', fontStyle: 'italic', maxWidth: '400px' }}>
              "{data.quote.text}"
            </p>
          )}

          {data.visibility.countdown && (
            <div style={{ transform: 'scale(0.85)', marginBottom: '2rem' }}>
               <Countdown 
                  targetDate={data.date} 
                  bgColor={data.countdownDesign?.bgColor || 'rgba(255,255,255,0.2)'} 
                  textColor={data.countdownDesign?.textColor || '#ffffff'} 
                  font={data.countdownDesign?.font || data.design.font} 
                />
            </div>
          )}

          {data.visibility.itinerary && data.itinerary && data.itinerary.length > 0 && (
            <div style={{ width: '100%', maxWidth: '350px', marginBottom: '3rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{data.emojis.itinerary}</div>
              <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '1.5rem'}}>Itinerario</h3>
              
              <div style={{ position: 'relative', padding: '0.5rem 0' }}>
                {/* Línea central */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
                
                {data.itinerary.map((item: any, i: number) => (
                  <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                    {/* Icono central */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '32px', height: '32px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', zIndex: 2 }}>
                      {item.icon}
                    </div>
                    
                    {/* Contenido (Texto) */}
                    <div style={{ width: '42%', textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 1rem 0 0' : '0 0 0 1rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.time}</div>
                      <div style={{ fontSize: '0.95rem' }}>{item.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`https://wa.me/${data.whatsapp}?text=${confirmMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              ✓ Confirmar Asistencia
            </a>
            <a href={`https://wa.me/${data.whatsapp}?text=${declineMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: data.design.textColor, border: `2px solid ${data.design.textColor}50`, padding: '0.875rem 1.5rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none' }}>
              ✕ No podré asistir
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- PLANTILLAS ESTÁNDAR ---
  return (
    <div 
      style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        minHeight: '100vh', 
        backgroundColor: data.design.bgColor, 
        color: data.design.textColor,
        fontFamily: data.design.font,
        backgroundImage: data.visibility.bgImage && data.design.bgImage ? `url(${data.design.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
        position: 'relative'
      }}
    >
      {data.visibility.fallingIcons && <FallingIcons iconString={data.emojis.falling} />}
      {data.visibility.music && data.music && <AudioPlayer src={data.music} />}

      <div className={styles.previewHero} style={{ backgroundImage: `url(${data.mainPhoto})`, height: '60vh', position: 'relative', zIndex: 10 }}>
        <div className={styles.previewHeroOverlay}>
          <h4 className={styles.previewSubtitle} style={{fontFamily: data.design.font}}>{data.subtitle}</h4>
          <h1 className={styles.previewTitle} style={{fontFamily: data.design.font}}>{data.title}</h1>
        </div>
      </div>

      <div className={styles.previewBody} style={{ padding: '3rem 1.5rem', position: 'relative', zIndex: 20 }}>
        
        {data.visibility.quote && (
          <div className={styles.previewSection}>
            <p style={{
              fontFamily: data.quote.font, 
              color: data.quote.color, 
              fontSize: data.quote.size, 
              lineHeight: 1.5,
              fontStyle: data.quote.font.includes('cursive') ? 'normal' : 'italic',
              padding: '1rem'
            }}>
              "{data.quote.text}"
            </p>
          </div>
        )}

        {data.visibility.countdown && (
          <div className={styles.previewSection}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.countdown}</div>
            <h3 style={{fontFamily: data.design.font}}>Faltan</h3>
            <Countdown 
              targetDate={data.date} 
              bgColor={data.countdownDesign?.bgColor || data.design.textColor} 
              textColor={data.countdownDesign?.textColor || data.design.bgColor} 
              font={data.countdownDesign?.font || data.design.font} 
            />
          </div>
        )}

        {data.visibility.carousel && (
          <div className={styles.previewSection}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.carousel}</div>
            <h3 style={{fontFamily: data.design.font}}>Nuestros Momentos</h3>
            <AutoCarousel photos={data.carouselPhotos} />
          </div>
        )}

        {data.visibility.itinerary && data.itinerary && data.itinerary.length > 0 && (
          <div className={styles.previewSection}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.itinerary}</div>
            <h3 style={{fontFamily: data.design.font}}>Itinerario</h3>
            
            <div style={{ position: 'relative', marginTop: '2rem', padding: '1rem 0' }}>
              {/* Línea central */}
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
              
              {data.itinerary.map((item: any, i: number) => (
                <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                  {/* Icono central */}
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', zIndex: 2 }}>
                    {item.icon}
                  </div>
                  
                  {/* Contenido (Texto) */}
                  <div style={{ width: '42%', textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 1.5rem 0 0' : '0 0 0 1.5rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.time}</div>
                    <div style={{ fontSize: '1.1rem' }}>{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.visibility.location && (
          <div className={styles.previewSection}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.location}</div>
            <h3 style={{fontFamily: data.design.font}}>Ubicación</h3>
            <p style={{fontSize: '1.2rem', padding: '0 1rem'}}>{data.location}</p>
            {data.locationUrl && (
              <a href={data.locationUrl} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', 
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem', 
                padding: '0.75rem 1.5rem', 
                background: data.design.textColor, 
                color: data.design.bgColor, 
                borderRadius: '9999px', 
                textDecoration: 'none', 
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <MapPin size={20} />
                Abrir en Google Maps
              </a>
            )}
          </div>
        )}

        {data.visibility.gifts && data.gifts.length > 0 && (
          <div className={styles.previewSection}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.gifts}</div>
            <h3 style={{fontFamily: data.design.font}}>Mesa de Regalos</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', alignItems: 'center'}}>
              {data.gifts.map((g: any, i: number) => (
                g.store && (
                  <a key={i} href={g.url} target="_blank" rel="noreferrer" style={{display: 'block', width: '100%', maxWidth: '300px', padding:'1rem', background:'rgba(0,0,0,0.05)', borderRadius:'12px', border:`1px solid ${data.design.textColor}30`, color:data.design.textColor, textDecoration: 'none', fontWeight: 600}}>
                    {g.store}
                  </a>
                )
              ))}
            </div>
          </div>
        )}

        {data.visibility.whatsapp && (
          <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{data.emojis.whatsapp}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <a href={`https://wa.me/${data.whatsapp}?text=${confirmMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
                ✓ Confirmar Asistencia
              </a>
              <a href={`https://wa.me/${data.whatsapp}?text=${declineMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: `2px solid ${data.design.textColor}50`, color: data.design.textColor, padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
                ✕ No podré asistir
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
