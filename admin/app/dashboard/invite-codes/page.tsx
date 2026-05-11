const MOCK_CODES = [
  { id: 1, code: "LINUX2026",  course: "Linux Basics",                uses: 3,  maxUses: 20, expires: "2026-08-12", active: true  },
  { id: 2, code: "DEVOPS2026", course: "Containerization with Docker", uses: 7,  maxUses: 20, expires: "2026-08-12", active: true  },
];

export default function InviteCodesPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Invite Codes</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Manage enrollment access codes</span>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
          + New code
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_CODES.map((c) => (
          <div key={c.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <code style={{ fontFamily: "Space Mono, monospace", fontSize: 14, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em" }}>{c.code}</code>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: "#00ff8818", color: "#00ff88", padding: "2px 8px", borderRadius: 99 }}>Active</span>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Course: {c.course}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Uses: {c.uses} / {c.maxUses}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Expires: {c.expires}</span>
              </div>
              <div style={{ marginTop: 8, height: 3, background: "var(--bg-3)", borderRadius: 2, maxWidth: 200 }}>
                <div style={{ height: "100%", width: `${(c.uses / c.maxUses) * 100}%`, background: "var(--accent)", borderRadius: 2 }}/>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Edit</button>
              <button style={{ background: "color-mix(in srgb, var(--danger) 18%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 44%, transparent)", color: "var(--danger)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
