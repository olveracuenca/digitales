import React from 'react';
import styles from "./editor.module.css";
import { Save, Image as ImageIcon, Eye, EyeOff, Palette, MapPin } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';
import { TemplateData } from './types';

export default function TemplateForm({ 
  id, data, setData, saving, handleSave, toggleVisibility, handleChange, handleDesignChange, 
  handleCountdownDesignChange, handleEmojiChange, handleQuoteChange, handleUploadSuccess, 
  removeCarouselPhoto, addGift, updateGift, removeGift, addItineraryItem, updateItineraryItem, 
  removeItineraryItem 
}: any) {
  return (
    <>
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
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div className={styles.inputGroup}>
                  <label>Tipo de Letra Principal</label>
                  <select name="font" value={data.design.font} onChange={handleDesignChange} className={styles.input}>
                    <option value="serif">Elegante Básica (Serif)</option>
                    <option value="sans-serif">Moderna Básica (Sans-Serif)</option>
                    <option value="'Playfair Display', serif">Clásica (Playfair Display)</option>
                    <option value="'Lora', serif">Sofisticada (Lora)</option>
                    <option value="'Montserrat', sans-serif">Limpia (Montserrat)</option>
                    <option value="'Cinzel', serif">Épica (Cinzel)</option>
                    <option value="'Dancing Script', cursive">Cursiva Romántica (Dancing Script)</option>
                    <option value="'Great Vibes', cursive">Cursiva Elegante (Great Vibes)</option>
                    <option value="'Pacifico', cursive">Cursiva Casual (Pacifico)</option>
                    <option value="'Amatic SC', cursive">Divertida (Amatic SC)</option>
</select>
                </div>
                
              </div>

              {/* Decoraciones (solo si la plantilla lo soporta o está encendido) */}
              {id === 't-xv-02' && (
                <div className={styles.moduleItem}>
                  <div className={styles.moduleHeader}>
                    <div className={styles.moduleTitle}>
                      <span>🎨 Decoraciones de Esquinas</span>
                    </div>
                    <button onClick={() => toggleVisibility('decorations')} className={styles.toggleBtn}>
                      {data.visibility.decorations ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {data.visibility.decorations && (
                    <div className={styles.moduleBody}>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
                        <div>
                          <label style={{fontSize:'0.75rem', display:'block', marginBottom:'0.25rem'}}>Sup. Izquierda</label>
                          <input type="text" value={data.decorations?.topLeft || ''} onChange={(e) => setData({...data, decorations: {...data.decorations, topLeft: e.target.value}})} className={styles.input} style={{fontSize:'0.75rem', padding:'0.25rem'}} placeholder="URL imagen png" />
                        </div>
                        <div>
                          <label style={{fontSize:'0.75rem', display:'block', marginBottom:'0.25rem'}}>Sup. Derecha</label>
                          <input type="text" value={data.decorations?.topRight || ''} onChange={(e) => setData({...data, decorations: {...data.decorations, topRight: e.target.value}})} className={styles.input} style={{fontSize:'0.75rem', padding:'0.25rem'}} placeholder="URL imagen png" />
                        </div>
                        <div>
                          <label style={{fontSize:'0.75rem', display:'block', marginBottom:'0.25rem'}}>Inf. Izquierda</label>
                          <input type="text" value={data.decorations?.bottomLeft || ''} onChange={(e) => setData({...data, decorations: {...data.decorations, bottomLeft: e.target.value}})} className={styles.input} style={{fontSize:'0.75rem', padding:'0.25rem'}} placeholder="URL imagen png" />
                        </div>
                        <div>
                          <label style={{fontSize:'0.75rem', display:'block', marginBottom:'0.25rem'}}>Inf. Derecha</label>
                          <input type="text" value={data.decorations?.bottomRight || ''} onChange={(e) => setData({...data, decorations: {...data.decorations, bottomRight: e.target.value}})} className={styles.input} style={{fontSize:'0.75rem', padding:'0.25rem'}} placeholder="URL imagen png" />
                        </div>
                      </div>
                      <p style={{fontSize:'0.75rem', marginTop:'0.5rem', color:'var(--text-secondary)'}}>Sugerencia: Usa enlaces a imágenes PNG transparentes (ej. nubes, hojas).</p>
                    </div>
                  )}
                </div>
              )}

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
                    <input type="text" name="falling" value={data.emojis.falling} onChange={handleEmojiChange} className={styles.input} style={{marginTop:'0.5rem', color: 'white'}} />
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
              <div className={styles.inputGroup} style={{marginTop: '1rem'}}>
                <label>Tipo de Letra del Título</label>
                <select name="titleFont" value={data.design.titleFont || data.design.font} onChange={handleDesignChange} className={styles.input}>

                    <option value="serif">Elegante Básica (Serif)</option>
                    <option value="sans-serif">Moderna Básica (Sans-Serif)</option>
                    <option value="'Playfair Display', serif">Clásica (Playfair Display)</option>
                    <option value="'Lora', serif">Sofisticada (Lora)</option>
                    <option value="'Montserrat', sans-serif">Limpia (Montserrat)</option>
                    <option value="'Cinzel', serif">Épica (Cinzel)</option>
                    <option value="'Dancing Script', cursive">Cursiva Romántica (Dancing Script)</option>
                    <option value="'Great Vibes', cursive">Cursiva Elegante (Great Vibes)</option>
                    <option value="'Pacifico', cursive">Cursiva Casual (Pacifico)</option>
                    <option value="'Amatic SC', cursive">Divertida (Amatic SC)</option>

                </select>
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

                                              <option value="serif">Elegante Básica (Serif)</option>
                                              <option value="sans-serif">Moderna Básica (Sans-Serif)</option>
                                              <option value="'Playfair Display', serif">Clásica (Playfair Display)</option>
                                              <option value="'Lora', serif">Sofisticada (Lora)</option>
                                              <option value="'Montserrat', sans-serif">Limpia (Montserrat)</option>
                                              <option value="'Cinzel', serif">Épica (Cinzel)</option>
                                              <option value="'Dancing Script', cursive">Cursiva Romántica (Dancing Script)</option>
                                              <option value="'Great Vibes', cursive">Cursiva Elegante (Great Vibes)</option>
                                              <option value="'Pacifico', cursive">Cursiva Casual (Pacifico)</option>
                                              <option value="'Amatic SC', cursive">Divertida (Amatic SC)</option>

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
                    <input type="text" name="countdown" value={data.emojis.countdown} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
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

                                              <option value="serif">Elegante Básica (Serif)</option>
                                              <option value="sans-serif">Moderna Básica (Sans-Serif)</option>
                                              <option value="'Playfair Display', serif">Clásica (Playfair Display)</option>
                                              <option value="'Lora', serif">Sofisticada (Lora)</option>
                                              <option value="'Montserrat', sans-serif">Limpia (Montserrat)</option>
                                              <option value="'Cinzel', serif">Épica (Cinzel)</option>
                                              <option value="'Dancing Script', cursive">Cursiva Romántica (Dancing Script)</option>
                                              <option value="'Great Vibes', cursive">Cursiva Elegante (Great Vibes)</option>
                                              <option value="'Pacifico', cursive">Cursiva Casual (Pacifico)</option>
                                              <option value="'Amatic SC', cursive">Divertida (Amatic SC)</option>

                        </select>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="carousel" value={data.emojis.carousel} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
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
                      {data.carouselPhotos.map((photo: string, i: number) => (
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
                    <input type="text" name="location" value={data.emojis.location} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
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
                    <label style={{fontSize:'0.875rem', display: 'block', marginTop: '0.5rem'}}>Dirección específica:</label>
                    <textarea name="address" value={data.address} onChange={handleChange} className={styles.input} rows={2} style={{marginTop:'0.5rem', marginBottom:'1rem'}} placeholder="Ej. Av. Siempre Viva 123" />
                    <label style={{fontSize:'0.875rem'}}>Enlace de Google Maps:</label>
                    <input type="text" name="locationUrl" value={data.locationUrl} onChange={handleChange} className={styles.input} placeholder="https://maps.google.com/..." style={{marginTop:'0.5rem'}} />
                  </div>
                )}
              </div>
              
              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="secondaryLocation" value={data.emojis.secondaryLocation} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Ubicación Secundaria (Misa/Recepción)</span>
                  </div>
                  <button onClick={() => toggleVisibility('secondaryLocation')} className={styles.toggleBtn}>
                    {data.visibility.secondaryLocation ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.secondaryLocation && (
                  <div className={styles.moduleBody}>
                    <label style={{fontSize:'0.875rem'}}>Nombre del lugar / Dirección (Secundaria):</label>
                    <textarea name="secondaryLocation" value={data.secondaryLocation} onChange={handleChange} className={styles.input} rows={2} style={{marginTop:'0.5rem', marginBottom:'1rem'}} />
                    <label style={{fontSize:'0.875rem', display: 'block', marginTop: '0.5rem'}}>Dirección específica:</label>
                    <textarea name="secondaryAddress" value={data.secondaryAddress} onChange={handleChange} className={styles.input} rows={2} style={{marginTop:'0.5rem', marginBottom:'1rem'}} placeholder="Ej. Calle de la Iglesia 456" />
                    <label style={{fontSize:'0.875rem'}}>Enlace de Google Maps:</label>
                    <input type="text" name="secondaryLocationUrl" value={data.secondaryLocationUrl} onChange={handleChange} className={styles.input} placeholder="https://maps.google.com/..." style={{marginTop:'0.5rem'}} />
                  </div>
                )}
              </div>

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="gifts" value={data.emojis.gifts} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Mesa de Regalos (Max 3)</span>
                  </div>
                  <button onClick={() => toggleVisibility('gifts')} className={styles.toggleBtn}>
                    {data.visibility.gifts ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.gifts && (
                  <div className={styles.moduleBody}>
                    {data.gifts.map((g: any, i: number) => (
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
                    <input type="text" name="whatsapp" value={data.emojis.whatsapp} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
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

              <div className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>
                    <input type="text" name="itinerary" value={data.emojis.itinerary} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Itinerario (Timeline)</span>
                  </div>
                  <button onClick={() => toggleVisibility('itinerary')} className={styles.toggleBtn}>
                    {data.visibility.itinerary ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.itinerary && (
                  <div className={styles.moduleBody}>
                    {data.itinerary.map((item: any, i: number) => (
                      <div key={item.id} style={{marginBottom:'1rem', padding:'1rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px'}}>
                        <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <input type="text" value={item.time} onChange={e => updateItineraryItem(i, 'time', e.target.value)} placeholder="Ej. 20:00 hs" className={styles.input} style={{flex: 1}} />
                          <input type="text" value={item.icon} onChange={e => updateItineraryItem(i, 'icon', e.target.value)} placeholder="Icono HTML" className={styles.input} style={{flex: 1, minWidth: '120px', textAlign: 'center', color: 'white'}} />
                        </div>
                        <input type="text" value={item.title} onChange={e => updateItineraryItem(i, 'title', e.target.value)} placeholder="Ej. Ceremonia" className={styles.input} style={{marginBottom:'0.5rem'}} />
                        <button onClick={() => removeItineraryItem(i)} style={{color:'var(--accent-color)', fontSize:'0.875rem'}}>Eliminar</button>
                      </div>
                    ))}
                    <button onClick={addItineraryItem} className={styles.secondaryBtn}>+ Agregar Evento</button>
                  </div>
                )}
              </div>

              {/* Dress Code */}
              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <input type="text" name="dressCode" value={data.emojis.dressCode} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Código de Vestimenta</span>
                  </div>
                  <button onClick={() => toggleVisibility('dressCode')} className={styles.toggleBtn}>
                    {data.visibility.dressCode ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.dressCode && (
                  <div className={styles.moduleBody}>
                    <label className={styles.label}>Para Él</label>
                    <input type="text" value={data.dressCode?.him || ''} onChange={e => setData({...data, dressCode: {...data.dressCode, him: e.target.value}})} className={styles.input} />
                    
                    <label className={styles.label}>Para Ella</label>
                    <input type="text" value={data.dressCode?.her || ''} onChange={e => setData({...data, dressCode: {...data.dressCode, her: e.target.value}})} className={styles.input} />
                    
                    <label className={styles.label}>General (Opcional)</label>
                    <input type="text" value={data.dressCode?.general || ''} onChange={e => setData({...data, dressCode: {...data.dressCode, general: e.target.value}})} className={styles.input} />
                  </div>
                )}
              </div>

              {/* General Gift */}
              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <input type="text" name="generalGift" value={data.emojis.generalGift} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Regalo General</span>
                  </div>
                  <button onClick={() => toggleVisibility('generalGift')} className={styles.toggleBtn}>
                    {data.visibility.generalGift ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.generalGift && (
                  <div className={styles.moduleBody}>
                    <textarea 
                      value={data.generalGift} 
                      onChange={e => setData({...data, generalGift: e.target.value})} 
                      className={styles.input} 
                      rows={3} 
                      placeholder="Ej. No olvides llevar tu regalo." 
                    />
                  </div>
                )}
              </div>

              {/* RSVP */}
              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <input type="text" name="rsvp" value={data.emojis.rsvp} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Confirmación de Asistencia (RSVP Público)</span>
                  </div>
                  <button onClick={() => toggleVisibility('rsvp')} className={styles.toggleBtn}>
                    {data.visibility.rsvp ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.rsvp && (
                  <div className={styles.moduleBody}>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                      Al habilitar esta opción, aparecerá un formulario público al final de la invitación para que los invitados puedan confirmar su asistencia. Podrás ver los resultados en el Panel de Administración.
                    </p>
                  </div>
                )}
              </div>

              {/* General Text */}
              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <input type="text" name="generalText" value={data.emojis.generalText} onChange={handleEmojiChange} style={{width:'120px', background:'transparent', border:'none', fontSize:'1.2rem', textAlign:'center', borderBottom:'1px solid var(--border-color)', color: 'white'}} />
                    <span>Texto General</span>
                  </div>
                  <button onClick={() => toggleVisibility('generalText')} className={styles.toggleBtn}>
                    {data.visibility.generalText ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {data.visibility.generalText && (
                  <div className={styles.moduleBody}>
                    <textarea 
                      value={data.generalText} 
                      onChange={e => setData({...data, generalText: e.target.value})} 
                      className={styles.input} 
                      rows={3} 
                      placeholder="Ej. Llevar tu cerveza favorita." 
                    />
                  </div>
                )}
              </div>

            </section>
          </div>
        </div>
    </>
  );
}
