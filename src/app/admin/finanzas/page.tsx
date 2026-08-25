export default function FinanzasPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 6rem)', overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
      <iframe 
        src="/finanzas/index.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Finanzas 52 Semanas"
      />
    </div>
  );
}
