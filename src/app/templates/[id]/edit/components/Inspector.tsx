"use client";

import React, { useState } from 'react';
import { 
  Trash2, Copy, ArrowUp, ArrowDown, Eye, EyeOff, Image as ImageIcon, 
  Plus, X, Settings, Sparkles, MapPin, Calendar, Clock, Heart, 
  Gift, CreditCard, Shirt, MessageCircle, FileText, CheckCircle2 
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import SafeIcon from '@/components/SafeIcon';
import { TemplateData, SectionBlock } from '../types';
import styles from '../editor.module.css';

interface InspectorProps {
  data: TemplateData;
  selectedSectionId: string | null;
  onUpdateSection: (id: string, newFields: Partial<SectionBlock>) => void;
  onUpdateSectionData: (id: string, key: string, value: any) => void;
  onMoveSection: (id: string, direction: 'up' | 'down') => void;
  onDuplicateSection: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onChangeGlobalMeta: (key: string, value: any) => void;
  onUploadSuccess: (res: any, field: string) => void;
}

export default function Inspector({
  data,
  selectedSectionId,
  onUpdateSection,
  onUpdateSectionData,
  onMoveSection,
  onDuplicateSection,
  onRemoveSection,
  onToggleVisibility,
  onChangeGlobalMeta,
  onUploadSuccess,
}: InspectorProps) {
  const selectedSection = data.sections.find((s) => s.id === selectedSectionId);

  // Si no hay sección seleccionada, mostramos información global del evento
  if (!selectedSection) {
    return (
      <aside className={styles.rightInspector}>
        <div className={styles.inspectorHeader}>
          <div className={styles.inspectorHeaderTitle}>
            <Settings size={18} color="var(--primary-color)" />
            <h3>Ajustes del Evento</h3>
          </div>
        </div>

        <div className={styles.inspectorBody}>
          <div className={styles.inspectorHintBox}>
            <Sparkles size={18} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
            <h4>Editor Interactivo</h4>
            <p>Haz clic en cualquier sección dentro del celular o en el panel de Capas para editar sus propiedades específicas.</p>
          </div>

          <div className={styles.fieldGroup}>
            <label>Nombre Interno del Evento (Admin)</label>
            <input 
              type="text" 
              value={data.eventName} 
              onChange={(e) => onChangeGlobalMeta('eventName', e.target.value)}
              className={styles.textInput}
              placeholder="Ej. Boda Luis y Ana"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Título Principal</label>
            <input 
              type="text" 
              value={data.title} 
              onChange={(e) => onChangeGlobalMeta('title', e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Subtítulo / Nombres</label>
            <input 
              type="text" 
              value={data.subtitle} 
              onChange={(e) => onChangeGlobalMeta('subtitle', e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Fecha y Hora General del Evento</label>
            <input 
              type="datetime-local" 
              value={data.date ? data.date.slice(0, 16) : ''} 
              onChange={(e) => onChangeGlobalMeta('date', e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.summaryBox}>
            <h4>Resumen del Proyecto</h4>
            <div className={styles.summaryItem}>
              <span>Total de Secciones:</span>
              <strong>{data.sections.length}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Secciones Activas:</span>
              <strong>{data.sections.filter(s => s.visible).length}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Música de Fondo:</span>
              <strong>{data.music ? 'Activa' : 'Sin audio'}</strong>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // --- INSPECTOR CONTEXTUAL PARA LA SECCIÓN SELECCIONADA ---
  const { id, type, title, visible, data: sData } = selectedSection;

  // Subir fotos para carrusel específico de la sección
  const handleSectionCarouselUpload = (res: any) => {
    if (res?.info?.secure_url) {
      const current = Array.isArray(sData.photos) ? sData.photos : [];
      onUpdateSectionData(id, 'photos', [...current, res.info.secure_url]);
    }
  };

  // Subir foto individual
  const handleSectionPhotoUpload = (res: any, fieldName: string) => {
    if (res?.info?.secure_url) {
      onUpdateSectionData(id, fieldName, res.info.secure_url);
    }
  };

  // Agregar paso de itinerario
  const addItineraryStep = () => {
    const current = Array.isArray(sData.items) ? [...sData.items] : [];
    current.push({ id: Date.now(), time: '21:00 hs', title: 'Nuevo Momento', icon: '✨' });
    onUpdateSectionData(id, 'items', current);
  };

  const updateItineraryStep = (idx: number, field: string, value: string) => {
    const current = Array.isArray(sData.items) ? [...sData.items] : [];
    current[idx] = { ...current[idx], [field]: value };
    onUpdateSectionData(id, 'items', current);
  };

  const removeItineraryStep = (idx: number) => {
    const current = Array.isArray(sData.items) ? [...sData.items] : [];
    onUpdateSectionData(id, 'items', current.filter((_, i) => i !== idx));
  };

  // Agregar tienda a mesa de regalos
  const addGiftStore = () => {
    const current = Array.isArray(sData.stores) ? [...sData.stores] : [];
    current.push({ id: Date.now(), store: 'Liverpool', url: 'https://liverpool.com.mx' });
    onUpdateSectionData(id, 'stores', current);
  };

  const updateGiftStore = (idx: number, field: string, value: string) => {
    const current = Array.isArray(sData.stores) ? [...sData.stores] : [];
    current[idx] = { ...current[idx], [field]: value };
    onUpdateSectionData(id, 'stores', current);
  };

  const removeGiftStore = (idx: number) => {
    const current = Array.isArray(sData.stores) ? [...sData.stores] : [];
    onUpdateSectionData(id, 'stores', current.filter((_, i) => i !== idx));
  };

  const [activeStepIconIdx, setActiveStepIconIdx] = useState<number | null>(null);

  const renderSectionIconField = (
    label: string, 
    currentIcon: string | undefined, 
    fallback: string, 
    fieldKey: string, 
    quickOptions: string[]
  ) => {
    return (
      <div className={styles.fieldGroup}>
        <label>{label}</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className={styles.iconPreviewBadge} title="Vista previa del icono">
            <SafeIcon icon={currentIcon || fallback} />
          </div>
          <input 
            type="text" 
            value={currentIcon || ''} 
            onChange={(e) => onUpdateSectionData(id, fieldKey, e.target.value)}
            placeholder={`Ej. ${fallback} o <i class="fa-solid ..."></i>`}
            className={styles.textInput}
            style={{ flex: 1 }}
          />
        </div>
        <div className={styles.iconQuickChips}>
          {quickOptions.map((opt, oIdx) => (
            <button 
              key={oIdx} 
              type="button" 
              className={`${styles.iconChipBtn} ${currentIcon === opt ? styles.activeChoice : ''}`}
              onClick={() => onUpdateSectionData(id, fieldKey, opt)}
              title="Seleccionar icono"
            >
              <SafeIcon icon={opt} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className={styles.rightInspector}>
      {/* Encabezado del Inspector */}
      <div className={styles.inspectorHeader}>
        <div className={styles.inspectorHeaderTitle}>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => onUpdateSection(id, { title: e.target.value })}
            className={styles.titleEditInput}
            title="Haz clic para renombrar esta sección en el panel de capas"
          />
        </div>

        <div className={styles.headerMiniActions}>
          <button 
            className={styles.layerMiniBtn} 
            title={visible ? 'Ocultar en la invitación' : 'Mostrar en la invitación'}
            onClick={() => onToggleVisibility(id)}
          >
            {visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button 
            className={`${styles.layerMiniBtn} ${styles.btnDanger}`} 
            title="Eliminar esta sección"
            onClick={() => onRemoveSection(id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className={styles.inspectorBody}>
        {/* ======================= HERO ======================= */}
        {type === 'hero' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Etiqueta Superior</label>
              <input 
                type="text" 
                value={sData.badgeText || ''} 
                onChange={(e) => onUpdateSectionData(id, 'badgeText', e.target.value)}
                className={styles.textInput}
                placeholder="¡Te invitamos a celebrar!"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Título de la Portada</label>
              <input 
                type="text" 
                value={sData.title || ''} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Subtítulo / Nombres</label>
              <input 
                type="text" 
                value={sData.subtitle || ''} 
                onChange={(e) => onUpdateSectionData(id, 'subtitle', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Foto Principal</label>
              <CldUploadWidget 
                signatureEndpoint="/api/cloudinary" 
                onSuccess={(res) => handleSectionPhotoUpload(res, 'mainPhoto')}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className={styles.secondaryActionBtn} style={{ width: '100%', marginBottom: '0.5rem' }}>
                    <ImageIcon size={15} style={{ marginRight: '0.5rem' }} />
                    Cambiar Foto de Portada
                  </button>
                )}
              </CldUploadWidget>
              <input 
                type="text" 
                value={sData.mainPhoto || ''} 
                onChange={(e) => onUpdateSectionData(id, 'mainPhoto', e.target.value)}
                className={styles.textInput}
                placeholder="https://..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Oscuridad del Fondo ({Math.round((sData.overlayDarkness !== undefined ? sData.overlayDarkness : 0.65) * 100)}%)</label>
              <input 
                type="range" 
                min="0.1" 
                max="0.9" 
                step="0.05"
                value={sData.overlayDarkness !== undefined ? sData.overlayDarkness : 0.65} 
                onChange={(e) => onUpdateSectionData(id, 'overlayDarkness', parseFloat(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>
        )}

        {/* ======================= QUOTE ======================= */}
        {type === 'quote' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Texto de la Frase / Dedicatoria</label>
              <textarea 
                rows={4}
                value={sData.text || ''} 
                onChange={(e) => onUpdateSectionData(id, 'text', e.target.value)}
                className={styles.textareaInput}
                placeholder="Escribe tu dedicatoria o versículo..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Autor o Firma (Opcional)</label>
              <input 
                type="text" 
                value={sData.author || ''} 
                onChange={(e) => onUpdateSectionData(id, 'author', e.target.value)}
                className={styles.textInput}
                placeholder="Ej. 1 Corintios 13:4"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className={styles.fieldGroup}>
                <label>Tipografía</label>
                <select 
                  value={sData.font || 'serif'}
                  onChange={(e) => onUpdateSectionData(id, 'font', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="serif">Serif Clásica</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Dancing Script', cursive">Dancing Script</option>
                  <option value="'Great Vibes', cursive">Great Vibes</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label>Tamaño</label>
                <input 
                  type="text" 
                  value={sData.size || '1.25rem'} 
                  onChange={(e) => onUpdateSectionData(id, 'size', e.target.value)}
                  className={styles.textInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Color del Texto</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="color" 
                  value={sData.color || data.design.textColor} 
                  onChange={(e) => onUpdateSectionData(id, 'color', e.target.value)}
                  className={styles.colorCircleInput}
                />
                <span className={styles.colorHexCode}>{sData.color || data.design.textColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================= COUNTDOWN ======================= */}
        {type === 'countdown' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título del Contador</label>
              <input 
                type="text" 
                value={sData.label || 'Faltan'} 
                onChange={(e) => onUpdateSectionData(id, 'label', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Fecha Objetivo</label>
              <input 
                type="datetime-local" 
                value={sData.targetDate ? sData.targetDate.slice(0, 16) : ''} 
                onChange={(e) => onUpdateSectionData(id, 'targetDate', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className={styles.fieldGroup}>
                <label>Fondo de Cajitas</label>
                <input 
                  type="color" 
                  value={sData.bgColor || '#1f2937'} 
                  onChange={(e) => onUpdateSectionData(id, 'bgColor', e.target.value)}
                  className={styles.colorCircleInput}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Color de Números</label>
                <input 
                  type="color" 
                  value={sData.textColor || '#ffffff'} 
                  onChange={(e) => onUpdateSectionData(id, 'textColor', e.target.value)}
                  className={styles.colorCircleInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================= DATETIME ======================= */}
        {type === 'datetime' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || '¿Cuándo?'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de Fecha y Hora',
              sData.icon,
              '📅',
              'icon',
              ['📅', '⏰', '<i class="fa-solid fa-calendar-days"></i>', '<i class="fa-solid fa-clock"></i>', '✨']
            )}

            <div className={styles.fieldGroup}>
              <label>Fecha y Hora</label>
              <input 
                type="datetime-local" 
                value={sData.date ? sData.date.slice(0, 16) : ''} 
                onChange={(e) => onUpdateSectionData(id, 'date', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Nota o aclaración (Opcional)</label>
              <input 
                type="text" 
                value={sData.note || ''} 
                onChange={(e) => onUpdateSectionData(id, 'note', e.target.value)}
                className={styles.textInput}
                placeholder="Favor de ser puntuales"
              />
            </div>
          </div>
        )}

        {/* ======================= CAROUSEL ======================= */}
        {type === 'carousel' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título de la Galería</label>
              <input 
                type="text" 
                value={sData.title || 'Nuestros Momentos'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Subir Fotos a la Galería</label>
              <CldUploadWidget 
                signatureEndpoint="/api/cloudinary" 
                onSuccess={handleSectionCarouselUpload}
                options={{ multiple: true }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className={styles.secondaryActionBtn} style={{ width: '100%', marginBottom: '0.75rem' }}>
                    <Plus size={15} style={{ marginRight: '0.25rem' }} /> + Subir Fotos (Cloudinary)
                  </button>
                )}
              </CldUploadWidget>

              {/* Lista de fotos con miniatura y botón de eliminar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {(sData.photos || []).map((photoUrl: string, pIdx: number) => (
                  <div key={pIdx} className={styles.photoThumbWrapper}>
                    <img src={photoUrl} alt="" className={styles.photoThumbImg} />
                    <button 
                      type="button" 
                      className={styles.photoThumbDeleteBtn}
                      onClick={() => {
                        const next = (sData.photos || []).filter((_: any, i: number) => i !== pIdx);
                        onUpdateSectionData(id, 'photos', next);
                      }}
                      title="Eliminar foto"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= PHOTO FRAME ======================= */}
        {type === 'photoFrame' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Foto Destacada</label>
              <CldUploadWidget 
                signatureEndpoint="/api/cloudinary" 
                onSuccess={(res) => handleSectionPhotoUpload(res, 'photoUrl')}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className={styles.secondaryActionBtn} style={{ width: '100%', marginBottom: '0.5rem' }}>
                    <ImageIcon size={15} style={{ marginRight: '0.5rem' }} /> Subir Foto
                  </button>
                )}
              </CldUploadWidget>
              <input 
                type="text" 
                value={sData.photoUrl || ''} 
                onChange={(e) => onUpdateSectionData(id, 'photoUrl', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Pie de Foto (Dedicatoria)</label>
              <input 
                type="text" 
                value={sData.caption || ''} 
                onChange={(e) => onUpdateSectionData(id, 'caption', e.target.value)}
                className={styles.textInput}
                placeholder="Juntos por siempre"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Formato del Marco</label>
              <select 
                value={sData.shape || 'polaroid'}
                onChange={(e) => onUpdateSectionData(id, 'shape', e.target.value)}
                className={styles.selectInput}
              >
                <option value="polaroid">Polaroid Clásico</option>
                <option value="circle">Circular</option>
                <option value="rounded">Bordes Redondeados</option>
              </select>
            </div>
          </div>
        )}

        {/* ======================= LOCATION / SECONDARY ======================= */}
        {(type === 'location' || type === 'secondaryLocation') && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título de la Sección</label>
              <input 
                type="text" 
                value={sData.title || (type === 'location' ? 'Ubicación' : 'Ceremonia Religiosa')} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de la Ubicación',
              sData.icon,
              type === 'location' ? '📍' : '⛪',
              'icon',
              ['📍', '⛪', '🏛️', '🏰', '🏖️', '<i class="fa-solid fa-location-dot"></i>', '<i class="fa-solid fa-church"></i>']
            )}

            <div className={styles.fieldGroup}>
              <label>Nombre del Lugar / Salón</label>
              <input 
                type="text" 
                value={sData.name || ''} 
                onChange={(e) => onUpdateSectionData(id, 'name', e.target.value)}
                className={styles.textInput}
                placeholder="Ej. Hacienda San José"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Dirección Completa</label>
              <textarea 
                rows={2}
                value={sData.address || ''} 
                onChange={(e) => onUpdateSectionData(id, 'address', e.target.value)}
                className={styles.textareaInput}
                placeholder="Calle, Número, Colonia, Ciudad"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Enlace de Google Maps</label>
              <input 
                type="text" 
                value={sData.locationUrl || ''} 
                onChange={(e) => onUpdateSectionData(id, 'locationUrl', e.target.value)}
                className={styles.textInput}
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
          </div>
        )}

        {/* ======================= ITINERARY ======================= */}
        {type === 'itinerary' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || 'Itinerario'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono del Encabezado',
              sData.icon,
              '📋',
              'icon',
              ['📋', '🗓️', '<i class="fa-solid fa-list"></i>', '<i class="fa-solid fa-calendar-check"></i>', '✨']
            )}

            <div className={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Pasos del Cronograma</label>
                <button 
                  type="button" 
                  onClick={addItineraryStep}
                  className={styles.miniAddBtn}
                >
                  <Plus size={13} /> + Paso
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(sData.items || []).map((item: any, idx: number) => (
                  <div key={item.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div className={styles.itineraryStepRow}>
                      <div className={styles.stepIconContainer}>
                        <button 
                          type="button" 
                          onClick={() => setActiveStepIconIdx(activeStepIconIdx === idx ? null : idx)}
                          className={styles.stepIconBadgeBtn}
                          title="Clic para ver o cambiar icono"
                        >
                          <SafeIcon icon={item.icon || '✨'} />
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={item.time || ''} 
                        onChange={(e) => updateItineraryStep(idx, 'time', e.target.value)}
                        placeholder="18:00 hs"
                        className={styles.timeTinyInput}
                      />
                      <input 
                        type="text" 
                        value={item.title || ''} 
                        onChange={(e) => updateItineraryStep(idx, 'title', e.target.value)}
                        placeholder="Ceremonia"
                        className={styles.textTinyInput}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeItineraryStep(idx)}
                        className={styles.stepRemoveBtn}
                        title="Quitar paso"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Popover / Selector de Icono del paso */}
                    {activeStepIconIdx === idx && (
                      <div className={styles.stepIconPopup}>
                        <div className={styles.stepIconPopupHeader}>
                          <span>Elige un icono o pega HTML:</span>
                          <button type="button" onClick={() => setActiveStepIconIdx(null)}>
                            <X size={13} />
                          </button>
                        </div>
                        <div className={styles.stepIconQuickGrid}>
                          {[
                            { icon: '💍', label: 'Anillos' },
                            { icon: '⛪', label: 'Ceremonia' },
                            { icon: '🥂', label: 'Brindis' },
                            { icon: '🍽️', label: 'Cena' },
                            { icon: '🎵', label: 'Baile' },
                            { icon: '🎂', label: 'Pastel' },
                            { icon: '📸', label: 'Fotos' },
                            { icon: '✨', label: 'Bengalas' },
                            { icon: '🚗', label: 'Salida' },
                            { icon: '🎉', label: 'Fiesta' },
                            { icon: '<i class="fa-solid fa-ring"></i>', label: 'Anillo (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-church"></i>', label: 'Iglesia (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-champagne-glasses"></i>', label: 'Brindis (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-utensils"></i>', label: 'Cena (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-music"></i>', label: 'Música (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-camera"></i>', label: 'Fotos (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-cake-candles"></i>', label: 'Pastel (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-heart"></i>', label: 'Corazón (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-car"></i>', label: 'Auto (FontAwesome)' },
                            { icon: '<i class="fa-solid fa-sparkles"></i>', label: 'Destello (FontAwesome)' },
                            { icon: '🕊️', label: 'Aves' },
                          ].map((fav, fIdx) => (
                            <button
                              key={fIdx}
                              type="button"
                              className={`${styles.stepIconChoiceBtn} ${item.icon === fav.icon ? styles.activeChoice : ''}`}
                              onClick={() => {
                                updateItineraryStep(idx, 'icon', fav.icon);
                                setActiveStepIconIdx(null);
                              }}
                              title={fav.label}
                            >
                              <SafeIcon icon={fav.icon} />
                            </button>
                          ))}
                        </div>
                        <div className={styles.stepIconCustomRow}>
                          <input 
                            type="text"
                            value={item.icon || ''}
                            onChange={(e) => updateItineraryStep(idx, 'icon', e.target.value)}
                            placeholder='Pega HTML <i class="..."> o emoji'
                            className={styles.stepIconCustomInput}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= DRESS CODE ======================= */}
        {type === 'dressCode' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || 'Código de Vestimenta'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de Vestimenta',
              sData.icon,
              '👗',
              'icon',
              ['👗', '👔', '🎩', '👠', '<i class="fa-solid fa-vest"></i>', '✨']
            )}

            <div className={styles.fieldGroup}>
              <label>Etiqueta General</label>
              <input 
                type="text" 
                value={sData.general || ''} 
                onChange={(e) => onUpdateSectionData(id, 'general', e.target.value)}
                className={styles.textInput}
                placeholder="Rigurosa Etiqueta / Formal"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Caballeros</label>
              <input 
                type="text" 
                value={sData.him || ''} 
                onChange={(e) => onUpdateSectionData(id, 'him', e.target.value)}
                className={styles.textInput}
                placeholder="Traje oscuro"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Damas</label>
              <input 
                type="text" 
                value={sData.her || ''} 
                onChange={(e) => onUpdateSectionData(id, 'her', e.target.value)}
                className={styles.textInput}
                placeholder="Vestido largo de fiesta"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Aclaraciones o Reservas de Color</label>
              <input 
                type="text" 
                value={sData.note || ''} 
                onChange={(e) => onUpdateSectionData(id, 'note', e.target.value)}
                className={styles.textInput}
                placeholder="Se reserva el color blanco para la novia"
              />
            </div>
          </div>
        )}

        {/* ======================= GIFTS ======================= */}
        {type === 'gifts' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || 'Mesa de Regalos'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de Regalos',
              sData.icon,
              '🎁',
              'icon',
              ['🎁', '🛍️', '🎀', '<i class="fa-solid fa-gift"></i>', '✨']
            )}

            <div className={styles.fieldGroup}>
              <label>Mensaje Agradecimiento</label>
              <textarea 
                rows={2}
                value={sData.message || ''} 
                onChange={(e) => onUpdateSectionData(id, 'message', e.target.value)}
                className={styles.textareaInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Tiendas Departamentales</label>
                <button 
                  type="button" 
                  onClick={addGiftStore}
                  className={styles.miniAddBtn}
                >
                  <Plus size={13} /> + Tienda
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(sData.stores || []).map((store: any, idx: number) => (
                  <div key={store.id || idx} className={styles.giftStoreItemBox}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <input 
                        type="text" 
                        value={store.store || ''} 
                        onChange={(e) => updateGiftStore(idx, 'store', e.target.value)}
                        placeholder="Nombre (ej. Liverpool)"
                        className={styles.textInput}
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeGiftStore(idx)}
                        className={styles.stepRemoveBtn}
                        title="Quitar tienda"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={store.url || ''} 
                      onChange={(e) => updateGiftStore(idx, 'url', e.target.value)}
                      placeholder="Enlace https://..."
                      className={styles.textInput}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= BANK DETAILS ======================= */}
        {type === 'bankDetails' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || 'Lluvia de Sobres / Transferencia'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de Transferencias',
              sData.icon,
              '✉️',
              'icon',
              ['✉️', '💳', '🏦', '<i class="fa-solid fa-envelope"></i>', '<i class="fa-solid fa-credit-card"></i>']
            )}

            <div className={styles.fieldGroup}>
              <label>Mensaje o Indicaciones</label>
              <textarea 
                rows={3}
                value={sData.notes || ''} 
                onChange={(e) => onUpdateSectionData(id, 'notes', e.target.value)}
                className={styles.textareaInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Banco</label>
              <input 
                type="text" 
                value={sData.bankName || ''} 
                onChange={(e) => onUpdateSectionData(id, 'bankName', e.target.value)}
                className={styles.textInput}
                placeholder="BBVA / Banorte / etc."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>CLABE Interbancaria (18 dígitos)</label>
              <input 
                type="text" 
                value={sData.clabe || ''} 
                onChange={(e) => onUpdateSectionData(id, 'clabe', e.target.value)}
                className={styles.textInput}
                placeholder="012180001234567890"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Titular de la Cuenta</label>
              <input 
                type="text" 
                value={sData.accountHolder || ''} 
                onChange={(e) => onUpdateSectionData(id, 'accountHolder', e.target.value)}
                className={styles.textInput}
                placeholder="Nombres y Apellidos"
              />
            </div>
          </div>
        )}

        {/* ======================= GENERAL TEXT ======================= */}
        {type === 'generalText' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || ''} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
                placeholder="Nota Importante"
              />
            </div>

            {renderSectionIconField(
              'Icono del Aviso (Opcional)',
              sData.icon,
              '📄',
              'icon',
              ['📄', '📌', '💡', '⚠️', 'ℹ️', '💌', '✨']
            )}

            <div className={styles.fieldGroup}>
              <label>Contenido del Mensaje</label>
              <textarea 
                rows={5}
                value={sData.content || ''} 
                onChange={(e) => onUpdateSectionData(id, 'content', e.target.value)}
                className={styles.textareaInput}
                placeholder="Escribe las indicaciones o información..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Alineación</label>
              <select 
                value={sData.align || 'center'}
                onChange={(e) => onUpdateSectionData(id, 'align', e.target.value)}
                className={styles.selectInput}
              >
                <option value="center">Centrado</option>
                <option value="left">Alineado a la Izquierda</option>
                <option value="right">Alineado a la Derecha</option>
              </select>
            </div>
          </div>
        )}

        {/* ======================= WHATSAPP RSVP ======================= */}
        {type === 'whatsappRsvp' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título</label>
              <input 
                type="text" 
                value={sData.title || 'Confirmación de Asistencia'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono de WhatsApp',
              sData.icon,
              '💬',
              'icon',
              ['💬', '📱', '<i class="fa-brands fa-whatsapp"></i>', '<i class="fa-solid fa-comment-dots"></i>']
            )}

            <div className={styles.fieldGroup}>
              <label>Número de WhatsApp (con código de país sin +)</label>
              <input 
                type="text" 
                value={sData.phone || ''} 
                onChange={(e) => onUpdateSectionData(id, 'phone', e.target.value)}
                className={styles.textInput}
                placeholder="521234567890"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Texto Botón Confirmar</label>
              <input 
                type="text" 
                value={sData.confirmText || '✓ Confirmar Asistencia'} 
                onChange={(e) => onUpdateSectionData(id, 'confirmText', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Mensaje Automático de WhatsApp al Confirmar</label>
              <textarea 
                rows={3}
                value={sData.confirmMessage || ''} 
                onChange={(e) => onUpdateSectionData(id, 'confirmMessage', e.target.value)}
                className={styles.textareaInput}
                placeholder="¡Hola! Confirmo la asistencia de {{nombre}}..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Texto Botón Declinar</label>
              <input 
                type="text" 
                value={sData.declineText || '✕ No podré asistir'} 
                onChange={(e) => onUpdateSectionData(id, 'declineText', e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>
        )}

        {/* ======================= RSVP FORM ======================= */}
        {type === 'rsvpForm' && (
          <div className={styles.sectionFields}>
            <div className={styles.fieldGroup}>
              <label>Título del Formulario</label>
              <input 
                type="text" 
                value={sData.title || 'Confirmación Web'} 
                onChange={(e) => onUpdateSectionData(id, 'title', e.target.value)}
                className={styles.textInput}
              />
            </div>

            {renderSectionIconField(
              'Icono del Formulario',
              sData.icon,
              '🎟️',
              'icon',
              ['🎟️', '✉️', '📋', '<i class="fa-solid fa-ticket"></i>']
            )}

            <div className={styles.fieldGroup}>
              <label>Instrucciones para Invitados</label>
              <textarea 
                rows={3}
                value={sData.instruction || ''} 
                onChange={(e) => onUpdateSectionData(id, 'instruction', e.target.value)}
                className={styles.textareaInput}
              />
            </div>
          </div>
        )}
      </div>

      {/* Acciones Rápidas al fondo del Inspector */}
      <div className={styles.inspectorFooter}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            type="button" 
            className={styles.secondaryActionBtn} 
            onClick={() => onMoveSection(id, 'up')}
            style={{ flex: 1 }}
          >
            <ArrowUp size={14} /> Subir
          </button>
          <button 
            type="button" 
            className={styles.secondaryActionBtn} 
            onClick={() => onMoveSection(id, 'down')}
            style={{ flex: 1 }}
          >
            <ArrowDown size={14} /> Bajar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            className={styles.secondaryActionBtn} 
            onClick={() => onDuplicateSection(id)}
            style={{ flex: 1 }}
          >
            <Copy size={14} /> Duplicar
          </button>
          <button 
            type="button" 
            className={`${styles.secondaryActionBtn} ${styles.btnDangerOutline}`} 
            onClick={() => onRemoveSection(id)}
            style={{ flex: 1 }}
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </aside>
  );
}
