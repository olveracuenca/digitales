"use client";

import { useState } from "react";
import styles from "./users.module.css";
import { UserPlus } from "lucide-react";

// Mock data until we connect Server Actions to Prisma for users
const mockUsers = [
  { id: "1", name: "Administrador", email: "admin@cuencaolv.com", role: "ADMIN" },
];

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Usuarios</h1>
          <p style={{ color: "var(--text-secondary)" }}>Gestión de usuarios y accesos.</p>
        </div>
        <button className={styles.primaryButton} onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={styles.roleBadge}>{user.role}</span></td>
                <td>
                  <button className={styles.editBtn}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`glass ${styles.modal}`}>
            <h2 style={{ marginBottom: "1.5rem" }}>Crear Nuevo Usuario</h2>
            <form className={styles.form}>
              <input className={styles.input} type="text" placeholder="Nombre completo" required />
              <input className={styles.input} type="email" placeholder="Correo electrónico" required />
              <input className={styles.input} type="password" placeholder="Contraseña" required />
              <select className={styles.input}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
