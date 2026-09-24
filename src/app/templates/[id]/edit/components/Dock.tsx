"use client";

import React, { useState } from 'react';
import { 
  Layers, PlusCircle, Palette, LayoutTemplate, Eye, EyeOff, Lock, Unlock, 
  Trash2, Copy, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, Music, 
  MapPin, Clock, Gift, Shirt, MessageCircle, FileText, CheckCircle2, 
  Calendar, CreditCard, Heart, HelpCircle
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { TemplateData, SectionBlock, SectionBlockType } from '../types';
import styles from '../editor.module.css';

interface DockProps {
  data: TemplateData;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onAddSection: (type: SectionBlockType) => void;
  onRemoveSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onMoveSection: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onChangeGlobalDesign: (field: string, value: any) => void;
  onLoadTemplatePreset: (presetId: string) => void;
  onUploadSuccess: (res: any, field: string) => void;
}

export default function Dock({
  data,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onDuplicateSection,
  onMoveSection,
  onToggleVisibility,
  onToggleLock,
  onChangeGlobalDesign,
  onLoadTemplatePreset,
  onUploadSuccess,
}: DockProps) {
  const [activeTab, setActiveTab] = useState<'layers' | 'blocks' | 'styles' | 'templates'>('layers');

  // Obtener icono según el tipo de bloque
  const getSectionIcon = (type: SectionBlockType) => {
    switch (type) {
      case 'hero': return <ImageIcon size={16} className={styles.typeIcon} />;
      case 'quote': return <Heart size={16} className={styles.typeIcon} />;
      case 'countdown': return <Clock size={16} className={styles.typeIcon} />;
      case 'datetime': return <Calendar size={16} className={styles.typeIcon} />;
      case 'carousel': return <ImageIcon size={16} className={styles.typeIcon} />;
      case 'photoFrame': return <ImageIcon size={16} className={styles.typeIcon} />;
      case 'location': return <MapPin size={16} className={styles.typeIcon} />;
      case 'secondaryLocation': return <MapPin size={16} className={styles.typeIcon} />;
      case 'itinerary': return <FileText size={16} className={styles.typeIcon} />;
      case 'dressCode': return <Shirt size={16} className={styles.typeIcon} />;
      case 'gifts': return <Gift size={16} className={styles.typeIcon} />;
      case 'bankDetails': return <CreditCard size={16} className={styles.typeIcon} />;
      case 'generalText': return <FileText size={16} className={styles.typeIcon} />;
      case 'whatsappRsvp': return <MessageCircle size={16} className={styles.typeIcon} />;
      case 'rsvpForm': return <CheckCircle2 size={16} className={styles.typeIcon} />;
      default: return <HelpCircle size={16} className={styles.typeIcon} />;
    }
  };

  return (
    <aside className={styles.leftDock}>
      {/* Barra de pestañas vertical (Estilo Canon CP1500) */}
      <nav className={styles.dockNav}>
        <button 
          className={`${styles.navTabBtn} ${activeTab === 'layers' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('layers')}
          title="Capas y Secciones del Proyecto"
        >
          <Layers size={18} />
          <span>Capas</span>
          <span className={styles.badgeCount}>{data.sections.length}</span>
        </button>

        <button 
          className={`${styles.navTabBtn} ${activeTab === 'blocks' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('blocks')}
          title="Agregar Bloques y Elementos"
        >
          <PlusCircle size={18} />
          <span>Agregar</span>
        </button>

        <button 
          className={`${styles.navTabBtn} ${activeTab === 'styles' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('styles')}
          title="Diseño y Estilos Globales"
        >
          <Palette size={18} />
          <span>Estilos</span>
        </button>

        <button 
          className={`${styles.navTabBtn} ${activeTab === 'templates' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('templates')}
          title="Plantillas Pre-diseñadas"
        >
          <LayoutTemplate size={18} />
          <span>Plantillas</span>
        </button>
      </nav>

      {/* Contenido del Dock */}
      <div className={styles.dockContent}>
        {/* =========================================================================
            TAB 1: GESTIÓN DE CAPAS Y SECCIONES
           ========================================================================= */}
        {activeTab === 'layers' && (
          <div className={styles.tabPane}>
            <div className={styles.dockHeader}>
              <div>
                <h3 className={styles.dockTitle}>Capas del Proyecto</h3>
                <p className={styles.dockSubtitle}>
                  {data.sections.length} secciones en tu invitación. Puedes reordenarlas, duplicarlas o eliminarlas.
                </p>
              </div>
            </div>

            {data.sections.length === 0 ? (
              <div className={styles.emptyLayers}>
                <Layers size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
                <p>Tu invitación no tiene secciones todavía.</p>
                <button 
                  className={styles.primaryActionBtn} 
                  onClick={() => setActiveTab('blocks')}
                  style={{ marginTop: '1rem' }}
                >
                  <PlusCircle size={16} /> Agregar Primera Sección
                </button>
              </div>
            ) : (
              <div className={styles.layerList}>
                {data.sections.map((section, index) => {
                  const isSelected = selectedSectionId === section.id;
                  return (
                    <div 
                      key={section.id} 
                      className={`${styles.layerItem} ${isSelected ? styles.layerItemSelected : ''} ${!section.visible ? styles.layerHidden : ''}`}
                      onClick={() => onSelectSection(section.id)}
                    >
                      <div className={styles.layerLeft}>
                        <span className={styles.layerIndexBadge}>{index + 1}</span>
                        {getSectionIcon(section.type)}
                        <span className={styles.layerName} title={section.title}>
                          {section.title}
                        </span>
                      </div>

                      <div className={styles.layerActions} onClick={(e) => e.stopPropagation()}>
                        {/* Subir */}
                        <button 
                          className={styles.layerMiniBtn} 
                          title="Subir posición"
                          disabled={index === 0}
                          onClick={() => onMoveSection(section.id, 'up')}
                        >
                          <ArrowUp size={13} />
                        </button>

                        {/* Bajar */}
                        <button 
                          className={styles.layerMiniBtn} 
                          title="Bajar posición"
                          disabled={index === data.sections.length - 1}
                          onClick={() => onMoveSection(section.id, 'down')}
                        >
                          <ArrowDown size={13} />
                        </button>

                        {/* Duplicar */}
                        <button 
                          className={styles.layerMiniBtn} 
                          title="Duplicar sección"
                          onClick={() => onDuplicateSection(section.id)}
                        >
                          <Copy size={13} />
                        </button>

                        {/* Ocultar / Mostrar */}
                        <button 
                          className={`${styles.layerMiniBtn} ${!section.visible ? styles.btnMuted : ''}`} 
                          title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
                          onClick={() => onToggleVisibility(section.id)}
                        >
                          {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>

                        {/* Eliminar */}
                        <button 
                          className={`${styles.layerMiniBtn} ${styles.btnDanger}`} 
                          title="Eliminar sección de la invitación"
                          onClick={() => onRemoveSection(section.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className={styles.secondaryActionBtn} 
                onClick={() => setActiveTab('blocks')}
                style={{ width: '100%' }}
              >
                <PlusCircle size={16} /> + Agregar Otra Sección
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CATÁLOGO DE BLOQUES (AGREGAR COSAS CON 1 CLIC)
           ========================================================================= */}
        {activeTab === 'blocks' && (
          <div className={styles.tabPane}>
            <div className={styles.dockHeader}>
              <div>
                <h3 className={styles.dockTitle}>Biblioteca de Bloques</h3>
                <p className={styles.dockSubtitle}>
                  Haz clic en cualquier elemento para añadirlo a tu invitación.
                </p>
              </div>
            </div>

            <div className={styles.blockCategories}>
              {/* Categoría 1: Fotos y Portada */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>📸 Fotos & Portada</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('hero')}>
                    <div className={styles.blockCardIcon}><ImageIcon size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Portada Principal</h4>
                      <p>Foto destacada, nombres y fecha del evento</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('carousel')}>
                    <div className={styles.blockCardIcon}><Sparkles size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Carrusel de Fotos</h4>
                      <p>Galería animada automática de recuerdos</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('photoFrame')}>
                    <div className={styles.blockCardIcon}><ImageIcon size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Foto con Marco</h4>
                      <p>Foto individual estilo Polaroid o circular</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categoría 2: Textos y Citas */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>✍️ Textos & Citas</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('quote')}>
                    <div className={styles.blockCardIcon}><Heart size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Frase / Cita Bíblica</h4>
                      <p>Pensamiento romántico con tipografía elegante</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('generalText')}>
                    <div className={styles.blockCardIcon}><FileText size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Nota / Aviso Especial</h4>
                      <p>Mensaje o indicaciones para invitados</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categoría 3: Tiempos y Fechas */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>⏳ Fechas & Cronograma</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('countdown')}>
                    <div className={styles.blockCardIcon}><Clock size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Cuenta Regresiva</h4>
                      <p>Reloj interactivo en vivo de días y horas</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('datetime')}>
                    <div className={styles.blockCardIcon}><Calendar size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Fecha & Horario</h4>
                      <p>Tarjeta destacada con día y hora del evento</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('itinerary')}>
                    <div className={styles.blockCardIcon}><FileText size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Itinerario / Timeline</h4>
                      <p>Línea de tiempo paso a paso de la celebración</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categoría 4: Ubicaciones */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>📍 Lugares & Mapas</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('location')}>
                    <div className={styles.blockCardIcon}><MapPin size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Ubicación Principal</h4>
                      <p>Salón o recepción con botón a Google Maps</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('secondaryLocation')}>
                    <div className={styles.blockCardIcon}><MapPin size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Ceremonia Religiosa / Civil</h4>
                      <p>Ubicación secundaria o misa separada</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categoría 5: Regalos & Vestimenta */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>🎁 Regalos & Detalles</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('gifts')}>
                    <div className={styles.blockCardIcon}><Gift size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Mesa de Regalos</h4>
                      <p>Botones directos a tiendas (Liverpool, Amazon)</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('bankDetails')}>
                    <div className={styles.blockCardIcon}><CreditCard size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Datos Bancarios / Sobres</h4>
                      <p>Cuenta CLABE y banco para transferencias</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('dressCode')}>
                    <div className={styles.blockCardIcon}><Shirt size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Código de Vestimenta</h4>
                      <p>Etiqueta, advertencias y paleta de colores</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categoría 6: Confirmación RSVP */}
              <div className={styles.blockCategoryGroup}>
                <span className={styles.categoryTitle}>💬 Confirmación de Asistencia</span>
                <div className={styles.blockGrid}>
                  <button className={styles.blockCardBtn} onClick={() => onAddSection('whatsappRsvp')}>
                    <div className={styles.blockCardIcon}><MessageCircle size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Confirmar por WhatsApp</h4>
                      <p>Botones con mensaje automático prellenado</p>
                    </div>
                  </button>

                  <button className={styles.blockCardBtn} onClick={() => onAddSection('rsvpForm')}>
                    <div className={styles.blockCardIcon}><CheckCircle2 size={20} /></div>
                    <div className={styles.blockCardInfo}>
                      <h4>+ Formulario Web RSVP</h4>
                      <p>Pase de invitados con confirmación en línea</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DISEÑO Y ESTILOS GLOBALES
           ========================================================================= */}
        {activeTab === 'styles' && (
          <div className={styles.tabPane}>
            <div className={styles.dockHeader}>
              <div>
                <h3 className={styles.dockTitle}>Estilo & Ambientación</h3>
                <p className={styles.dockSubtitle}>
                  Colores, tipografías, partículas animadas y música para toda la invitación.
                </p>
              </div>
            </div>

            <div className={styles.settingsFormGroup}>
              {/* Paleta de Colores */}
              <h4 className={styles.settingGroupHeading}>Colores Globales</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className={styles.colorPickerWrapper}>
                  <label>Fondo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="color" 
                      value={data.design.bgColor || '#fdfbf7'} 
                      onChange={(e) => onChangeGlobalDesign('bgColor', e.target.value)}
                      className={styles.colorCircleInput}
                    />
                    <span className={styles.colorHexCode}>{data.design.bgColor}</span>
                  </div>
                </div>

                <div className={styles.colorPickerWrapper}>
                  <label>Texto</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="color" 
                      value={data.design.textColor || '#1f2937'} 
                      onChange={(e) => onChangeGlobalDesign('textColor', e.target.value)}
                      className={styles.colorCircleInput}
                    />
                    <span className={styles.colorHexCode}>{data.design.textColor}</span>
                  </div>
                </div>
              </div>

              {/* Tipografía */}
              <h4 className={styles.settingGroupHeading}>Tipografía</h4>
              <div className={styles.fieldGroup}>
                <label>Fuente para Títulos</label>
                <select 
                  value={data.design.titleFont || data.design.font}
                  onChange={(e) => onChangeGlobalDesign('titleFont', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="serif">Elegante Clásica (Serif)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Premium)</option>
                  <option value="'Cinzel', serif">Cinzel (Épica / Monarquía)</option>
                  <option value="'Great Vibes', cursive">Great Vibes (Caligrafía Fina)</option>
                  <option value="'Dancing Script', cursive">Dancing Script (Romántica)</option>
                  <option value="'Montserrat', sans-serif">Montserrat (Moderna)</option>
                  <option value="sans-serif">Sans-Serif Básica</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label>Fuente para Contenidos</label>
                <select 
                  value={data.design.font}
                  onChange={(e) => onChangeGlobalDesign('font', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="serif">Serif (Libro clásico)</option>
                  <option value="'Montserrat', sans-serif">Montserrat (Limpia)</option>
                  <option value="sans-serif">Sans-Serif moderna</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                </select>
              </div>

              {/* Música de fondo */}
              <h4 className={styles.settingGroupHeading}>
                <Music size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Música de Fondo
              </h4>
              <div className={styles.fieldGroup}>
                <label>Archivo de Audio (MP3)</label>
                <CldUploadWidget 
                  signatureEndpoint="/api/cloudinary" 
                  onSuccess={(res) => onUploadSuccess(res, 'music')}
                  options={{ resourceType: 'auto' }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className={styles.secondaryActionBtn} style={{ width: '100%', marginBottom: '0.5rem' }}>
                      <Music size={15} style={{ marginRight: '0.5rem' }} />
                      {data.music ? 'Cambiar Archivo MP3' : 'Subir Música (MP3)'}
                    </button>
                  )}
                </CldUploadWidget>
                {data.music && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                    <span>✅ Música cargada</span>
                    <button 
                      onClick={() => onChangeGlobalDesign('music', '')}
                      style={{ color: '#ef4444', textDecoration: 'underline', fontSize: '0.75rem' }}
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {/* Lluvia de partículas animadas */}
              <h4 className={styles.settingGroupHeading}>
                <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Lluvia de Partículas (Efecto)
              </h4>
              <div className={styles.fieldGroup}>
                <label>Emojis o iconos animados (separados por espacio):</label>
                <input 
                  type="text" 
                  value={data.emojis.falling} 
                  onChange={(e) => onChangeGlobalDesign('fallingEmojis', e.target.value)}
                  className={styles.textInput}
                  placeholder="✨ 💖 🌸 💍 🥂"
                />
              </div>

              {/* Imagen de Fondo */}
              <h4 className={styles.settingGroupHeading}>Imagen / Textura de Fondo</h4>
              <div className={styles.fieldGroup}>
                <CldUploadWidget 
                  signatureEndpoint="/api/cloudinary" 
                  onSuccess={(res) => onUploadSuccess(res, 'bgImage')}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className={styles.secondaryActionBtn} style={{ width: '100%', marginBottom: '0.5rem' }}>
                      <ImageIcon size={15} style={{ marginRight: '0.5rem' }} />
                      {data.design.bgImage ? 'Cambiar Imagen de Fondo' : 'Subir Textura o Imagen'}
                    </button>
                  )}
                </CldUploadWidget>
                {data.design.bgImage && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                    <span>✅ Imagen activa</span>
                    <button 
                      onClick={() => onChangeGlobalDesign('bgImage', '')}
                      style={{ color: '#ef4444', textDecoration: 'underline', fontSize: '0.75rem' }}
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: PLANTILLAS PREDISEÑADAS
           ========================================================================= */}
        {activeTab === 'templates' && (
          <div className={styles.tabPane}>
            <div className={styles.dockHeader}>
              <div>
                <h3 className={styles.dockTitle}>Plantillas Rápidas</h3>
                <p className={styles.dockSubtitle}>
                  Selecciona una temática base para cargar su estructura y diseño.
                </p>
              </div>
            </div>

            <div className={styles.templatePresetsGrid}>
              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-boda-01')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}></div>
                <h4>Boda Elegance</h4>
                <p>Estilo romántico crema y azul marino con carrusel</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-baby-shower')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #f472b6, #fb7185)' }}></div>
                <h4>Baby Shower (Grettell)</h4>
                <p>Tonos pastel tiernos, conejito y nubes suaves</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-xv-01')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}></div>
                <h4>Mis XV Años</h4>
                <p>Tonos rosa y dorado, corona y sesión de fotos</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-boda-02')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #0d9488, #2dd4bf)' }}></div>
                <h4>Boda de Playa</h4>
                <p>Turquesa y arena con código de guayabera</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-boda-03')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #0f172a, #a855f7)' }}></div>
                <h4>Boda Noche (Dark)</h4>
                <p>Modo oscuro premium con acentos púrpura y luna</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-boda-04')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #ca8a04, #eab308)' }}></div>
                <h4>Boda Girasoles (Pro)</h4>
                <p>Colores campestres, cálidos y alegres</p>
              </div>

              <div className={styles.templatePresetCard} onClick={() => onLoadTemplatePreset('t-bautizo-01')}>
                <div className={styles.presetColorBar} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}></div>
                <h4>Bautizo Serenity</h4>
                <p>Celeste y blanco con paloma de la paz</p>
              </div>

              <div className={`${styles.templatePresetCard} ${styles.presetBlankCard}`} onClick={() => onLoadTemplatePreset('blank')}>
                <div className={styles.presetColorBar} style={{ background: '#334155' }}></div>
                <h4>✨ Lienzo en Blanco</h4>
                <p>Comienza desde cero y añade solo lo que tú decidas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
