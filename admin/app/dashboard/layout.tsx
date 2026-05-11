import AdminSidebar from "@/components/layout/AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Admin Panel</div>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--danger)", letterSpacing: "0.08em" }}>Admin panel · devopsguru.am</span>
          </div>
          <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 33%, transparent)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", textDecoration: "none" }}>
            View site
          </a>
        </div>
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
