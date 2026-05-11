const RECENT_STUDENTS = [
  { name: "Aram Hakobyan",   modules: "Linux + Docker + K8s", status: "Active",  color: "#00d4ff" },
  { name: "Ani Petrosyan",   modules: "Linux + Git",          status: "Active",  color: "#00ff88" },
  { name: "Narek Vardanyan", modules: "CI/CD + Terraform",    status: "Pending", color: "#ffaa00" },
];

export default function AdminDashboardPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Overview</div>
      <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 24 }}>Welcome back, Sarmen</span>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {([
          ["Total students",    "24", "var(--accent)"],
          ["Active modules",    "9",  "var(--success)"],
          ["Unread messages",   "3",  "var(--danger)"],
          ["Pending homework",  "7",  "var(--warn)"],
        ] as const).map(([l, v, c]) => (
          <div key={l} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 22px" }}>
            <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>{l}</span>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>Recent students</div>
      <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 22px" }}>
        {RECENT_STUDENTS.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `color-mix(in srgb, ${s.color} 22%, transparent)`,
              border: `1px solid color-mix(in srgb, ${s.color} 44%, transparent)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Space Mono, monospace", fontSize: 10, color: s.color, fontWeight: 700, flexShrink: 0,
            }}>
              {s.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.name}</div>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{s.modules}</span>
            </div>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: `color-mix(in srgb, ${s.color} 18%, transparent)`, color: s.color, padding: "3px 10px", borderRadius: 99 }}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
