import { PrismaClient } from "@prisma/client";
import styles from "../../templates/[id]/edit/editor.module.css";
import { notFound } from "next/navigation";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import { MapPin } from "lucide-react";

const prisma = new PrismaClient();

export default async function PublicInvitation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
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
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.emojis.whatsapp}</div>
            <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none' }}>
              Confirmar Asistencia
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
