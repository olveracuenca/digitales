"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./admin.module.css";
import { LayoutDashboard, Users, FileText, LogOut, Download } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Cuencaolv</h2>
          <span className={styles.roleBadge}>{(session?.user as any)?.role}</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span className={styles.sidebarText}>Dashboard</span>
          </Link>
          <Link href="/admin/invitations" className={styles.navItem}>
            <FileText size={20} />
            <span className={styles.sidebarText}>Mis Eventos</span>
          </Link>
          {mounted && (session?.user as any)?.role === "ADMIN" && (
            <Link href="/admin/users" className={styles.navItem}>
              <Users size={20} />
              <span className={styles.sidebarText}>Usuarios</span>
            </Link>
          )}
          <Link href="/templates" className={styles.navItem}>
            <FileText size={20} />
            <span className={styles.sidebarText}>Plantillas</span>
          </Link>
          <Link href="/admin/youtube-downloader" className={styles.navItem}>
            <Download size={20} />
            <span className={styles.sidebarText}>Descargar MP3</span>
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{session?.user?.name || session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
