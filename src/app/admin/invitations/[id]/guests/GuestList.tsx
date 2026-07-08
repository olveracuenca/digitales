"use client";

import { useState, useEffect } from "react";
import { createGuestPass, deleteGuestPass } from "@/app/actions/invitation";
import { Trash, Copy, Plus, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../../../users/users.module.css";
import { useRouter } from "next/navigation";

export default function GuestList({ 
  invitationId, 
  initialPasses, 
  invitationSlug 
}: { 
  invitationId: string, 
  initialPasses: any[],
  invitationSlug: string 
}) {
  const [passes, setPasses] = useState(initialPasses);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("https://cuencaolv.com");
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
    const url = `${origin}/invitation/${invitationSlug}/pase?t=${passId}`;
    navigator.clipboard.writeText(url);
    alert("¡Enlace copiado!");
  };

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
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {passes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No se han generado pases para este evento.
                </td>
              </tr>
            ) : (
              passes.map(pass => (
                <tr key={pass.id}>
                  <td style={{fontWeight: 600}}>{pass.name}</td>
                  <td>
                    <span style={{ display: "inline-block", background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", padding: "0.25rem 0.75rem", borderRadius: "999px", fontWeight: "bold", fontSize: "0.85rem" }}>
                      {pass.passCount} {pass.passCount === 1 ? "Pase" : "Pases"}
                    </span>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
