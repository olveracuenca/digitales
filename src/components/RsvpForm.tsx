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
  whatsapp?: { enabled: boolean, number: string, confirmMsg: string, declineMsg: string }
}) {
  // If guestPass is provided, pre-fill name and lock it.
  const [name, setName] = useState(guestPass?.name || "");
  const [status, setStatus] = useState<"CONFIRMED" | "DECLINED" | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !status) return;

    setLoading(true);
    // If guestPass is used, companions = passCount - 1 (since 1 is the main guest)
    // If no guestPass, companions is 0 since we removed the manual input
    const companions = guestPass ? Math.max(0, guestPass.passCount - 1) : 0;
    const guestPassId = guestPass?.id;

    const res = await submitRsvp(invitationId, name, status, companions, guestPassId);
    setLoading(false);

    if (res.success) {
      if (whatsapp?.enabled && whatsapp.number) {
        const cleanNumber = whatsapp.number.replace(/\D/g, '');
        const msg = status === "CONFIRMED" ? whatsapp.confirmMsg : whatsapp.declineMsg;
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
