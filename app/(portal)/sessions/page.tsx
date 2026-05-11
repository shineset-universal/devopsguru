import { MOCK_SESSIONS } from "@/lib/mock-data";
import { format } from "date-fns";

export default function SessionsPage(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Live Sessions</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>Upcoming schedule</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_SESSIONS.map((s) => {
            const dt = new Date(s.scheduledAt);
            return (
              <div key={s.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", gap: 20 }}>
                <div style={{ width: 64, flexShrink: 0, textAlign: "center", background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", borderRadius: 8, padding: "10px 8px" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "var(--accent)", lineHeight: 1 }}>{format(dt, "d")}</div>
                  <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase" }}>{format(dt, "MMM")}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{s.course}</span>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{format(dt, "HH:mm")} UTC · {s.durationMin} min</span>
                  </div>
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-block", background: "var(--accent)", color: "#050810", padding: "8px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, textDecoration: "none" }}
                  >
                    Join session →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
