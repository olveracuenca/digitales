"use client";

import React from 'react';
import { Undo2, Redo2, Save, Eye, Share2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import styles from '../editor.module.css';

interface TopNavbarProps {
  eventName: string;
  templateId: string;
  saving: boolean;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  publicUrl: string;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onSave: () => void;
  onOpenShareModal: () => void;
}

export default function TopNavbar({
  eventName,
  templateId,
  saving,
  hasUnsavedChanges,
  canUndo,
  canRedo,
  zoom,
  publicUrl,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onSave,
  onOpenShareModal,
}: TopNavbarProps) {
  return (
    <header className={styles.topNavbar}>
      {/* Grupo izquierdo: Título de la App y Evento */}
      <div className={styles.navBrandGroup}>
        <span className={styles.brandTitle}>Estudio de Invitaciones</span>
        <span className={styles.brandBadge}>{eventName || `Plantilla ${templateId}`}</span>
      </div>

      {/* Grupo central: Historial y Controles de Zoom */}
      <div className={styles.navCenterActions}>
        {/* Deshacer / Rehacer */}
        <div className={styles.actionButtonGroup}>
          <button 
            className={styles.iconActionBtn} 
            onClick={onUndo} 
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button 
            className={styles.iconActionBtn} 
            onClick={onRedo} 
            disabled={!canRedo}
            title="Rehacer (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className={styles.vDivider} />

        {/* Zoom */}
        <div className={styles.zoomControls}>
          <button 
            className={styles.zoomBtn} 
            onClick={onZoomOut} 
            title="Alejar vista previa"
          >
            <ZoomOut size={14} />
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button 
            className={styles.zoomBtn} 
            onClick={onZoomIn} 
            title="Acercar vista previa"
          >
            <ZoomIn size={14} />
          </button>
          <button 
            className={styles.zoomFitBtn} 
            onClick={onZoomReset}
            title="Ajustar tamaño 100%"
          >
            100%
          </button>
        </div>
      </div>

      {/* Grupo derecho: Estado de Guardado y Botones de Acción */}
      <div className={styles.navRightActions}>
        {/* Indicador de Estado */}
        <div className={styles.saveStatusGroup}>
          <span className={`${styles.saveDot} ${saving ? styles.dotSaving : (hasUnsavedChanges ? styles.dotPending : styles.dotSaved)}`} />
          <span className={styles.saveStatusLabel}>
            {saving ? "Guardando..." : (hasUnsavedChanges ? "Cambios sin guardar" : "Guardado")}
          </span>
        </div>

        <div className={styles.vDivider} />

        {/* Vista previa en vivo */}
        {publicUrl && (
          <a 
            href={publicUrl} 
            target="_blank" 
            rel="noreferrer" 
            className={styles.secondaryHeaderBtn}
            title="Abrir invitación pública en nueva pestaña"
          >
            <Eye size={15} />
            <span>Ver Online</span>
          </a>
        )}

        {/* Compartir / Pases */}
        <button 
          className={styles.secondaryHeaderBtn} 
          onClick={onOpenShareModal}
          title="Compartir enlace y generar pases"
        >
          <Share2 size={15} />
          <span>Compartir</span>
        </button>

        {/* Guardar & Publicar */}
        <button 
          className={styles.primaryHeaderBtn} 
          onClick={onSave}
          disabled={saving}
          title="Guardar y publicar cambios (Ctrl+S)"
        >
          <Save size={16} />
          <span>{saving ? "Guardando..." : "Guardar"}</span>
        </button>
      </div>
    </header>
  );
}
