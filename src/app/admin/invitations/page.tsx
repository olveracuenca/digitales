import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { ExternalLink, Copy, Edit, Trash, Users } from "lucide-react";
import styles from "../users/users.module.css"; // Reuse table styles
import DeleteInvitationButton from "./DeleteInvitationButton";

const prisma = new PrismaClient();

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return <div>No autorizado</div>;
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (!user) return <div>Usuario no encontrado</div>;

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Mis Eventos</h1>
          <p style={{ color: "var(--text-secondary)" }}>Administra todas tus invitaciones digitales generadas.</p>
        </div>
        <Link href="/templates" className={styles.primaryButton}>
          <span>+ Crear Nuevo Evento</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre del Evento</th>
              <th>Enlace Público</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "3rem" }}>
                  No tienes invitaciones creadas todavía.
                </td>
              </tr>
            ) : (
              invitations.map(inv => {
                const publicUrl = `/invitation/${inv.slug}`;
                const parsedData = JSON.parse(inv.data);
                const eventName = parsedData.eventName || parsedData.title || inv.slug;
                return (
                  <tr key={inv.id}>
                    <td style={{fontWeight: 500}}>{eventName}</td>
                    <td>
                      <a href={publicUrl} target="_blank" rel="noreferrer" style={{color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        /{inv.slug} <ExternalLink size={14} />
                      </a>
                    </td>
                    <td>
                      <span className={styles.roleBadge} style={{background: inv.isPublished ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)', color: inv.isPublished ? '#22c55e' : '#eab308'}}>
                        {inv.isPublished ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{display: 'flex', gap: '1rem'}}>
                        <Link href={`/admin/invitations/${inv.id}/guests`} className={styles.editBtn} title="Gestionar Invitados">
                          <Users size={16} />
                        </Link>
                        <Link href={`/templates/${inv.templateId}/edit`} className={styles.editBtn} title="Editar">
                          <Edit size={16} />
                        </Link>
                        <DeleteInvitationButton id={inv.id} />
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
  );
}
