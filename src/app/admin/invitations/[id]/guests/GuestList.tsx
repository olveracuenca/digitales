"use client";

import { useState, useEffect } from "react";
import { createGuestPass, deleteGuestPass } from "@/app/actions/invitation";
import { Trash, Copy, Plus, Users, ArrowLeft, CheckCircle, XCircle, UserCheck } from "lucide-react";
import Link from "next/link";
import styles from "../../../users/users.module.css";
import { useRouter } from "next/navigation";

export default function GuestList({ 
  invitationId, 
  initialPasses,
  initialRsvps,
  invitationSlug 
}: { 
  invitationId: string, 
  initialPasses: any[],
  initialRsvps: any[],
  invitationSlug: string 
}) {
  const [passes, setPasses] = useState(initialPasses);
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("https://cuencaolv.com");
  const [activeTab, setActiveTab] = useState<"passes" | "rsvps">("passes");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    const res = await createGuestPass(invitationId, name, count);
    setLoading(false);
    
    if (res.success && res.pass) {
      setPasses([res.pass, ...passes]);
      setName("");
      setCount(1);
      router.refresh();
    } else {
      alert(res.error || "Error al crear el pase");
    }
  };

  const handleDelete = async (passId: string) => {
    if (!confirm("¿Eliminar este pase?")) return;
    
    const res = await deleteGuestPass(passId);
    if (res.success) {
      setPasses(passes.filter(p => p.id !== passId));
      router.refresh();
    } else {
      alert(res.error || "Error al eliminar");
    }
  };

  const copyLink = (passId: string) => {
    const url = `${origin}/invitation/${invitationSlug}?t=${passId}`;
    navigator.clipboard.writeText(url);
    alert("¡Enlace copiado!");
  };

  const confirmedCount = rsvps.filter(r => r.status === "CONFIRMED").length;
  const declinedCount = rsvps.filter(r => r.status === "DECLINED").length;
  const totalCompanions = rsvps.filter(r => r.status === "CONFIRMED").reduce((acc, r) => acc + (r.companions || 0), 0);
  const totalAttending = confirmedCount + totalCompanions;

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/admin/invitations" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={20} /> Volver
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={28} /> Gestión de Invitados
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab("passes")}
          style={{ 
            padding: '1rem 2rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === "passes" ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === "passes" ? 'var(--text-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === "passes" ? 700 : 500,
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Pases Especiales
        </button>
        <button 
          onClick={() => setActiveTab("rsvps")}
          style={{ 
            padding: '1rem 2rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === "rsvps" ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === "rsvps" ? 'var(--text-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === "rsvps" ? 700 : 500,
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Confirmaciones (RSVP)
        </button>
      </div>

      {activeTab === "passes" && (
        <div className="animate-fade-in">
          <div style={{ background: "var(--surface-color)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={18}/> Crear Nuevo Pase</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "2", minWidth: "200px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Nombre de Familia / Invitado</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ej. Familia Pérez" 
                  className={styles.input} 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)" }}
                  required 
                />
              </div>
              <div style={{ flex: "1", minWidth: "120px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Cantidad de Pases</label>
                <input 
                  type="number" 
                  value={count} 
                  onChange={e => setCount(parseInt(e.target.value) || 1)} 
                  min="1" 
                  className={styles.input} 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)" }}
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className={styles.primaryButton}
                style={{ padding: "0.75rem 1.5rem", height: "46px" }}
              >
                {loading ? "Creando..." : "Generar Pase"}
              </button>
            </form>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Pases Asignados</th>
                  <th>Estado RSVP</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {passes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                      No se han generado pases para este evento.
                    </td>
                  </tr>
                ) : (
                  passes.map(pass => {
                    const rsvpForPass = rsvps.find(r => r.guestPassId === pass.id);
                    return (
                      <tr key={pass.id}>
                        <td style={{fontWeight: 600}}>{pass.name}</td>
                        <td>
                          <span style={{ display: "inline-block", background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", padding: "0.25rem 0.75rem", borderRadius: "999px", fontWeight: "bold", fontSize: "0.85rem" }}>
                            {pass.passCount} {pass.passCount === 1 ? "Pase" : "Pases"}
                          </span>
                        </td>
                        <td>
                          {rsvpForPass ? (
                            rsvpForPass.status === "CONFIRMED" ? (
                               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                                 <CheckCircle size={14} /> Confirmado
                               </span>
                            ) : (
                               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
                                 <XCircle size={14} /> Declinado
                               </span>
                            )
                          ) : (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pendiente</span>
                          )}
                        </td>
                        <td>{new Date(pass.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button onClick={() => copyLink(pass.id)} className={styles.editBtn} title="Copiar Enlace Público">
                              <Copy size={16} />
                            </button>
                            <button onClick={() => handleDelete(pass.id)} className={styles.editBtn} style={{color: '#ef4444'}} title="Eliminar">
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "rsvps" && (
        <div className="animate-fade-in">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Personas Confirmadas</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {totalAttending} <UserCheck size={28} />
              </div>
            </div>
            
            <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Confirmaciones (Grupos)</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{confirmedCount}</div>
            </div>

            <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>No Asistirán</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {declinedCount} <XCircle size={28} />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Pases Asignados</th>
                  <th>Total Confirmados</th>
                  <th>Origen</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                      Aún no hay respuestas de confirmación de asistencia.
                    </td>
                  </tr>
                ) : (
                  rsvps.map(rsvp => (
                    <tr key={rsvp.id}>
                      <td style={{fontWeight: 600}}>{rsvp.name}</td>
                      <td>
                        {rsvp.status === "CONFIRMED" ? (
                          <span style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.25rem 0.75rem", borderRadius: "999px", fontWeight: "bold", fontSize: "0.85rem" }}>
                            Sí asistirá
                          </span>
                        ) : (
                          <span style={{ display: "inline-block", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.25rem 0.75rem", borderRadius: "999px", fontWeight: "bold", fontSize: "0.85rem" }}>
                            No asistirá
                          </span>
                        )}
                      </td>
                      <td>{rsvp.status === "CONFIRMED" ? 1 + (rsvp.companions || 0) : "-"}</td>
                      <td style={{ fontWeight: 700 }}>
                        {rsvp.status === "CONFIRMED" ? 1 + (rsvp.companions || 0) : 0}
                      </td>
                      <td>
                        {rsvp.guestPassId ? (
                           <span style={{ color: '#a855f7', fontSize: '0.85rem', fontWeight: 600 }}>Pase VIP</span>
                        ) : (
                           <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Link Público</span>
                        )}
                      </td>
                      <td>{new Date(rsvp.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
