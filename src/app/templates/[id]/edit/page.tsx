"use client";

import { useState, use } from "react";
import AdminLayout from "@/app/admin/layout";
import styles from "./editor.module.css";
import { Save, Image as ImageIcon, MapPin, Clock, Gift, MessageCircle, Eye, EyeOff, Palette, Share2, Copy } from "lucide-react";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import { CldUploadWidget } from 'next-cloudinary';

export default function TemplateEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Estado general
  const [data, setData] = useState({
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
    locationUrl: "https://maps.google.com/?q=Hacienda+San+Jose",
    whatsapp: "521234567890",
    mainPhoto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
    carouselPhotos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800"
    ],
    music: "",
    gifts: [
      { id: 1, store: "Liverpool", url: "https://liverpool.com.mx" }
    ],
    quote: {
      text: "Gracias por ser parte de este momento tan especial.",
      color: "#1f2937",
      font: "serif",
      size: "1.2rem"
    },
    emojis: {
      countdown: "⏳",
      carousel: "📸",
      location: "📍",
      gifts: "🎁",
      whatsapp: "💬",
      falling: "✨ 💖 🌸 💍 🥂"
    },
    design: {
      bgColor: "#fdfbf7",
      textColor: "#1f2937",
      font: "serif",
      bgImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&opacity=0.1"
    },
    visibility: {
      quote: true,
      carousel: true,
      countdown: true,
      location: true,
      gifts: true,
      whatsapp: true,
      bgImage: false,
      fallingIcons: false,
      music: false
    }
  });

  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState(`demo-${id}`);

  const publicUrl = `https://cuencaolv.com/invitation/${generatedSlug}`;
  const whatsappMsg = `¡Hola! Te invito a mi evento, entra a este link para ver los detalles: ${publicUrl}`;

  const toggleVisibility = (section: keyof typeof data.visibility) => {
    setData(prev => ({ ...prev, visibility: { ...prev.visibility, [section]: !prev.visibility[section] } }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, design: { ...data.design, [e.target.name]: e.target.value } });
  };

  const handleCountdownDesignChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, countdownDesign: { ...data.countdownDesign, [e.target.name]: e.target.value } });
  };

  const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, emojis: { ...data.emojis, [e.target.name]: e.target.value } });
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData({ ...data, quote: { ...data.quote, [e.target.name]: e.target.value } });
  };

  const handleUploadSuccess = (result: any, field: string) => {
    if (result?.info?.secure_url) {
      const url = result.info.secure_url;
      if (field === 'carouselPhotos') {
        setData(prev => ({ ...prev, carouselPhotos: [...prev.carouselPhotos, url] }));
      } else if (field === 'bgImage') {
        setData(prev => ({ ...prev, design: { ...prev.design, bgImage: url } }));
      } else {
        setData(prev => ({ ...prev, [field]: url }));
      }
    }
  };

  const removeCarouselPhoto = (index: number) => {
    setData(prev => ({ ...prev, carouselPhotos: prev.carouselPhotos.filter((_, i) => i !== index) }));
  };

  const addGift = () => {
    if (data.gifts.length >= 3) return;
    setData(prev => ({ ...prev, gifts: [...prev.gifts, { id: Date.now(), store: "", url: "" }] }));
  };

  const updateGift = (index: number, field: string, value: string) => {
    const newGifts = [...data.gifts];
    newGifts[index] = { ...newGifts[index], [field]: value };
    setData(prev => ({ ...prev, gifts: newGifts }));
  };

  const removeGift = (index: number) => {
    setData(prev => ({ ...prev, gifts: prev.gifts.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { saveInvitation } = await import('@/app/actions/invitation');
      const res = await saveInvitation(id, data);
      
      if (res.success && res.slug) {
        setGeneratedSlug(res.slug);
        setShowShareModal(true);
      } else {
        alert("Error al guardar: " + res.error);
      }
    } catch (err) {
      alert("Error al comunicarse con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className={`animate-fade-in ${styles.editorLayout}`}>
        {/* Form Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h2>Editor de Plantilla: {id}</h2>
            <button onClick={handleSave} className={styles.saveBtn} disabled={saving}>
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar & Publicar"}
            </button>
          </div>

          <div className={styles.formSections}>
            
            {/* Detalles del Proyecto */}
            <section className={styles.section} style={{background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)'}}>
              <h3 style={{color: 'var(--primary-color)'}}>Detalles Internos (Solo Admin)</h3>
              <div className={styles.inputGroup}>
                <label>Nombre del Evento (Ej. Boda Luis y Ana)</label>
                <input type="text" name="eventName" value={data.eventName} onChange={handleChange} className={styles.input} />
              </div>
            </section>

            {/* Design & Style */}
            <section className={`glass ${styles.section}`}>
              <h3><Palette size={18} style={{display:'inline', verticalAlign:'middle', marginRight:'0.5rem'}}/> Estilos y Diseño</h3>
              
              <div style={{display:'flex', gap:'2rem', marginBottom:'1.5rem'}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  <label style={{fontSize:'0.875rem', fontWeight: 500}}>Color Fondo</label>
                  <input type="color" name="bgColor" value={data.design.bgColor} onChange={handleDesignChange} className={styles.colorPicker} />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  <label style={{fontSize:'0.875rem', fontWeight: 500}}>Color Texto</label>
                  <input type="color" name="textColor" value={data.design.textColor} onChange={handleDesignChange} className={styles.colorPicker} />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label>Tipo de Letra Principal</label>
                <select name="font" value={data.design.font} onChange={handleDesignChange} className={styles.input}>
                  <option value="serif">Elegante (Serif)</option>
                  <option value="sans-serif">Moderna (Sans-Serif)</option>
                  <option value="'Dancing Script', cursive">Cursiva (Romántica)</option>
                </select>
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <ImageIcon size={18} /><span>Imagen de Fondo</span>
                  </div>
                  <button onClick={() => toggleVisibility('bgImage')} className={styles.toggleBtn}>
                    {data.visibility.bgImage ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.bgImage && (
                  <div className={styles.moduleBody}>
                    <CldUploadWidget signatureEndpoint="/api/cloudinary" onSuccess={(res) => handleUploadSuccess(res, 'bgImage')}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className={styles.secondaryBtn}>
                          <ImageIcon size={18} style={{display:'inline', verticalAlign:'middle', marginRight:'0.5rem'}} />
                          Subir Imagen de Fondo
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <span>✨ Lluvia de Iconos (Efecto)</span>
                  </div>
                  <button onClick={() => toggleVisibility('fallingIcons')} className={styles.toggleBtn}>
                    {data.visibility.fallingIcons ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.fallingIcons && (
                  <div className={styles.moduleBody}>
                    <label style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>Iconos a utilizar (separados por espacio):</label>
                    <input type="text" name="falling" value={data.emojis.falling} onChange={handleEmojiChange} className={styles.input} style={{marginTop:'0.5rem'}} />
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <span>🎵 Música de Fondo</span>
                  </div>
                  <button onClick={() => toggleVisibility('music')} className={styles.toggleBtn}>
                    {data.visibility.music ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.music && (
                  <div className={styles.moduleBody}>
                    <CldUploadWidget signatureEndpoint="/api/cloudinary" onSuccess={(res) => handleUploadSuccess(res, 'music')} options={{ resourceType: 'auto' }}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className={styles.secondaryBtn} style={{marginBottom:'0.5rem'}}>
                          {data.music ? "Cambiar Archivo de Audio" : "Subir Archivo de Audio (MP3)"}
                        </button>
                      )}
                    </CldUploadWidget>
                    {data.music && <p style={{fontSize:'0.75rem', color:'var(--primary-color)'}}>✅ Música cargada</p>}
                  </div>
                )}
              </div>
            </section>

            {/* Main Info */}
            <section className={`glass ${styles.section}`}>
              <h3>Información Principal</h3>
              <div className={styles.inputGroup}>
                <label>Título del Evento</label>
                <input type="text" name="title" value={data.title} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>Subtítulo (Nombres)</label>
                <input type="text" name="subtitle" value={data.subtitle} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  Foto Principal
                  <CldUploadWidget signatureEndpoint="/api/cloudinary" onSuccess={(res) => handleUploadSuccess(res, 'mainPhoto')}>
                    {({ open }) => (
                      <button type="button" onClick={() => open()} className={styles.secondaryBtn} style={{width:'auto', padding:'0.25rem 0.75rem', fontSize:'0.75rem'}}>
                        Cambiar
                      </button>
                    )}
                  </CldUploadWidget>
                </label>
                <input type="text" name="mainPhoto" value={data.mainPhoto} onChange={handleChange} className={styles.input} readOnly style={{opacity:0.7}} />
              </div>
            </section>

            {/* Configurable Modules */}
            <section className={`glass ${styles.section}`}>
              <h3>Módulos de la Invitación</h3>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <span>📝 Texto / Frase</span>
                  </div>
                  <button onClick={() => toggleVisibility('quote')} className={styles.toggleBtn}>
                    {data.visibility.quote ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.quote && (
                  <div className={styles.moduleBody}>
                    <textarea name="text" value={data.quote.text} onChange={handleQuoteChange} className={styles.input} rows={3} style={{marginBottom:'1rem', resize:'none'}} placeholder="Frase o agradecimiento" />
                    <div style={{display:'flex', gap:'1rem'}}>
                      <div style={{flex:1}}>
                        <label style={{fontSize:'0.875rem', display:'block', marginBottom:'0.25rem'}}>Color</label>
                        <input type="color" name="color" value={data.quote.color} onChange={handleQuoteChange} className={styles.colorPicker} style={{width:'32px', height:'32px'}} />
                      </div>
                      <div style={{flex:2}}>
                        <label style={{fontSize:'0.875rem', display:'block', marginBottom:'0.25rem'}}>Fuente</label>
                        <select name="font" value={data.quote.font} onChange={handleQuoteChange} className={styles.input} style={{padding:'0.5rem'}}>
                          <option value="serif">Serif</option>
                          <option value="sans-serif">Sans-Serif</option>
                          <option value="'Dancing Script', cursive">Cursiva</option>
                        </select>
                      </div>
                      <div style={{flex:1}}>
                        <label style={{fontSize:'0.875rem', display:'block', marginBottom:'0.25rem'}}>Tamaño</label>
                        <input type="text" name="size" value={data.quote.size} onChange={handleQuoteChange} className={styles.input} style={{padding:'0.5rem'}} placeholder="ej. 1.2rem" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="countdown" value={data.emojis.countdown} onChange={handleEmojiChange} style={{width:'30px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)'}} />
                    <span>Cuenta Regresiva</span>
                  </div>
                  <button onClick={() => toggleVisibility('countdown')} className={styles.toggleBtn}>
                    {data.visibility.countdown ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.countdown && (
                  <div className={styles.moduleBody}>
                    <input type="datetime-local" name="date" value={data.date} onChange={handleChange} className={styles.input} />
                    
                    <div style={{display:'flex', gap:'1rem', marginTop:'1rem', alignItems:'center'}}>
                      <label style={{fontSize:'0.875rem'}}>Color Fondo:</label>
                      <input type="color" name="bgColor" value={data.countdownDesign.bgColor} onChange={handleCountdownDesignChange} className={styles.colorPicker} />
                      
                      <label style={{fontSize:'0.875rem'}}>Color Texto:</label>
                      <input type="color" name="textColor" value={data.countdownDesign.textColor} onChange={handleCountdownDesignChange} className={styles.colorPicker} />
                    </div>

                    <div style={{marginTop:'1rem'}}>
                      <label style={{fontSize:'0.875rem'}}>Tipo de Letra:</label>
                      <select name="font" value={data.countdownDesign.font} onChange={handleCountdownDesignChange} className={styles.input} style={{marginTop:'0.5rem'}}>
                        <option value="sans-serif">Moderno (Sans-serif)</option>
                        <option value="serif">Elegante (Serif)</option>
                        <option value="'Courier New', monospace">Clásico (Monospace)</option>
                        <option value="cursive">Romántico (Cursive)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="carousel" value={data.emojis.carousel} onChange={handleEmojiChange} style={{width:'30px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)'}} />
                    <span>Carrusel Automático (5s)</span>
                  </div>
                  <button onClick={() => toggleVisibility('carousel')} className={styles.toggleBtn}>
                    {data.visibility.carousel ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.carousel && (
                  <div className={styles.moduleBody}>
                    <CldUploadWidget signatureEndpoint="/api/cloudinary" onSuccess={(res) => handleUploadSuccess(res, 'carouselPhotos')} options={{ multiple: true }}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className={styles.secondaryBtn} style={{marginBottom:'1rem'}}>
                          + Subir Fotos al Carrusel
                        </button>
                      )}
                    </CldUploadWidget>
                    
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.5rem'}}>
                      {data.carouselPhotos.map((photo, i) => (
                        <div key={i} style={{position:'relative', aspectRatio:'1', borderRadius:'8px', overflow:'hidden', border:'1px solid var(--border-color)'}}>
                          <img src={photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                          <button 
                            type="button" 
                            onClick={() => removeCarouselPhoto(i)}
                            style={{position:'absolute', top:'4px', right:'4px', background:'rgba(239, 68, 68, 0.9)', color:'white', borderRadius:'50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="location" value={data.emojis.location} onChange={handleEmojiChange} style={{width:'30px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)'}} />
                    <span>Ubicación</span>
                  </div>
                  <button onClick={() => toggleVisibility('location')} className={styles.toggleBtn}>
                    {data.visibility.location ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.location && (
                  <div className={styles.moduleBody}>
                    <label style={{fontSize:'0.875rem'}}>Nombre del lugar / Dirección:</label>
                    <textarea name="location" value={data.location} onChange={handleChange} className={styles.input} rows={2} style={{marginTop:'0.5rem', marginBottom:'1rem'}} />
                    <label style={{fontSize:'0.875rem'}}>Enlace de Google Maps:</label>
                    <input type="text" name="locationUrl" value={data.locationUrl} onChange={handleChange} className={styles.input} placeholder="https://maps.google.com/..." style={{marginTop:'0.5rem'}} />
                  </div>
                )}
              </div>
              
              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="gifts" value={data.emojis.gifts} onChange={handleEmojiChange} style={{width:'30px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)'}} />
                    <span>Mesa de Regalos (Max 3)</span>
                  </div>
                  <button onClick={() => toggleVisibility('gifts')} className={styles.toggleBtn}>
                    {data.visibility.gifts ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.gifts && (
                  <div className={styles.moduleBody}>
                    {data.gifts.map((g, i) => (
                      <div key={g.id} style={{marginBottom:'1rem', padding:'1rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px'}}>
                        <input type="text" value={g.store} onChange={e => updateGift(i, 'store', e.target.value)} placeholder="Tienda" className={styles.input} style={{marginBottom:'0.5rem'}} />
                        <input type="text" value={g.url} onChange={e => updateGift(i, 'url', e.target.value)} placeholder="Enlace" className={styles.input} style={{marginBottom:'0.5rem'}} />
                        <button onClick={() => removeGift(i)} style={{color:'var(--accent-color)', fontSize:'0.875rem'}}>Eliminar</button>
                      </div>
                    ))}
                    {data.gifts.length < 3 && (
                      <button onClick={addGift} className={styles.secondaryBtn}>+ Agregar Mesa</button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="whatsapp" value={data.emojis.whatsapp} onChange={handleEmojiChange} style={{width:'30px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)'}} />
                    <span>Confirmación WhatsApp</span>
                  </div>
                  <button onClick={() => toggleVisibility('whatsapp')} className={styles.toggleBtn}>
                    {data.visibility.whatsapp ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.whatsapp && (
                  <div className={styles.moduleBody}>
                    <input type="text" name="whatsapp" value={data.whatsapp} onChange={handleChange} className={styles.input} placeholder="Número con código de país" />
                  </div>
                )}
              </div>

            </section>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={styles.previewPanel}>
          <div className={styles.previewContainer}>
            <div className={styles.mobileFrame}>
              {/* Contenedor principal dinámico */}
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
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.emojis.countdown}</div>
                      <h3 style={{fontFamily: data.design.font}}>Faltan</h3>
                      <Countdown 
                        targetDate={data.date} 
                        bgColor={data.countdownDesign.bgColor} 
                        textColor={data.countdownDesign.textColor} 
                        font={data.countdownDesign.font} 
                      />
                    </div>
                  )}

                  {data.visibility.carousel && (
                    <div className={styles.previewSection}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.emojis.carousel}</div>
                      <h3 style={{fontFamily: data.design.font}}>Nuestros Momentos</h3>
                      <AutoCarousel photos={data.carouselPhotos} />
                    </div>
                  )}

                  {data.visibility.location && (
                    <div className={styles.previewSection}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.emojis.location}</div>
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
                  )}
                  
                  {data.visibility.gifts && data.gifts.length > 0 && (
                    <div className={styles.previewSection}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.emojis.gifts}</div>
                      <h3 style={{fontFamily: data.design.font}}>Mesa de Regalos</h3>
                      <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        {data.gifts.map((g,i) => (
                          <a key={g.id || i} href={g.url || "#"} target="_blank" rel="noreferrer" style={{padding:'0.75rem', background:'rgba(0,0,0,0.05)', borderRadius:'8px', border:`1px solid ${data.design.textColor}30`, color:data.design.textColor, textDecoration: 'none', display: 'block', fontSize: '0.95rem'}}>
                            {g.store || "Nueva Mesa (Ej. Liverpool)"}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.visibility.whatsapp && (
                    <div className={styles.previewSection} style={{ paddingBottom: '3rem' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.emojis.whatsapp}</div>
                      <button className={styles.whatsappBtn}>
                        Confirmar Asistencia
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className={styles.modalOverlay}>
            <div className={`glass ${styles.modal}`}>
              <h2 style={{ marginBottom: "1rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={24} color="var(--primary-color)" /> ¡Invitación Publicada!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Tu invitación está lista. No necesitas exportarla como archivo, simplemente comparte este enlace único. Es más rápido, no gasta memoria en los teléfonos de tus invitados y se abre al instante en cualquier celular.
              </p>
              
              <div style={{background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', wordBreak: 'break-all'}}>
                <code>{publicUrl}</code>
              </div>

              <div className={styles.modalActions} style={{flexDirection: 'column'}}>
                <button 
                  className={styles.saveBtn} 
                  style={{width: '100%', justifyContent: 'center'}}
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                >
                  <Copy size={18} /> Copiar Enlace
                </button>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.whatsappBtn}
                  style={{width: '100%', justifyContent: 'center'}}
                >
                  <MessageCircle size={18} /> Compartir directo a WhatsApp
                </a>
                <button className={styles.cancelBtn} onClick={() => setShowShareModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
