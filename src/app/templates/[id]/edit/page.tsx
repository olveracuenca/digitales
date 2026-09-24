"use client";

import { useState, use, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/app/admin/layout";
import styles from "./editor.module.css";
import TopNavbar from "./components/TopNavbar";
import Dock from "./components/Dock";
import Workspace from "./components/Workspace";
import Inspector from "./components/Inspector";
import { HistoryManager } from "./history";
import { getDefaultData, normalizeTemplateData, createDefaultSection } from "./defaults";
import { TemplateData, SectionBlock, SectionBlockType } from "./types";
import { Copy, MessageCircle, Check, X } from "lucide-react";

export default function TemplateEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const invId = searchParams.get('invId');

  // Estado del proyecto normalizado a bloques modulares
  const [data, setData] = useState<TemplateData>(() => normalizeTemplateData(getDefaultData(id), id));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);

  // Estados de guardado y publicación
  const [saving, setSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [generatedSlug, setGeneratedSlug] = useState<string>(`demo-${id}`);
  const [generatedId, setGeneratedId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("https://cuencaolv.com");
  const [guestName, setGuestName] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);

  // Gestor de Historial (Deshacer / Rehacer)
  const historyRef = useRef<HistoryManager>(new HistoryManager(data));
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateHistoryStatus = useCallback(() => {
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  // Registrar un cambio en el historial
  const recordChange = useCallback((newData: TemplateData) => {
    historyRef.current.record(newData);
    setData(newData);
    setHasUnsavedChanges(true);
    updateHistoryStatus();
  }, [updateHistoryStatus]);

  // Cargar invitación existente desde la base de datos si viene en la URL
  useEffect(() => {
    if (invId) {
      import('@/app/actions/invitation').then(({ getInvitationById }) => {
        getInvitationById(invId).then(inv => {
          if (inv && inv.data) {
            try {
              const parsed = JSON.parse(inv.data);
              const normalized = normalizeTemplateData(parsed, id);
              setData(normalized);
              setGeneratedSlug(inv.slug);
              setGeneratedId(inv.id);
              historyRef.current = new HistoryManager(normalized);
              updateHistoryStatus();
              setHasUnsavedChanges(false);
              if (normalized.sections.length > 0) {
                setSelectedSectionId(normalized.sections[0].id);
              }
            } catch (err) {
              console.error("Error parsing invitation data:", err);
            }
          }
        });
      });
    } else {
      // Seleccionar por defecto la primera sección al inicio
      if (data.sections.length > 0 && !selectedSectionId) {
        setSelectedSectionId(data.sections[0].id);
      }
    }
  }, [invId, id, updateHistoryStatus]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // URLs y mensajes para compartir
  const publicUrl = `${origin}/invitation/${generatedSlug}`;
  const whatsappMsg = `¡Hola! Te invito a mi evento, entra a este link para ver los detalles: ${publicUrl}`;
  const personalizedUrl = `${publicUrl}?guest=${encodeURIComponent(guestName)}`;
  const personalizedWhatsappMsg = `¡Hola ${guestName}! Te invito a mi evento, entra a este link para ver los detalles: ${personalizedUrl}`;

  // =========================================================================
  // GESTIÓN MODULAR DE SECCIONES (AGREGAR, QUITAR, DUPLICAR, REORDENAR)
  // =========================================================================

  // 1. Agregar nueva sección
  const handleAddSection = useCallback((type: SectionBlockType) => {
    const newSection = createDefaultSection(type);
    
    // Si hay una sección seleccionada, insertar justo después; si no, al final
    let newSections = [...data.sections];
    if (selectedSectionId) {
      const idx = newSections.findIndex(s => s.id === selectedSectionId);
      if (idx !== -1) {
        newSections.splice(idx + 1, 0, newSection);
      } else {
        newSections.push(newSection);
      }
    } else {
      newSections.push(newSection);
    }

    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
    setSelectedSectionId(newSection.id);
  }, [data, selectedSectionId, recordChange]);

  // 2. Quitar / Eliminar sección
  const handleRemoveSection = useCallback((idToRemove: string) => {
    const newSections = data.sections.filter(s => s.id !== idToRemove);
    const newData: TemplateData = { ...data, sections: newSections };
    
    if (selectedSectionId === idToRemove) {
      setSelectedSectionId(newSections.length > 0 ? newSections[0].id : null);
    }

    recordChange(newData);
  }, [data, selectedSectionId, recordChange]);

  // 3. Duplicar sección
  const handleDuplicateSection = useCallback((idToClone: string) => {
    const idx = data.sections.findIndex(s => s.id === idToClone);
    if (idx === -1) return;

    const source = data.sections[idx];
    const cloned: SectionBlock = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.type}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${source.title} (Copia)`,
    };

    const newSections = [...data.sections];
    newSections.splice(idx + 1, 0, cloned);

    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
    setSelectedSectionId(cloned.id);
  }, [data, recordChange]);

  // 4. Mover sección (Subir / Bajar posición)
  const handleMoveSection = useCallback((idToMove: string, direction: 'up' | 'down') => {
    const idx = data.sections.findIndex(s => s.id === idToMove);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === data.sections.length - 1) return;

    const newSections = [...data.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newSections[idx];
    newSections[idx] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
  }, [data, recordChange]);

  // 5. Alternar visibilidad de una sección
  const handleToggleVisibility = useCallback((sectionId: string) => {
    const newSections = data.sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, visible: !s.visible };
      }
      return s;
    });
    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
  }, [data, recordChange]);

  // 6. Alternar bloqueo de edición
  const handleToggleLock = useCallback((sectionId: string) => {
    const newSections = data.sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, locked: !s.locked };
      }
      return s;
    });
    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
  }, [data, recordChange]);

  // 7. Actualizar propiedades básicas de una sección (ej. renombrar título)
  const handleUpdateSection = useCallback((sectionId: string, newFields: Partial<SectionBlock>) => {
    const newSections = data.sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, ...newFields };
      }
      return s;
    });
    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
  }, [data, recordChange]);

  // 8. Actualizar payload interno de una sección (datos específicos)
  const handleUpdateSectionData = useCallback((sectionId: string, key: string, value: any) => {
    const newSections = data.sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          data: {
            ...s.data,
            [key]: value,
          }
        };
      }
      return s;
    });
    const newData: TemplateData = { ...data, sections: newSections };
    recordChange(newData);
  }, [data, recordChange]);

  // =========================================================================
  // GESTIÓN DE DISEÑO GLOBAL Y METADATOS
  // =========================================================================

  const handleChangeGlobalDesign = useCallback((field: string, value: any) => {
    if (field === 'music') {
      recordChange({ ...data, music: value });
    } else if (field === 'fallingEmojis') {
      recordChange({ ...data, emojis: { ...data.emojis, falling: value } });
    } else if (field === 'bgImage') {
      recordChange({ ...data, design: { ...data.design, bgImage: value } });
    } else {
      recordChange({ ...data, design: { ...data.design, [field]: value } });
    }
  }, [data, recordChange]);

  const handleChangeGlobalMeta = useCallback((key: string, value: any) => {
    recordChange({ ...data, [key]: value });
  }, [data, recordChange]);

  const handleLoadTemplatePreset = useCallback((presetId: string) => {
    const confirmed = window.confirm("¿Deseas cargar esta plantilla? Reemplazará las secciones actuales.");
    if (!confirmed) return;

    const preset = normalizeTemplateData(getDefaultData(presetId), presetId);
    recordChange(preset);
    if (preset.sections.length > 0) {
      setSelectedSectionId(preset.sections[0].id);
    }
  }, [recordChange]);

  const handleUploadSuccess = useCallback((res: any, field: string) => {
    if (res?.info?.secure_url) {
      const url = res.info.secure_url;
      if (field === 'music') {
        handleChangeGlobalDesign('music', url);
      } else if (field === 'bgImage') {
        handleChangeGlobalDesign('bgImage', url);
      }
    }
  }, [handleChangeGlobalDesign]);

  // =========================================================================
  // HISTORIAL (UNDO / REDO)
  // =========================================================================

  const handleUndo = useCallback(() => {
    const prevState = historyRef.current.undo(data);
    if (prevState) {
      setData(prevState);
      updateHistoryStatus();
      setHasUnsavedChanges(true);
    }
  }, [data, updateHistoryStatus]);

  const handleRedo = useCallback(() => {
    const nextState = historyRef.current.redo(data);
    if (nextState) {
      setData(nextState);
      updateHistoryStatus();
      setHasUnsavedChanges(true);
    }
  }, [data, updateHistoryStatus]);

  // Atajos de teclado: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+S (Save), Del (Eliminar sección)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId && !isInput) {
        e.preventDefault();
        handleRemoveSection(selectedSectionId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedSectionId, handleRemoveSection]);

  // =========================================================================
  // ZOOM DEL LIENZO
  // =========================================================================

  const handleZoomIn = () => setZoom(prev => Math.min(1.4, Math.round((prev + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom(prev => Math.max(0.6, Math.round((prev - 0.1) * 10) / 10));
  const handleZoomReset = () => setZoom(1.0);

  // =========================================================================
  // GUARDAR EN EL SERVIDOR
  // =========================================================================

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sincronizar campos legacy a partir de las secciones para compatibilidad total
      const heroSection = data.sections.find(s => s.type === 'hero');
      const quoteSection = data.sections.find(s => s.type === 'quote');
      const countdownSection = data.sections.find(s => s.type === 'countdown');
      const carouselSection = data.sections.find(s => s.type === 'carousel');
      const locationSection = data.sections.find(s => s.type === 'location');
      const secLocationSection = data.sections.find(s => s.type === 'secondaryLocation');
      const itinerarySection = data.sections.find(s => s.type === 'itinerary');
      const dressCodeSection = data.sections.find(s => s.type === 'dressCode');
      const giftsSection = data.sections.find(s => s.type === 'gifts');
      const bankSection = data.sections.find(s => s.type === 'bankDetails');
      const textSection = data.sections.find(s => s.type === 'generalText');
      const waSection = data.sections.find(s => s.type === 'whatsappRsvp');

      const payloadToSave: TemplateData = {
        ...data,
        mainPhoto: heroSection?.data.mainPhoto || data.mainPhoto,
        title: heroSection?.data.title || data.title,
        subtitle: heroSection?.data.subtitle || data.subtitle,
        quote: quoteSection ? {
          text: quoteSection.data.text || '',
          color: quoteSection.data.color || data.design.textColor,
          font: quoteSection.data.font || data.design.font,
          size: quoteSection.data.size || '1.25rem',
        } : data.quote,
        countdownDesign: countdownSection ? {
          bgColor: countdownSection.data.bgColor || '#1f2937',
          textColor: countdownSection.data.textColor || '#ffffff',
          font: countdownSection.data.font || 'sans-serif',
        } : data.countdownDesign,
        carouselPhotos: carouselSection?.data.photos || data.carouselPhotos,
        location: locationSection?.data.name || data.location,
        address: locationSection?.data.address || data.address,
        locationUrl: locationSection?.data.locationUrl || data.locationUrl,
        secondaryLocation: secLocationSection?.data.name || data.secondaryLocation,
        secondaryAddress: secLocationSection?.data.address || data.secondaryAddress,
        secondaryLocationUrl: secLocationSection?.data.locationUrl || data.secondaryLocationUrl,
        itinerary: itinerarySection?.data.items || data.itinerary,
        dressCode: dressCodeSection ? {
          general: dressCodeSection.data.general || '',
          him: dressCodeSection.data.him || '',
          her: dressCodeSection.data.her || '',
        } : data.dressCode,
        gifts: giftsSection?.data.stores || data.gifts,
        generalGift: bankSection?.data.notes || data.generalGift,
        generalText: textSection?.data.content || data.generalText,
        whatsapp: waSection?.data.phone || data.whatsapp,
        whatsappMessage: waSection?.data.confirmMessage || data.whatsappMessage,
        whatsappDeclineMessage: waSection?.data.declineMessage || data.whatsappDeclineMessage,
        visibility: {
          quote: !!quoteSection && quoteSection.visible,
          countdown: !!countdownSection && countdownSection.visible,
          carousel: !!carouselSection && carouselSection.visible,
          location: !!locationSection && locationSection.visible,
          secondaryLocation: !!secLocationSection && secLocationSection.visible,
          itinerary: !!itinerarySection && itinerarySection.visible,
          dressCode: !!dressCodeSection && dressCodeSection.visible,
          gifts: !!giftsSection && giftsSection.visible,
          generalGift: !!bankSection && bankSection.visible,
          generalText: !!textSection && textSection.visible,
          whatsapp: !!waSection && waSection.visible,
          bgImage: !!data.design.bgImage,
          fallingIcons: !!data.emojis.falling,
          music: !!data.music,
          decorations: !!(data.decorations.topLeft || data.decorations.topRight),
          rsvp: data.sections.some(s => s.type === 'rsvpForm' && s.visible),
        }
      };

      const { saveInvitation } = await import('@/app/actions/invitation');
      const currentId = generatedId || invId || undefined;
      const res = await saveInvitation(id, payloadToSave, currentId);

      if (res.success && res.slug) {
        setGeneratedSlug(res.slug);
        if (res.id) setGeneratedId(res.id);
        setHasUnsavedChanges(false);
        setShowShareModal(true);
      } else {
        alert("Error al guardar: " + res.error);
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error al comunicarse con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, isPass: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPass) {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.studioLayout}>
        {/* Barra superior estilo CP1500 Studio */}
        <TopNavbar 
          eventName={data.eventName}
          templateId={id}
          saving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
          canUndo={canUndo}
          canRedo={canRedo}
          zoom={zoom}
          publicUrl={generatedSlug ? publicUrl : ""}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onSave={handleSave}
          onOpenShareModal={() => setShowShareModal(true)}
        />

        {/* Cuerpo principal del estudio: Dock izquierdo, Lienzo central e Inspector derecho */}
        <div className={styles.studioBody}>
          <Dock 
            data={data}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            onDuplicateSection={handleDuplicateSection}
            onMoveSection={handleMoveSection}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onChangeGlobalDesign={handleChangeGlobalDesign}
            onLoadTemplatePreset={handleLoadTemplatePreset}
            onUploadSuccess={handleUploadSuccess}
          />

          <Workspace 
            data={data}
            zoom={zoom}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onMoveSection={handleMoveSection}
            onDuplicateSection={handleDuplicateSection}
            onRemoveSection={handleRemoveSection}
            onOpenAddBlocks={() => {
              // Si no hay secciones, activa el tab de agregar
            }}
          />

          <Inspector 
            data={data}
            selectedSectionId={selectedSectionId}
            onUpdateSection={handleUpdateSection}
            onUpdateSectionData={handleUpdateSectionData}
            onMoveSection={handleMoveSection}
            onDuplicateSection={handleDuplicateSection}
            onRemoveSection={handleRemoveSection}
            onToggleVisibility={handleToggleVisibility}
            onChangeGlobalMeta={handleChangeGlobalMeta}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>

        {/* Modal para Compartir y Crear Pases */}
        {showShareModal && (
          <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>🎉 ¡Invitación Lista y Publicada!</h2>
                <button className={styles.closeModalBtn} onClick={() => setShowShareModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <p>
                  Tu invitación digital interactiva está disponible al instante en la web. No necesitas enviar archivos pesados.
                </p>

                <div className={styles.urlCopyBox}>
                  {publicUrl}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <button 
                    className={styles.primaryActionBtn} 
                    style={{ width: '100%' }}
                    onClick={() => copyToClipboard(publicUrl, false)}
                  >
                    {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                    {copiedLink ? "¡Enlace Copiado!" : "Copiar Enlace Principal"}
                  </button>

                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.simConfirmWaBtn}
                    style={{ width: '100%', maxWidth: 'none' }}
                  >
                    <MessageCircle size={16} /> Compartir directo en WhatsApp
                  </a>
                </div>

                {/* Generador de Pases Personalizados */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f3f4f6', display: 'block', marginBottom: '0.4rem' }}>
                    Crear Pase con Nombre Personalizado (Opcional)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ej. Familia Gómez García"
                      className={styles.textInput}
                      style={{ flex: 1 }}
                    />
                    <button 
                      className={styles.secondaryActionBtn}
                      onClick={() => copyToClipboard(personalizedUrl, true)}
                      disabled={!guestName.trim()}
                    >
                      {copiedPass ? <Check size={14} /> : <Copy size={14} />}
                      {copiedPass ? "Copiado" : "Copiar Pase"}
                    </button>
                  </div>
                  {guestName.trim() && (
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(personalizedWhatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <MessageCircle size={13} /> Enviar pase a {guestName} por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
