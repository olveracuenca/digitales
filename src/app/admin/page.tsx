export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
        Dashboard
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Bienvenido al panel de administración de Cuencaolv.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="glass" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>Estadísticas</h3>
          <p>Próximamente métricas de uso y visitas de invitaciones.</p>
        </div>
      </div>
    </div>
  );
}
