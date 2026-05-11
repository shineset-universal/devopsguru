import { MOCK_SESSIONS } from "@/lib/mock-data";
import { format } from "date-fns";

export default function AdminSessionsPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Live Sessions</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Schedule and manage live sessions</span>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
          + Schedule session
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MOCK_SESSIONS.map((s) => {
          const dt = new Date(s.scheduledAt);
          return (
            <div key={s.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ textAlign: "center", background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", borderRadius: 8, padding: "10px 14px", flexShrink: 0 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--accent)", lineHeight: 1 }}>{format(dt, "d")}</div>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase" }}>{format(dt, "MMM")}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{s.title}</div>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{s.course}</span>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{format(dt, "HH:mm")} UTC · {s.durationMin} min</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Edit</button>
                <button style={{ background: "color-mix(in srgb, var(--danger) 18%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 44%, transparent)", color: "var(--danger)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
