"use client";

import { useState } from "react";
import { submitRsvp } from "@/app/actions/invitation";
import { Check, X } from "lucide-react";
import styles from "./RsvpForm.module.css";

export default function RsvpForm({ 
  invitationId, 
  design,
  guestPass,
  whatsapp
}: { 
  invitationId: string, 
  design?: any,
  guestPass?: { id: string, name: string, passCount: number },
  whatsapp?: { enabled: boolean, number: string, contacts?: { label: string, phone: string }[], confirmMsg: string, declineMsg: string }
}) {
  const [name, setName] = useState(guestPass?.name || "");
  const [status, setStatus] = useState<"CONFIRMED" | "DECLINED" | null>(null);
  
  // Contacts logic
  const hasMultipleContacts = whatsapp?.contacts && whatsapp.contacts.length > 0;
  const [selectedContact, setSelectedContact] = useState<string>(
    hasMultipleContacts ? whatsapp.contacts![0].phone : ""
  );

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !status) return;

    setLoading(true);
    const companions = guestPass ? Math.max(0, guestPass.passCount - 1) : 0;
    const guestPassId = guestPass?.id;

    const res = await submitRsvp(invitationId, name, status, companions, guestPassId);
    setLoading(false);

    if (res.success) {
      const targetPhone = hasMultipleContacts ? selectedContact : whatsapp?.number;
      if (whatsapp?.enabled && targetPhone) {
        const cleanNumber = targetPhone.replace(/\D/g, '');
        let rawMsg = status === "CONFIRMED" ? whatsapp.confirmMsg : whatsapp.declineMsg;
        const nameToUse = guestPass ? `${name}${guestPass.passCount > 1 ? ` (${guestPass.passCount} pases)` : ''}` : name;
        const msg = rawMsg.replace(/\{\{nombre\}\}/g, nameToUse);
        
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      }
      setSubmitted(true);
    } else {
      alert(res.error || "Ocurrió un error al enviar tu respuesta.");
    }
  };

  const textColor = design?.textColor || "#1f2937";
  const accentColor = design?.bgColor || "#fdfbf7";

  if (submitted) {
    return (
      <div className={styles.successState}>
        <div className={styles.iconContainer} style={{ background: textColor, color: accentColor }}>
          <Check size={32} />
        </div>
        <h3 style={{ color: textColor }}>¡Gracias por responder!</h3>
        <p style={{ color: textColor, opacity: 0.8 }}>Hemos guardado tu respuesta exitosamente.</p>
        {whatsapp?.enabled && (
           <p style={{ color: textColor, opacity: 0.8, marginTop: '1rem', fontSize: '0.9rem' }}>Se ha abierto WhatsApp para notificar al anfitrión.</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.rsvpContainer}>
      <h2 className={styles.title} style={{ color: textColor }}>
        ¿Nos acompañas?
      </h2>
      <p className={styles.subtitle} style={{ color: textColor, opacity: 0.8 }}>
        Por favor confirma tu asistencia al evento.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label style={{ color: textColor }}>
            {guestPass ? "Nombre de la Familia / Invitado" : "Nombre y Apellido"}
          </label>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ej. Juan Pérez" 
              required
              readOnly={!!guestPass}
              className={styles.input}
              style={{ 
                borderColor: textColor, 
                color: textColor,
                opacity: guestPass ? 0.7 : 1,
                cursor: guestPass ? 'not-allowed' : 'text'
              }}
            />
          </div>
          {guestPass && (
            <p style={{fontSize: '0.8rem', color: textColor, opacity: 0.8, marginTop: '0.25rem', marginLeft: '0.5rem'}}>
              Pases asignados: {guestPass.passCount}
            </p>
          )}
        </div>

        <div className={styles.statusButtons}>
          <button 
            type="button" 
            onClick={() => setStatus("CONFIRMED")}
            className={`${styles.statusBtn} ${status === "CONFIRMED" ? styles.active : ""}`}
            style={{ 
              borderColor: textColor, 
              color: status === "CONFIRMED" ? accentColor : textColor,
              background: status === "CONFIRMED" ? textColor : "transparent"
            }}
          >
            <Check size={18} />
            Sí, asistiré
          </button>
          
          <button 
            type="button" 
            onClick={() => setStatus("DECLINED")}
            className={`${styles.statusBtn} ${status === "DECLINED" ? styles.active : ""}`}
            style={{ 
              borderColor: textColor, 
              color: status === "DECLINED" ? accentColor : textColor,
              background: status === "DECLINED" ? textColor : "transparent"
            }}
          >
            <X size={18} />
            No podré asistir
          </button>
        </div>

        {hasMultipleContacts && whatsapp?.enabled && (
          <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
            <label style={{ color: textColor }}>¿A quién deseas confirmar?</label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className={styles.input}
              style={{
                borderColor: textColor,
                color: textColor,
                backgroundColor: "transparent",
                padding: "0.75rem",
                borderRadius: "8px",
                width: "100%"
              }}
            >
              {whatsapp.contacts!.map((c, i) => (
                <option key={i} value={c.phone} style={{ color: '#000' }}>
                  {c.label || `Contacto ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !status || !name.trim()} 
          className={styles.submitBtn}
          style={{ background: textColor, color: accentColor }}
        >
          {loading ? "Enviando..." : "Confirmar Respuesta"}
        </button>
      </form>
    </div>
  );
}
