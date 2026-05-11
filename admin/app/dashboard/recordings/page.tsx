const MOCK_RECS = [
  { id: 1, title: "Linux Basics — Session 1: File System Deep Dive",       course: "Linux Basics",                 date: "2026-04-05", dur: 92, published: true  },
  { id: 2, title: "Linux Basics — Session 2: Shell Scripting Workshop",     course: "Linux Basics",                 date: "2026-04-12", dur: 88, published: true  },
  { id: 3, title: "Docker — Session 1: Images and Containers",             course: "Containerization with Docker",  date: "2026-04-26", dur: 95, published: false },
  { id: 4, title: "Kubernetes — Session 1: Architecture Overview",          course: "Kubernetes Orchestration",     date: "2026-05-03", dur: 105, published: false },
];

export default function AdminRecordingsPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Recordings</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Manage session recordings</span>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
          + Upload recording
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_RECS.map((r) => (
          <div key={r.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--accent)", fontSize: 20 }}>▷</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{r.title}</div>
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{r.course}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{r.date}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{r.dur} min</span>
              </div>
            </div>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: r.published ? "#00ff8818" : "var(--bg-3)", color: r.published ? "#00ff88" : "var(--text-dim)", padding: "3px 10px", borderRadius: 99 }}>
              {r.published ? "Published" : "Draft"}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
