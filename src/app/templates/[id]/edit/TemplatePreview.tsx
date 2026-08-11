import React from 'react';
import styles from "./editor.module.css";
import { MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import { TemplateData } from './types';

export default function TemplatePreview({ id, data }: { id: string, data: TemplateData }) {
  return (
    <>
        <div className={styles.previewPanel}>
          <div className={styles.previewContainer}>
            <div className={styles.mobileFrame}>
              {id === 't-baby-shower' ? (
                 <div 
                  className={styles.previewContent}
                  style={{ 
                    height: '100%', 
                    overflowY: 'auto', 
                    background: data.design.bgColor, 
                    color: data.design.textColor,
                    fontFamily: data.design.font,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                    transition: 'background 0.4s ease',
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

                  <div className={styles.photoHover} style={{
                    width: '170px', height: '170px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', 
                    border: `4px solid rgba(255,255,255,0.55)`, boxShadow: '0 10px 20px rgba(221, 165, 165, 0.15)', zIndex: 2, position: 'relative'
                  }}>
                    <img src={data.mainPhoto} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>

                  <div style={{textAlign: 'center', marginBottom: '30px', zIndex: 2, position: 'relative', width: '100%'}}>
                    {data.visibility.quote && (
                      <h2 style={{fontFamily: data.quote.font, fontSize: data.quote.size, fontWeight: 400, color: data.quote.color, marginBottom: '8px', textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)'}}>
                        {data.quote.text}
                      </h2>
                    )}
                    <div style={{width: '50px', height: '1.5px', backgroundColor: data.design.textColor, margin: '0 auto', borderRadius: '2px', opacity: 0.6}}></div>
                  </div>

                  {data.visibility.countdown && (
                     <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                        borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 10px 25px rgba(221, 165, 165, 0.15)',
                        zIndex: 2, textAlign: 'center', position: 'relative'
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
        )}

        {data.date && (
              <div className="glass-card-hover" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                  textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative',
                  opacity: 1, transform: 'none'
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

                  <div style={{width: '100%', zIndex: 2, position: 'relative'}}>
                     {data.visibility.carousel && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.carousel }} />
                           <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Nuestros Momentos</h4>
                           <AutoCarousel photos={data.carouselPhotos} />
                        </div>
                     )}

                     {data.visibility.location && (
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
                     )}

                     {data.visibility.secondaryLocation && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.secondaryLocation }} />
                           <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Ubicación Secundaria</h4>
                           <p style={{fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '2px'}}>{data.secondaryLocation}</p>
                           {data.secondaryAddress && <p style={{fontSize: '12px', fontWeight: 400, opacity: 0.9, lineHeight: 1.3, marginBottom: '4px'}}>{data.secondaryAddress}</p>}
                           {data.secondaryLocationUrl && (
                                <a href={data.secondaryLocationUrl} target="_blank" rel="noreferrer" style={{
                                    display: 'inline-block', padding: '10px 20px', borderRadius: '25px', fontSize: '11px', fontWeight: 600, textDecoration: 'none',
                                    textTransform: 'uppercase', letterSpacing: '1px', marginTop: '12px', backgroundColor: 'transparent', color: data.design.textColor,
                                    border: `1px solid ${data.design.textColor}`
                                }}>Abrir en Maps</a>
                           )}
                        </div>
                     )}
                     
                     {data.visibility.gifts && data.gifts.length > 0 && (
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
                     )}

                     {data.visibility.generalGift && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
                           <h4 style={{fontFamily: data.design.font, fontSize: '16px', fontWeight: 600, marginBottom: '8px'}}>Regalo</h4>
                           <p style={{fontSize: '13px', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px'}}>{data.generalGift}</p>
                        </div>
                     )}

                     {data.visibility.dressCode && (
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
                     )}

                     {data.visibility.generalText && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <div style={{ fontSize: '26px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
                           <p style={{fontSize: '13px', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px'}}>{data.generalText}</p>
                        </div>
                     )}

                     {data.visibility.whatsapp && !data.visibility.rsvp && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '12px'}}>Confirmar Asistencia</h3>
                           <button style={{
                               backgroundColor: data.design.textColor, color: data.design.bgColor, boxShadow: `0 4px 12px ${data.design.textColor}40`,
                               padding: '12px 24px', fontSize: '12px', display: 'inline-block', borderRadius: '25px', fontWeight: 600,
                               textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid #FFFFFF', marginBottom: '8px', width: '100%'
                           }}>✓ Confirmar Asistencia</button>
                           <button style={{
                               backgroundColor: 'transparent', color: data.design.textColor, border: `1px solid ${data.design.textColor}`,
                               padding: '12px 24px', fontSize: '12px', display: 'inline-block', borderRadius: '25px', fontWeight: 600,
                               textTransform: 'uppercase', letterSpacing: '1px', width: '100%'
                           }}>✕ No podré asistir</button>
                        </div>
                     )}

                     {data.visibility.rsvp && (
                        <div className="glass-card-hover" style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '20px', padding: '20px', width: '100%', marginBottom: '16px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                           <h3 style={{fontFamily: data.design.font, fontSize: '18px', marginBottom: '10px', color: '#1a1f36'}}>¿Nos acompañas?</h3>
                           <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '16px', color: '#3c4257'}}>Por favor confirma tu asistencia al evento.</p>
                           <div style={{textAlign: 'left', marginBottom: '16px'}}>
                             <label style={{fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3c4257'}}>Nombre y Apellido</label>
                             <input type="text" placeholder="Ej. Juan Pérez" style={{
                               width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e3e8ee', backgroundColor: '#ffffff', color: '#3c4257'
                             }} disabled />
                           </div>
                           <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                             <button style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e3e8ee', backgroundColor: '#ffffff', fontSize: '12px', color: '#3c4257'}}>✓ Sí, asistiré</button>
                             <button style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e3e8ee', backgroundColor: '#ffffff', fontSize: '12px', color: '#3c4257'}}>✕ No podré asistir</button>
                           </div>
                           <button style={{
                               backgroundColor: '#8792a2', color: '#FFFFFF', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', border: 'none'
                           }}>Confirmar Respuesta</button>
                        </div>
                     )}
                  </div>
                  <div style={{height: '40px'}}></div>
                </div>
              ) : id === 't-xv-02' ? (
                <div 
                  className={styles.previewContent}
                  style={{ 
                    height: '100%', 
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
                      {data.decorations?.topLeft && <img src={data.decorations.topLeft} alt="" style={{position: 'absolute', top: '10px', left: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
                      {data.decorations?.topRight && <img src={data.decorations.topRight} alt="" style={{position: 'absolute', top: '10px', right: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
                      {data.decorations?.bottomLeft && <img src={data.decorations.bottomLeft} alt="" style={{position: 'absolute', bottom: '10px', left: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
                      {data.decorations?.bottomRight && <img src={data.decorations.bottomRight} alt="" style={{position: 'absolute', bottom: '10px', right: '10px', width: '80px', zIndex: 20, pointerEvents: 'none'}} />}
                    </>
                  )}

                  {data.visibility.fallingIcons && <FallingIcons iconString={data.emojis.falling} />}
                  {data.visibility.music && data.music && <AudioPlayer src={data.music} isAbsolute={true} />}

                  {/* Top Half - Image */}
                  <div style={{
                    height: '45%',
                    minHeight: '45%',
                    flexShrink: 0,
                    width: '100%',
                    backgroundImage: `url(${data.mainPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 10
                  }}></div>

                  {/* Bottom Half - Content */}
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem', width: '100%', flex: 1, justifyContent: 'center' }}>
                    <h4 style={{ fontFamily: data.design.font, fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.9, marginBottom: '0.25rem' }}>{data.subtitle}</h4>
                    <h1 style={{ fontFamily: (data.design.titleFont || data.design.font), fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>{data.title}</h1>
                    
                    {data.visibility.countdown && (
                      <div style={{ transform: 'scale(0.65)', marginBottom: '1rem', marginTop: '-1rem' }}>
                         <Countdown 
                            targetDate={data.date} 
                            bgColor={data.countdownDesign?.bgColor || 'rgba(255,255,255,0.2)'} 
                            textColor={data.countdownDesign?.textColor || '#ffffff'} 
                            font={data.countdownDesign?.font || data.design.font} 
                          />
                      </div>
                    )}

                    {data.visibility.quote && (
                      <p style={{ fontFamily: data.quote.font, fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic', maxWidth: '300px' }}>
                        &quot;{data.quote.text}&quot;
                      </p>
                    )}

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

                    {data.visibility.location && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.location }} />
                        <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0.25rem'}}>Ubicación</h3>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.1rem' }}>{data.location}</p>
                        {data.address && <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{data.address}</p>}
                        {data.locationUrl && (
                          <a href={data.locationUrl} target="_blank" rel="noreferrer" style={{
                            display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '25px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                            textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem', backgroundColor: 'transparent', color: data.design.textColor,
                            border: `1px solid ${data.design.textColor}50`
                          }}>Mapa</a>
                        )}
                      </div>
                    )}

                    {data.visibility.secondaryLocation && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.secondaryLocation }} />
                        <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0.25rem'}}>Ubicación Secundaria</h3>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.1rem' }}>{data.secondaryLocation}</p>
                        {data.secondaryAddress && <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{data.secondaryAddress}</p>}
                        {data.secondaryLocationUrl && (
                          <a href={data.secondaryLocationUrl} target="_blank" rel="noreferrer" style={{
                            display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '25px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                            textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem', backgroundColor: 'transparent', color: data.design.textColor,
                            border: `1px solid ${data.design.textColor}50`
                          }}>Mapa</a>
                        )}
                      </div>
                    )}

                    {data.visibility.itinerary && data.itinerary && data.itinerary.length > 0 && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.itinerary }} />
                        <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '1rem'}}>Itinerario</h3>
                        
                        <div style={{ position: 'relative', padding: '0.5rem 0' }}>
                          {/* Línea central */}
                          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
                          
                          {data.itinerary.map((item: any, i: number) => (
                            <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.2rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                              {/* Icono central */}
                              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '28px', height: '28px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', zIndex: 2 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                              
                              {/* Contenido (Texto) */}
                              <div style={{ width: '42%', textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 0.75rem 0 0' : '0 0 0 0.75rem' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.1rem' }}>{item.time}</div>
                                <div style={{ fontSize: '0.85rem' }}>{item.title}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.visibility.generalGift && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
                        <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '0.5rem'}}>Regalo</h3>
                        <p style={{ fontSize: '0.9rem' }}>{data.generalGift}</p>
                      </div>
                    )}

                    {data.visibility.dressCode && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.dressCode }} />
                        <h3 style={{fontFamily: data.design.font, fontSize: '1.2rem', marginBottom: '1rem'}}>Código de Vestimenta</h3>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {data.dressCode?.him && <div><strong>Para Él:</strong> {data.dressCode.him}</div>}
                          {data.dressCode?.her && <div><strong>Para Ella:</strong> {data.dressCode.her}</div>}
                          {data.dressCode?.general && <div style={{marginTop: '0.5rem'}}>{data.dressCode.general}</div>}
                        </div>
                      </div>
                    )}

                    {data.visibility.generalText && (
                      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
                        <p style={{ fontSize: '0.9rem' }}>{data.generalText}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '250px' }}>
                      <button style={{ background: '#25D366', color: 'white', padding: '0.5rem', borderRadius: '9999px', border: 'none', fontWeight: 600, fontSize: '0.8rem' }}>✓ Confirmar Asistencia</button>
                      <button style={{ background: 'transparent', color: data.design.textColor, padding: '0.5rem', borderRadius: '9999px', border: `1px solid ${data.design.textColor}50`, fontWeight: 600, fontSize: '0.8rem' }}>✕ No podré asistir</button>
                    </div>
                  </div>
                </div>
              ) : (
              <div 
                className={styles.previewContent}
                style={{ 
                  backgroundColor: data.design.bgColor, 
                  color: data.design.textColor,
                  fontFamily: data.design.font,
                  backgroundImage: data.visibility.bgImage && data.design.bgImage ? `url(${data.design.bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed',
                  backgroundBlendMode: 'overlay', // Ensures text is readable if color is set
                }}
              >
                {data.visibility.fallingIcons && <FallingIcons iconString={data.emojis.falling} />}
                {data.visibility.music && data.music && <AudioPlayer src={data.music} isAbsolute={true} />}

                {/* Hero */}
                <div className={styles.previewHero} style={{ backgroundImage: `url(${data.mainPhoto})` }}>
                  <div className={styles.previewHeroOverlay}>
                    <h4 className={styles.previewSubtitle} style={{fontFamily: data.design.font}}>{data.subtitle}</h4>
                    <h1 className={styles.previewTitle} style={{fontFamily: data.design.font}}>{data.title}</h1>
                  </div>
                </div>

                {/* Sections */}
                <div className={styles.previewBody} style={{position: 'relative', zIndex: 20}}>
                  
                  {data.visibility.quote && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
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
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="right">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.countdown }} />
                        <h3 style={{fontFamily: data.design.font}}>Faltan</h3>
                        <Countdown 
                          targetDate={data.date} 
                          bgColor={data.countdownDesign.bgColor} 
                          textColor={data.countdownDesign.textColor} 
                          font={data.countdownDesign.font} 
                        />
                      </div>
                    </AnimatedSection>
                  )}

                  {data.date && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
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
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.carousel }} />
                        <h3 style={{fontFamily: data.design.font}}>Nuestros Momentos</h3>
                        <AutoCarousel photos={data.carouselPhotos} />
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.itinerary && data.itinerary && data.itinerary.length > 0 && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="right">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.itinerary }} />
                        <h3 style={{fontFamily: data.design.font}}>Itinerario</h3>
                        
                        <div style={{ position: 'relative', marginTop: '1.5rem', padding: '1rem 0' }}>
                          {/* Línea central */}
                          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: `${data.design.textColor}40`, transform: 'translateX(-50%)' }}></div>
                          
                          {data.itinerary.map((item: any, i: number) => (
                            <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                              {/* Icono central */}
                              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '36px', height: '36px', borderRadius: '50%', background: data.design.bgColor, border: `2px solid ${data.design.textColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', zIndex: 2 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                              
                              {/* Contenido (Texto) */}
                              <div style={{ width: '42%', textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 1.25rem 0 0' : '0 0 0 1.25rem' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.time}</div>
                                <div style={{ fontSize: '1rem' }}>{item.title}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.location && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.location }} />
                        <h3 style={{fontFamily: data.design.font}}>Ubicación</h3>
                        <p>{data.location}</p>
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
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}>
                            <MapPin size={18} />
                            Abrir en Maps
                          </a>
                        )}
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.secondaryLocation && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="right">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.secondaryLocation }} />
                        <h3 style={{fontFamily: data.design.font}}>Ubicación Secundaria</h3>
                        <p>{data.secondaryLocation}</p>
                        {data.secondaryLocationUrl && (
                          <a href={data.secondaryLocationUrl} target="_blank" rel="noreferrer" style={{
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
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}>
                            <MapPin size={18} />
                            Abrir en Maps
                          </a>
                        )}
                      </div>
                    </AnimatedSection>
                  )}


                  {data.visibility.gifts && data.gifts.length > 0 && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="right">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.gifts }} />
                        <h3 style={{fontFamily: data.design.font}}>Mesa de Regalos</h3>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                          {data.gifts.map((g,i) => (
                            <a key={g.id || i} href={g.url || "#"} target="_blank" rel="noreferrer" style={{padding:'0.75rem', background:'rgba(0,0,0,0.05)', borderRadius:'8px', border:`1px solid ${data.design.textColor}30`, color:data.design.textColor, textDecoration: 'none', display: 'block', fontSize: '0.95rem'}}>
                              {g.store || "Nueva Mesa (Ej. Liverpool)"}
                            </a>
                          ))}
                        </div>
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.generalGift && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="right">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalGift }} />
                        <h3 style={{fontFamily: data.design.font}}>Mesa de Regalos</h3>
                        <p style={{ marginTop: '1rem' }}>{data.generalGift}</p>
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.dressCode && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.dressCode }} />
                        <h3 style={{fontFamily: data.design.font}}>Código de Vestimenta</h3>
                        <div style={{ fontSize: '1rem', lineHeight: '1.5', marginTop: '1rem' }}>
                          {data.dressCode?.him && <div><strong>Para Él:</strong> {data.dressCode.him}</div>}
                          {data.dressCode?.her && <div><strong>Para Ella:</strong> {data.dressCode.her}</div>}
                          {data.dressCode?.general && <div style={{marginTop: '0.5rem'}}>{data.dressCode.general}</div>}
                        </div>
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.generalText && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="left">
                      <div className={styles.previewSection}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.generalText }} />
                        <p style={{ marginTop: '1rem' }}>{data.generalText}</p>
                      </div>
                    </AnimatedSection>
                  )}

                  {data.visibility.whatsapp && (
                    <AnimatedSection enableAnimation={id === 't-boda-04'} direction="up">
                      <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: data.emojis.whatsapp }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
                          <button style={{ background: '#25D366', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '9999px', fontWeight: 600, width: '100%', maxWidth: '200px' }}>✓ Confirmar Asistencia</button>
                          <button style={{ background: 'transparent', color: data.design.textColor, border: `1px solid ${data.design.textColor}50`, padding: '0.75rem', borderRadius: '9999px', fontWeight: 600, width: '100%', maxWidth: '200px' }}>✕ No podré asistir</button>
                        </div>
                      </div>
                    </AnimatedSection>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
}
