import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Ticket, MapPin, Calendar, Clock } from "lucide-react";

const prisma = new PrismaClient();

export default async function PassPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const sp = await searchParams;
  
  let guestName = "Invitado Especial";
  let passCount = "1";
  let rawPayload = "";

  if (typeof sp.p === 'string') {
    try {
      rawPayload = sp.p;
      const decoded = JSON.parse(decodeURIComponent(atob(sp.p)));
      if (decoded.n) guestName = decoded.n;
      if (decoded.q) passCount = String(decoded.q);
    } catch (e) {
      console.error("Invalid token");
    }
  } else {
    // Fallback for old links
    if (typeof sp.n === 'string') guestName = sp.n;
    if (typeof sp.q === 'string') passCount = sp.q;
  }

  // Buscar la invitación
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  const data = JSON.parse(invitation.data);
  const eventDate = new Date(data.date);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: data.design.bgColor,
      color: data.design.textColor,
      fontFamily: data.design.font,
      backgroundImage: data.visibility.bgImage && data.design.bgImage ? `url(${data.design.bgImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundBlendMode: 'overlay',
    }}>
      
      {/* TICKET CARD */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${data.design.textColor}40`,
        borderRadius: '24px',
        maxWidth: '400px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Ticket Header (Image) */}
        <div style={{
          height: '180px',
          backgroundImage: `url(${data.mainPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
          }}></div>
          <h2 style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1.5rem',
            color: 'white',
            margin: 0,
            fontSize: '1.5rem',
            fontFamily: data.design.font
          }}>
            {data.title}
          </h2>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.05)', padding: '0.75rem', borderRadius: '50%', marginBottom: '1rem', color: data.design.textColor }}>
            <Ticket size={32} />
          </div>
          
          <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '0.5rem' }}>Pase de Acceso</p>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>{guestName}</h1>
          
          <div style={{ 
            display: 'inline-block', 
            background: data.design.textColor, 
            color: data.design.bgColor, 
            padding: '0.5rem 1.5rem', 
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1.25rem',
            marginTop: '1rem',
            marginBottom: '2rem'
          }}>
            VÁLIDO POR {passCount} {parseInt(passCount) === 1 ? 'PERSONA' : 'PERSONAS'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12}/> Fecha</p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{eventDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> Hora</p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Ticket Cutouts */}
        <div style={{ position: 'absolute', top: '180px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: data.design.bgColor, transform: 'translateY(-50%)' }}></div>
        <div style={{ position: 'absolute', top: '180px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: data.design.bgColor, transform: 'translateY(-50%)' }}></div>
        <div style={{ position: 'absolute', top: '180px', left: '15px', right: '15px', borderTop: `2px dashed ${data.design.textColor}40` }}></div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href={`/invitation/${slug}${rawPayload ? `?p=${rawPayload}` : (typeof sp.n === 'string' ? `?n=${sp.n}&q=${sp.q}` : '')}`} style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: 'transparent',
          color: data.design.textColor,
          border: `2px solid ${data.design.textColor}`,
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}>
          Ver Invitación Completa
        </Link>
      </div>

    </div>
  );
}
