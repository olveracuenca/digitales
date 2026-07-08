import Link from "next/link";
import styles from "./templates.module.css";
import AdminLayout from "@/app/admin/layout";

const eventTemplates = [
  { id: "t-boda-01", title: "Boda Elegance", type: "Boda", color: "var(--primary-color)" },
  { id: "t-xv-01", title: "XV Años Magic", type: "XV Años", color: "var(--accent-color)" },
  { id: "t-bautizo-01", title: "Bautizo Serenity", type: "Bautizo", color: "#38bdf8" },
  { id: "t-boda-02", title: "Boda Premium Beach", type: "Boda", color: "#60a5fa" },
  { id: "t-xv-02", title: "Sencillo", type: "Una pagina", color: "#166534" },
  { id: "t-boda-03", title: "Boda Noche (Dark)", type: "Boda", color: "#a855f7" },
  { id: "t-boda-04", title: "Boda Girasoles (Pro)", type: "Boda", color: "#eab308" },
];

export default function TemplatesPage() {
  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className={styles.header}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Plantillas</h1>
            <p style={{ color: "var(--text-secondary)" }}>Selecciona una plantilla base para crear una nueva invitación.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {eventTemplates.map((template) => (
            <div key={template.id} className={`glass ${styles.card}`}>
              <div
                className={styles.cardCover}
                style={{ background: `linear-gradient(135deg, ${template.color}40, transparent)` }}
              >
                <span className={styles.typeTag}>{template.type}</span>
              </div>
              <div className={styles.cardContent}>
                <h3>{template.title}</h3>
                <p>Plantilla base con todas las secciones configurables.</p>
                <Link href={`/templates/${template.id}/edit`} className={styles.selectBtn}>
                  Usar Plantilla
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
