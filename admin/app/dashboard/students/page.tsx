import { MOCK_STUDENTS } from "@/lib/mock-data";

const COLORS: Record<string, string> = { Active: "#00ff88", Pending: "#ffaa00", Inactive: "#ff6060" };

export default function StudentsPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Students</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>{MOCK_STUDENTS.length} registered students</span>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
          + Invite student
        </button>
      </div>

      <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 0, padding: "10px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-3)" }}>
          {["Name / Email", "Modules", "Enrolled", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</span>
          ))}
        </div>
        {MOCK_STUDENTS.map((s) => {
          const c = COLORS[s.status] ?? "#7a8aaa";
          return (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 0, padding: "14px 20px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{s.name}</div>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{s.email}</div>
              </div>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>{s.modules}</span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>{s.enrolledAt}</span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: `color-mix(in srgb, ${c} 18%, transparent)`, color: c, padding: "3px 10px", borderRadius: 99 }}>
                {s.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
