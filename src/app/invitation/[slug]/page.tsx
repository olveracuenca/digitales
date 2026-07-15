import type { Metadata, ResolvingMetadata } from "next";
import { PrismaClient } from "@prisma/client";
import styles from "../../templates/[id]/edit/editor.module.css";
import { notFound } from "next/navigation";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import RsvpForm from "@/components/RsvpForm";

const prisma = new PrismaClient();

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) return {};
  
  try {
    const data = JSON.parse(invitation.data);
    const title = data.title || 'Estás Invitado';
    const description = data.subtitle || 'Te invitamos a acompañarnos en este día especial.';
    const image = data.mainPhoto || '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [image] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      }
    };
  } catch(e) {
    return {};
  }
}

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

  
  let dbPass: any = null;
  let guestPassProp: any = undefined;
  let existingRsvp: any = null;

  if (typeof sp.t === 'string') {
    dbPass = await prisma.guestPass.findUnique({
      where: { id: sp.t }
    });
    if (dbPass) {
      guestPassProp = { id: dbPass.id, name: dbPass.name, passCount: dbPass.passCount };
      confirmMsg = encodeURIComponent(`¡Hola! Confirmo la asistencia de ${dbPass.name}${dbPass.passCount ? ` (${dbPass.passCount} pases)` : ''} a ${eventTitle}. ¡Ahí nos vemos!`);
      declineMsg = encodeURIComponent(`¡Hola! Lamentablemente la familia/invitado ${dbPass.name} no podrá asistir a ${eventTitle}. ¡Gracias por la invitación!`);
      
      existingRsvp = await prisma.rsvp.findFirst({
        where: { guestPassId: dbPass.id }
      });
    }
  } else if (typeof sp.p === 'string') {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(sp.p)));
      if (decoded.n) {
        guestPassProp = { id: "", name: decoded.n, passCount: decoded.q ? parseInt(String(decoded.q)) || 1 : 1 };
        confirmMsg = encodeURIComponent(`¡Hola! Confirmo la asistencia de ${decoded.n}${decoded.q ? ` (${decoded.q} pases)` : ''} a ${eventTitle}. ¡Ahí nos vemos!`);
        declineMsg = encodeURIComponent(`¡Hola! Lamentablemente la familia/invitado ${decoded.n} no podrá asistir a ${eventTitle}. ¡Gracias por la invitación!`);
      }
    } catch (e) {
      // Ignore
    }
  } else if (typeof sp.n === 'string') {
    guestPassProp = { id: "", name: sp.n, passCount: sp.q ? parseInt(String(sp.q)) || 1 : 1 };
    confirmMsg = encodeURIComponent(`¡Hola! Confirmo la asistencia de ${sp.n}${sp.q ? ` (${sp.q} pases)` : ''} a ${eventTitle}. ¡Ahí nos vemos!`);
    declineMsg = encodeURIComponent(`¡Hola! Lamentablemente la familia/invitado ${sp.n} no podrá asistir a ${eventTitle}. ¡Gracias por la invitación!`);
  }

  const cleanPhone = String(data.whatsapp || data.phone || "").replace(/\D/g, '');

  // --- PLANTILLA t-baby-shower (Glassmorphism Pink Dream) ---
  if (invitation.templateId === 't-baby-shower') {
    return (
      <div 
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          background: data.design.bgColor, 
          color: data.design.textColor,
          fontFamily: data.design.font,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 20px',
        }}
      >
        {/* Decoraciones Editables */}
        {data.visibility.decorations && (
          <>
            {data.decorations?.topLeft && <img src={data.decorations.topLeft} alt="" style={{position: 'absolute', top: '10px', left: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.topRight && <img src={data.decorations.topRight} alt="" style={{position: 'absolute', top: '10px', right: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.bottomLeft && <img src={data.decorations.bottomLeft} alt="" style={{position: 'absolute', bottom: '10px', left: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
            {data.decorations?.bottomRight && <img src={data.decorations.bottomRight} alt="" style={{position: 'absolute', bottom: '10px', right: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
          </>
        )}

        {data.visibility.fallingIcons && <FallingIcons iconString={data.emojis.falling} />}
        {data.visibility.music && data.music && <AudioPlayer src={data.music} isAbsolute={true} />}

        <header style={{textAlign: 'center', marginBottom: '24px', zIndex: 2, position: 'relative'}}>
          <span style={{fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', display: 'inline-block', opacity: 0.8}}>
            ¡Te invitamos a celebrar!
          </span>
          <h1 style={{fontFamily: (data.design.titleFont || data.design.font), fontSize: '38px', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px'}}>
            {data.title}
          </h1>
          <p style={{fontSize: '12px', letterSpacing: '0.5px', opacity: 0.7}}>
            {data.subtitle}
          </p>
        </header>

        <AnimatedSection direction="up">
          <div className={styles.photoHover} style={{
            width: '170px', height: '170px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', margin: '0 auto',
            border: `4px solid rgba(255,255,255,0.55)`, boxShadow: '0 10px 20px rgba(221, 165, 165, 0.15)', zIndex: 2, position: 'relative'
          }}>
            <img src={data.mainPhoto} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up">
          <div style={{textAlign: 'center', marginBottom: '30px', zIndex: 2, position: 'relative', width: '100%'}}>
            {data.visibility.quote && (
              <h2 style={{fontFamily: data.quote.font, fontSize: data.quote.size, fontWeight: 400, color: data.quote.color, marginBottom: '8px', textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)'}}>
                {data.quote.text}
              </h2>
            )}
            <div style={{width: '50px', height: '1.5px', backgroundColor: data.design.textColor, margin: '0 auto', borderRadius: '2px', opacity: 0.6}}></div>
          </div>
        </AnimatedSection>

        {data.date && (
          <div className="glass-card-hover" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative',
              maxWidth: '400px', margin: '0 auto 20px auto', opacity: 1, transform: 'none'
          }}>
             <div style={{ fontSize: '26px', marginBottom: '8px' }}>📅</div>
             <h4 style={{fontFamily: data.design.font, fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: data.design.textColor}}>¿Cuándo?</h4>
             <p style={{fontSize: '14px', fontWeight: 500, color: data.design.textColor, textTransform: 'capitalize'}}>
               {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
             <p style={{fontSize: '12px', opacity: 0.8, color: data.design.textColor, marginTop: '4px'}}>
               A las {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
             </p>
          </div>
        )}

        {data.visibility.countdown && (
          <AnimatedSection direction="up">
           <div className="glass-card-hover" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 10px 25px rgba(221, 165, 165, 0.15)',
              zIndex: 2, textAlign: 'center', position: 'relative', maxWidth: '400px', margin: '0 auto'
           }}>
              <h3 style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', opacity: 0.8}}>Faltan</h3>
              <div style={{ transform: 'scale(0.85)' }}>
                <Countdown 
                    targetDate={data.date} 
                    bgColor={data.countdownDesign?.bgColor || 'rgba(255,255,255,0.45)'} 
                    textColor={data.countdownDesign?.textColor || data.design.textColor} 
                    font={data.countdownDesign?.font || data.design.font} 
                />
              </div>
           </div>
          </AnimatedSection>
        )}

        <div style={{width: '100%', maxWidth: '400px', zIndex: 2, position: 'relative'}}>
           {data.visibility.carousel && (
              <AnimatedSection direction="left">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.carousel }} />
                   <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Nuestros Momentos</h4>
                   <AutoCarousel photos={data.carouselPhotos} />
                </div>
              </AnimatedSection>
           )}

           {data.visibility.location && (
              <AnimatedSection direction="right">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.location }} />
                   <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Ubicación</h4>
                   <p style={{fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '2px'}}>{data.location}</p>
                           {data.address && <p style={{fontSize: '12px', fontWeight: 400, opacity: 0.9, lineHeight: 1.3, marginBottom: '4px'}}>{data.address}</p>}
                   {data.locationUrl && (
                        <a href={data.locationUrl} target="_blank" rel="noreferrer" style={{
                            display: 'inline-block', padding: '10px 20px', borderRadius: '25px', fontSize: '11px', fontWeight: 600, textDecoration: 'none',
                            textTransform: 'uppercase', letterSpacing: '1px', marginTop: '12px', backgroundColor: 'transparent', color: data.design.textColor,
                            border: `1px solid ${data.design.textColor}`
                        }}>Abrir en Maps</a>
                   )}
                </div>
              </AnimatedSection>
           )}
           
           {data.visibility.gifts && data.gifts.length > 0 && (
              <AnimatedSection direction="left">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.gifts }} />
                   <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Mesa de Regalos</h4>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
                     {data.gifts.map((g: any, i: number) => (
                        g.store && (
                          <a key={i} href={g.url || "#"} target="_blank" rel="noreferrer" style={{
                              display: 'inline-block', padding: '10px 20px', borderRadius: '25px', fontSize: '11px', fontWeight: 600, textDecoration: 'none',
                              textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'transparent', color: data.design.textColor,
                              border: `1px solid ${data.design.textColor}`
                          }}>
                            {g.store}
                          </a>
                        )
                     ))}
                   </div>
                </div>
              </AnimatedSection>
           )}

           {data.visibility.generalGift && (
              <AnimatedSection direction="right">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
                   <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Regalo</h4>
                   <p style={{fontSize: '13px', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px'}}>{data.generalGift}</p>
                </div>
              </AnimatedSection>
           )}

           {data.visibility.dressCode && (
              <AnimatedSection direction="left">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.dressCode }} />
                   <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Código de Vestimenta</h4>
                   <div style={{fontSize: '13px', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px'}}>
                     {data.dressCode?.him && <div><strong>Para Él:</strong> {data.dressCode.him}</div>}
                     {data.dressCode?.her && <div><strong>Para Ella:</strong> {data.dressCode.her}</div>}
                     {data.dressCode?.general && <div style={{marginTop: '0.5rem'}}>{data.dressCode.general}</div>}
                   </div>
                </div>
              </AnimatedSection>
           )}

           {data.visibility.generalText && (
              <AnimatedSection direction="right">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
                   <p style={{fontSize: '13px', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px'}}>{data.generalText}</p>
                </div>
              </AnimatedSection>
           )}

           {data.visibility.whatsapp && !data.visibility.rsvp && (
              <AnimatedSection direction="up">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   {existingRsvp ? (
                     <>
                       <div style={{ fontSize: '26px', marginBottom: '8px' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                       <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '12px'}}>
                         {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                       </h3>
                       <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '0'}}>Gracias por informarnos.</p>
                     </>
                   ) : !guestPassProp ? (
                     <>
                       <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '8px'}}>Confirmar Asistencia</h3>
                       <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '0'}}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                     </>
                   ) : (
                     <>
                       <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '12px'}}>Confirmar Asistencia</h3>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                         <a href={`https://wa.me/${cleanPhone}?text=${confirmMsg}`} target="_blank" rel="noreferrer" style={{
                             backgroundColor: data.design.textColor, color: data.design.bgColor, boxShadow: `0 4px 12px ${data.design.textColor}40`,
                             padding: '12px 24px', fontSize: '12px', display: 'inline-block', borderRadius: '25px', fontWeight: 600,
                             textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid #FFFFFF', textDecoration: 'none'
                         }}>✓ Confirmar Asistencia</a>
                         <a href={`https://wa.me/${cleanPhone}?text=${declineMsg}`} target="_blank" rel="noreferrer" style={{
                             backgroundColor: 'transparent', color: data.design.textColor, border: `1px solid ${data.design.textColor}`,
                             padding: '12px 24px', fontSize: '12px', display: 'inline-block', borderRadius: '25px', fontWeight: 600,
                             textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none'
                         }}>✕ No podré asistir</a>
                       </div>
                     </>
                   )}
                </div>
              </AnimatedSection>
           )}

           {data.visibility.rsvp && (
              <AnimatedSection direction="up">
                <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                   {existingRsvp ? (
                     <>
                       <div style={{ fontSize: '26px', marginBottom: '8px' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                       <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '12px'}}>
                         {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                       </h3>
                       <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '0'}}>Gracias por responder.</p>
                     </>
                   ) : !guestPassProp ? (
                     <>
                       <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '8px'}}>Confirmar Asistencia</h3>
                       <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '0'}}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                     </>
                   ) : (
                     <RsvpForm 
                       invitationId={invitation.id} 
                       design={data.design} 
                       guestPass={guestPassProp} 
                       whatsapp={{
                         enabled: data.visibility.whatsapp || false,
                         number: cleanPhone,
                         confirmMsg,
                         declineMsg
                       }} 
                     />
                   )}
                </div>
              </AnimatedSection>
           )}
        </div>
      </div>
    );
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
          <h1 style={{ fontFamily: (data.design.titleFont || data.design.font), fontSize: '3.5rem', fontWeight: 700, margin: '0 0 1rem 0', lineHeight: 1.1 }}>{data.title}</h1>
          
          {data.date && (
            <div style={{ width: '100%', maxWidth: '300px', marginBottom: '1.5rem', opacity: 1, transform: 'none' }}>
               <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📅</div>
               <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0.25rem'}}>¿Cuándo?</h3>
               <p style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.1rem' }}>
                 {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </p>
               <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                 A las {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
               </p>
            </div>
          )}

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
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.itinerary }} />
              <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '1.5rem'}}>Itinerario</h3>
              
              <div style={{ position: 'relative', padding: '0.5rem 0' }}>
                {/* Línea central */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
                
                {data.itinerary.map((item: any, i: number) => (
                  <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                    {/* Icono central */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '32px', height: '32px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', zIndex: 2 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                    
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

          {data.visibility.generalGift && (
            <div style={{ width: '100%', maxWidth: '350px', marginBottom: '3rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
              <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '1rem'}}>Regalo</h3>
              <p style={{ fontSize: '1rem' }}>{data.generalGift}</p>
            </div>
          )}

          {data.visibility.dressCode && (
            <div style={{ width: '100%', maxWidth: '350px', marginBottom: '3rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.dressCode }} />
              <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '1.5rem'}}>Código de Vestimenta</h3>
              <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                {data.dressCode?.him && <div><strong>Para Él:</strong> {data.dressCode.him}</div>}
                {data.dressCode?.her && <div><strong>Para Ella:</strong> {data.dressCode.her}</div>}
                {data.dressCode?.general && <div style={{marginTop: '0.5rem'}}>{data.dressCode.general}</div>}
              </div>
            </div>
          )}

          {data.visibility.generalText && (
            <div style={{ width: '100%', maxWidth: '350px', marginBottom: '3rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
              <p style={{ fontSize: '1rem' }}>{data.generalText}</p>
            </div>
          )}

          {data.visibility.whatsapp && !data.visibility.rsvp && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
              {existingRsvp ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: `1px solid ${data.design.textColor}30` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0'}}>
                    {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                  </h3>
                </div>
              ) : !guestPassProp ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0.5rem'}}>Confirmar Asistencia</h3>
                  <p style={{ opacity: 0.8 }}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href={`https://wa.me/${cleanPhone}?text=${confirmMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    ✓ Confirmar Asistencia
                  </a>
                  <a href={`https://wa.me/${cleanPhone}?text=${declineMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: data.design.textColor, border: `2px solid ${data.design.textColor}50`, padding: '0.875rem 1.5rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none' }}>
                    ✕ No podré asistir
                  </a>
                </div>
              )}
            </div>
          )}

          {data.visibility.rsvp && (
            <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
              {existingRsvp ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: `1px solid ${data.design.textColor}30` }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '0.5rem'}}>
                    {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                  </h3>
                  <p style={{ opacity: 0.8 }}>Gracias por responder.</p>
                </div>
              ) : !guestPassProp ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '0.5rem'}}>Confirmar Asistencia</h3>
                  <p style={{ opacity: 0.8 }}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                </div>
              ) : (
                <RsvpForm 
                  invitationId={invitation.id} 
                  design={data.design} 
                  guestPass={guestPassProp}
                  whatsapp={{ enabled: data.visibility.whatsapp, number: cleanPhone, confirmMsg, declineMsg }}
                />
              )}
            </div>
          )}
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
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection}>
              <p style={{
                fontFamily: data.quote.font, 
                color: data.quote.color, 
                fontSize: data.quote.size, 
                lineHeight: 1.5,
                fontStyle: data.quote.font.includes('cursive') ? 'normal' : 'italic',
                padding: '1rem'
              }}>
                &quot;{data.quote.text}&quot;
              </p>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.countdown && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="right">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.countdown }} />
              <h3 style={{fontFamily: data.design.font}}>Faltan</h3>
              <Countdown 
                targetDate={data.date} 
                bgColor={data.countdownDesign?.bgColor || data.design.textColor} 
                textColor={data.countdownDesign?.textColor || data.design.bgColor} 
                font={data.countdownDesign?.font || data.design.font} 
              />
            </div>
          </AnimatedSection>
        )}

        {data.date && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection} style={{ width: '100%', opacity: 1, transform: 'none' }}>
               <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
               <h3 style={{fontFamily: data.design.font}}>¿Cuándo?</h3>
               <p style={{fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize', margin: '0.5rem 0'}}>
                 {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </p>
               <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                 A las {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
               </p>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.carousel && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.carousel }} />
              <h3 style={{fontFamily: data.design.font}}>Nuestros Momentos</h3>
              <AutoCarousel photos={data.carouselPhotos} />
            </div>
          </AnimatedSection>
        )}

        {data.visibility.itinerary && data.itinerary && data.itinerary.length > 0 && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="right">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.itinerary }} />
              <h3 style={{fontFamily: data.design.font}}>Itinerario</h3>
              
              <div style={{ position: 'relative', marginTop: '2rem', padding: '1rem 0' }}>
                {/* Línea central */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
                
                {data.itinerary.map((item: any, i: number) => (
                  <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                    {/* Icono central */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', zIndex: 2 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                    
                    {/* Contenido (Texto) */}
                    <div style={{ width: '42%', textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 1.5rem 0 0' : '0 0 0 1.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.time}</div>
                      <div style={{ fontSize: '1.1rem' }}>{item.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.location && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.location }} />
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
          </AnimatedSection>
        )}

        {data.visibility.gifts && data.gifts.length > 0 && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="right">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.gifts }} />
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
          </AnimatedSection>
        )}

        {data.visibility.generalGift && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="right">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
              <h3 style={{fontFamily: data.design.font}}>Mesa de Regalos</h3>
              <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{data.generalGift}</p>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.dressCode && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.dressCode }} />
              <h3 style={{fontFamily: data.design.font}}>Código de Vestimenta</h3>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.5', marginTop: '1rem' }}>
                {data.dressCode?.him && <div><strong>Para Él:</strong> {data.dressCode.him}</div>}
                {data.dressCode?.her && <div><strong>Para Ella:</strong> {data.dressCode.her}</div>}
                {data.dressCode?.general && <div style={{marginTop: '0.5rem'}}>{data.dressCode.general}</div>}
              </div>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.generalText && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="left">
            <div className={styles.previewSection}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
              <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{data.generalText}</p>
            </div>
          </AnimatedSection>
        )}

        {data.visibility.whatsapp && !data.visibility.rsvp && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="up">
            <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.whatsapp }} />
              
              {existingRsvp ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: `1px solid ${data.design.textColor}30` }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '0.5rem'}}>
                    {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                  </h3>
                  <p style={{ opacity: 0.8 }}>Gracias por responder.</p>
                </div>
              ) : !guestPassProp ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <a href={`https://wa.me/${cleanPhone}?text=${confirmMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
                    ✓ Confirmar Asistencia
                  </a>
                  <a href={`https://wa.me/${cleanPhone}?text=${declineMsg}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: `2px solid ${data.design.textColor}50`, color: data.design.textColor, padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
                    ✕ No podré asistir
                  </a>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {data.visibility.rsvp && (
          <AnimatedSection enableAnimation={invitation.templateId === 't-boda-04'} direction="up">
            {existingRsvp ? (
              <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: `1px solid ${data.design.textColor}30` }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{existingRsvp.status === 'CONFIRMED' ? '✅' : '❌'}</div>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '0.5rem'}}>
                    {existingRsvp.status === 'CONFIRMED' ? '¡Ya confirmaste tu asistencia!' : 'Lamentamos que no puedas asistir'}
                  </h3>
                  <p style={{ opacity: 0.8 }}>Gracias por responder.</p>
                </div>
              </div>
            ) : !guestPassProp ? (
              <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <h3 style={{fontFamily: data.design.font, fontSize: '1.4rem', marginBottom: '0.5rem'}}>Confirmar Asistencia</h3>
                  <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Para confirmar tu asistencia, por favor utiliza tu enlace personalizado.</p>
                </div>
              </div>
            ) : (
              <RsvpForm 
                invitationId={invitation.id} 
                design={data.design} 
                guestPass={guestPassProp}
                whatsapp={{ enabled: data.visibility.whatsapp, number: cleanPhone, confirmMsg, declineMsg }}
              />
            )}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
