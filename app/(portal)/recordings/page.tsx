const MOCK_RECORDINGS = [
  { id: 1, title: "Linux Basics — Session 1: File System Deep Dive",       course: "Linux Basics",                recordedAt: "2026-04-05", durationMin: 92 },
  { id: 2, title: "Linux Basics — Session 2: Shell Scripting Workshop",     course: "Linux Basics",                recordedAt: "2026-04-12", durationMin: 88 },
  { id: 3, title: "Docker — Session 1: Images and Containers",             course: "Containerization with Docker", recordedAt: "2026-04-26", durationMin: 95 },
  { id: 4, title: "Kubernetes — Session 1: Architecture Overview",          course: "Kubernetes Orchestration",    recordedAt: "2026-05-03", durationMin: 105 },
];

export default function RecordingsPage(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Recordings</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{MOCK_RECORDINGS.length} session recordings</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_RECORDINGS.map((r) => (
            <div key={r.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20, color: "var(--accent)" }}>▷</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{r.title}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{r.course}</span>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{r.recordedAt}</span>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{r.durationMin} min</span>
                </div>
              </div>
              <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 14px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>
                Watch
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
