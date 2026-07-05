import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`${styles.hero} animate-fade-in`}>
        <div className="glass" style={{ padding: "3rem", borderRadius: "var(--radius-xl)", textAlign: "center" }}>
          <h1 className={styles.title}>
            Bienvenido a <span className="gradient-text">Cuencaolv</span>
          </h1>
          <p className={styles.subtitle}>
            Plataforma premium para la creación de invitaciones digitales.
          </p>
          <div className={styles.actions}>
            <Link href="/auth/login" className={styles.primaryButton}>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
