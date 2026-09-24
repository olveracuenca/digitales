"use client";

import React, { useRef } from 'react';
import { 
  ArrowUp, ArrowDown, Copy, Trash2, MapPin, Calendar, Clock, 
  Heart, Gift, CreditCard, Shirt, MessageCircle, FileText, CheckCircle2, 
  Sparkles, ExternalLink, EyeOff
} from 'lucide-react';
import AutoCarousel from '@/components/AutoCarousel';
import FallingIcons from '@/components/FallingIcons';
import AudioPlayer from '@/components/AudioPlayer';
import Countdown from '@/components/Countdown';
import SafeIcon from '@/components/SafeIcon';
import { TemplateData, SectionBlock } from '../types';
import styles from '../editor.module.css';

interface WorkspaceProps {
  data: TemplateData;
  zoom: number;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onMoveSection: (id: string, direction: 'up' | 'down') => void;
  onDuplicateSection: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onOpenAddBlocks: () => void;
}

export default function Workspace({
  data,
  zoom,
  selectedSectionId,
  onSelectSection,
  onMoveSection,
  onDuplicateSection,
  onRemoveSection,
  onOpenAddBlocks,
}: WorkspaceProps) {
  const phoneScrollRef = useRef<HTMLDivElement>(null);

  // Formato de fecha en español
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatEventTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  // Renderizar contenido específico de cada sección
  const renderSectionContent = (section: SectionBlock) => {
    const { type, data: sData } = section;

    switch (type) {
      case 'hero':
        return (
          <div 
            className={styles.simHero} 
            style={{ 
              backgroundImage: `url(${sData.mainPhoto || data.mainPhoto || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000'})`,
            }}
          >
            <div 
              className={styles.simHeroOverlay}
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,${sData.overlayDarkness !== undefined ? sData.overlayDarkness : 0.65}))`
              }}
            >
              {sData.badgeText && (
                <span className={styles.simBadgeText}>{sData.badgeText}</span>
              )}
              <h1 
                className={styles.simTitle} 
                style={{ fontFamily: data.design.titleFont || data.design.font }}
              >
                {sData.title || data.title}
              </h1>
              <p 
                className={styles.simSubtitle}
                style={{ fontFamily: data.design.font }}
              >
                {sData.subtitle || data.subtitle}
              </p>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className={styles.simSectionPadded}>
            <div className={`${styles.simCard} ${sData.cardStyle === 'glass' ? styles.simGlassCard : ''}`}>
              <p 
                style={{
                  fontFamily: sData.font || data.design.font,
                  color: sData.color || data.design.textColor,
                  fontSize: sData.size || '1.15rem',
                  fontStyle: sData.italic ? 'italic' : 'normal',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                "{sData.text || 'Escribe tu dedicatoria especial...'}"
              </p>
              {sData.author && (
                <span className={styles.simAuthor}>— {sData.author}</span>
              )}
            </div>
          </div>
        );

      case 'countdown':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simCountdownCard}>
              <span className={styles.simCountdownLabel}>{sData.label || 'Faltan'}</span>
              <Countdown 
                targetDate={sData.targetDate || data.date} 
                bgColor={sData.bgColor || data.countdownDesign?.bgColor || 'rgba(0,0,0,0.15)'}
                textColor={sData.textColor || data.countdownDesign?.textColor || data.design.textColor}
                font={sData.font || data.countdownDesign?.font || data.design.font}
              />
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simDateCard}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback="📅" />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || '¿Cuándo?'}
              </h3>
              <p className={styles.simDateString}>
                {formatEventDate(sData.date || data.date)}
              </p>
              <p className={styles.simTimeString}>
                A las {formatEventTime(sData.date || data.date)}
              </p>
              {sData.note && (
                <span className={styles.simDateNote}>{sData.note}</span>
              )}
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simHeaderRow}>
              <SafeIcon icon={sData.icon} fallback="📸" />
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Nuestros Momentos'}
              </h3>
            </div>
            <AutoCarousel photos={sData.photos && sData.photos.length > 0 ? sData.photos : (data.carouselPhotos || [])} />
          </div>
        );

      case 'photoFrame':
        return (
          <div className={styles.simSectionPadded}>
            <div className={`${styles.simPhotoFrame} ${styles['frame_' + (sData.shape || 'polaroid')]}`}>
              <div className={styles.simPhotoContainer}>
                <img 
                  src={sData.photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800'} 
                  alt="Foto" 
                />
              </div>
              {sData.caption && (
                <p className={styles.simPhotoCaption} style={{ fontFamily: data.design.titleFont || data.design.font }}>
                  {sData.caption}
                </p>
              )}
            </div>
          </div>
        );

      case 'location':
      case 'secondaryLocation':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simLocationCard}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback={type === 'location' ? '📍' : '⛪'} />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || (type === 'location' ? 'Ubicación' : 'Ceremonia')}
              </h3>
              <h4 className={styles.simPlaceName}>{sData.name || 'Nombre del lugar'}</h4>
              {sData.address && (
                <p className={styles.simAddressText}>{sData.address}</p>
              )}
              {sData.locationUrl && (
                <a 
                  href={sData.locationUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.simMapsBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin size={16} />
                  <span>{sData.btnText || 'Abrir en Google Maps'}</span>
                </a>
              )}
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simHeaderRow}>
              <SafeIcon icon={sData.icon} fallback="📋" />
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Itinerario'}
              </h3>
            </div>

            <div className={styles.simTimeline}>
              <div className={styles.simTimelineLine} style={{ backgroundColor: `${data.design.textColor}30` }} />
              {(sData.items || []).map((item: any, i: number) => (
                <div key={item.id || i} className={styles.simTimelineStep}>
                  <div className={styles.simStepIconBox} style={{ borderColor: `${data.design.textColor}40`, background: data.design.bgColor }}>
                    <SafeIcon icon={item.icon} fallback="✨" />
                  </div>
                  <div className={styles.simStepContent}>
                    <span className={styles.simStepTime}>{item.time}</span>
                    <h5 className={styles.simStepTitle}>{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dressCode':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simDressCodeCard}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback="👗" />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Código de Vestimenta'}
              </h3>
              <p className={styles.simDressGeneral}>{sData.general || 'Formal'}</p>
              
              <div className={styles.simDressDetails}>
                {sData.him && (
                  <div><strong>Caballeros:</strong> {sData.him}</div>
                )}
                {sData.her && (
                  <div><strong>Damas:</strong> {sData.her}</div>
                )}
                {sData.note && (
                  <p className={styles.simDressNote}>{sData.note}</p>
                )}
              </div>

              {sData.palette && sData.palette.length > 0 && (
                <div className={styles.simPaletteRow}>
                  {sData.palette.map((color: string, cIdx: number) => (
                    <div 
                      key={cIdx} 
                      className={styles.simPaletteDot} 
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'gifts':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simHeaderRow}>
              <SafeIcon icon={sData.icon} fallback="🎁" />
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Mesa de Regalos'}
              </h3>
            </div>
            {sData.message && (
              <p className={styles.simGiftMessage}>{sData.message}</p>
            )}
            <div className={styles.simGiftStoresList}>
              {(sData.stores || []).map((store: any, idx: number) => (
                <a 
                  key={store.id || idx} 
                  href={store.url || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.simGiftStoreBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{store.store || 'Tienda'}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        );

      case 'bankDetails':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simBankCard}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback="✉️" />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Lluvia de Sobres / Transferencia'}
              </h3>
              {sData.notes && (
                <p className={styles.simBankNotes}>{sData.notes}</p>
              )}
              {sData.clabe && (
                <div className={styles.simBankBox}>
                  {sData.bankName && <div><strong>Banco:</strong> {sData.bankName}</div>}
                  <div><strong>CLABE:</strong> <code>{sData.clabe}</code></div>
                  {sData.accountHolder && <div><strong>Beneficiario:</strong> {sData.accountHolder}</div>}
                </div>
              )}
            </div>
          </div>
        );

      case 'generalText':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simTextCard} style={{ textAlign: sData.align || 'center' }}>
              {sData.icon && (
                <div className={styles.simTextIcon}>
                  <SafeIcon icon={sData.icon} />
                </div>
              )}
              {sData.title && (
                <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                  {sData.title}
                </h3>
              )}
              <p className={styles.simTextBody}>{sData.content}</p>
            </div>
          </div>
        );

      case 'whatsappRsvp':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simRsvpBox}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback="💬" />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Confirmación de Asistencia'}
              </h3>
              <div className={styles.simRsvpButtons}>
                <button className={styles.simConfirmWaBtn} type="button">
                  <MessageCircle size={16} />
                  <span>{sData.confirmText || '✓ Confirmar por WhatsApp'}</span>
                </button>
                <button className={styles.simDeclineWaBtn} type="button">
                  <span>{sData.declineText || '✕ No podré asistir'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'rsvpForm':
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simRsvpFormCard}>
              <div className={styles.simIconCircle}>
                <SafeIcon icon={sData.icon} fallback="🎟️" />
              </div>
              <h3 style={{ fontFamily: data.design.titleFont || data.design.font }}>
                {sData.title || 'Confirmación Web'}
              </h3>
              <p className={styles.simRsvpInstruction}>
                {sData.instruction || 'Ingresa tus datos y confirma tu asistencia.'}
              </p>
              <div className={styles.simFormMockInput}>Nombre Completo</div>
              <div className={styles.simFormMockInput}>Pases a confirmar</div>
              <button className={styles.simFormMockSubmit} type="button">
                Confirmar Asistencia
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.simSectionPadded}>
            <div className={styles.simCard}>
              <h4>{section.title}</h4>
            </div>
          </div>
        );
    }
  };

  return (
    <main 
      className={styles.workspaceContainer}
      onClick={() => onSelectSection(null)}
    >
      {/* Marco de Dispositivo Móvil (Smartphone Simulator) */}
      <div 
        className={styles.mobileSimulatorWrap}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.mobilePhoneFrame}>
          {/* Bocina & Dynamic Island */}
          <div className={styles.phoneSpeakerNotch}>
            <div className={styles.phoneCameraLens} />
          </div>

          {/* Pantalla del Celular */}
          <div 
            ref={phoneScrollRef}
            className={styles.phoneScreen}
            style={{
              backgroundColor: data.design.bgColor,
              color: data.design.textColor,
              fontFamily: data.design.font,
              backgroundImage: data.design.bgImage ? `url(${data.design.bgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'local',
            }}
          >
            {/* Lluvia de Iconos / Partículas */}
            {data.emojis.falling && (
              <FallingIcons iconString={data.emojis.falling} />
            )}

            {/* Reproductor de Audio Flotante */}
            {data.music && (
              <AudioPlayer src={data.music} isAbsolute={true} />
            )}

            {/* Secciones de la Invitación */}
            {data.sections.length === 0 ? (
              <div className={styles.simEmptyState}>
                <Sparkles size={36} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h3>Tu invitación está vacía</h3>
                <p>Haz clic en el botón inferior o en "Agregar" en la barra lateral para añadir portadas, cronograma, mapas y más.</p>
                <button 
                  type="button" 
                  className={styles.primaryActionBtn}
                  onClick={onOpenAddBlocks}
                  style={{ marginTop: '1.25rem' }}
                >
                  + Agregar Bloques
                </button>
              </div>
            ) : (
              <div className={styles.simSectionsList}>
                {data.sections.map((section, index) => {
                  const isSelected = selectedSectionId === section.id;
                  const isFirst = index === 0;
                  const isLast = index === data.sections.length - 1;

                  return (
                    <div 
                      key={section.id} 
                      className={`${styles.simSectionWrapper} ${isSelected ? styles.simSectionSelected : ''} ${!section.visible ? styles.simSectionHidden : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection(section.id);
                      }}
                    >
                      {/* Barra de Acciones Flotante Contextual (Cuando la sección está seleccionada) */}
                      {isSelected && (
                        <div className={styles.floatingActionToolbar} onClick={(e) => e.stopPropagation()}>
                          <span className={styles.floatingSectionName}>{section.title}</span>
                          
                          <div className={styles.floatingBtnGroup}>
                            <button 
                              type="button" 
                              title="Subir sección" 
                              disabled={isFirst}
                              onClick={() => onMoveSection(section.id, 'up')}
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button 
                              type="button" 
                              title="Bajar sección" 
                              disabled={isLast}
                              onClick={() => onMoveSection(section.id, 'down')}
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button 
                              type="button" 
                              title="Duplicar sección"
                              onClick={() => onDuplicateSection(section.id)}
                            >
                              <Copy size={13} />
                            </button>
                            <button 
                              type="button" 
                              title="Eliminar sección" 
                              className={styles.floatDangerBtn}
                              onClick={() => onRemoveSection(section.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Indicador si la sección está oculta */}
                      {!section.visible && (
                        <div className={styles.hiddenSectionBadge}>
                          <EyeOff size={13} /> Oculta para los invitados
                        </div>
                      )}

                      {/* Contenido Visual */}
                      {renderSectionContent(section)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
