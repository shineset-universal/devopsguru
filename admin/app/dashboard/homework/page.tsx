const MOCK_SUBS = [
  { id: 1, student: "Aram Hakobyan",   assignment: "Write a shell script to monitor disk usage",     course: "Linux Basics",                 submittedAt: "2026-05-10", grade: null  },
  { id: 2, student: "Ani Petrosyan",   assignment: "Write a shell script to monitor disk usage",     course: "Linux Basics",                 submittedAt: "2026-05-11", grade: null  },
  { id: 3, student: "Aram Hakobyan",   assignment: "Set up a multi-stage Docker build",               course: "Containerization with Docker",  submittedAt: "2026-05-09", grade: 88    },
  { id: 4, student: "Narek Vardanyan", assignment: "Deploy a Node.js app to Kubernetes with Helm",   course: "Kubernetes Orchestration",      submittedAt: "2026-05-08", grade: 92    },
];

export default function AdminHomeworkPage(): React.JSX.Element {
  const pending = MOCK_SUBS.filter((s) => s.grade === null);
  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Homework & Grading</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--warn)" }}>{pending.length} submissions awaiting review</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_SUBS.map((s) => (
          <div key={s.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{s.assignment}</div>
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{s.student}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{s.course}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Submitted: {s.submittedAt}</span>
              </div>
            </div>
            {s.grade !== null ? (
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "#00ff88", fontWeight: 700 }}>{s.grade}/100</span>
            ) : (
              <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "8px 16px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                Grade
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
