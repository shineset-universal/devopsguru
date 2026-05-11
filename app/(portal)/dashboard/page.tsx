import ModuleIcon from "@/components/icons/ModuleIcon";
import { MOCK_COURSES, MOCK_HOMEWORK } from "@/lib/mock-data";

const ENROLLED_IDS = [1, 5, 6];
const PCTS = [78, 45, 12];
const LASTS = [
  "File permissions & process management",
  "Building and managing Docker images",
  "Kubernetes architecture",
];

export default function DashboardPage(): React.JSX.Element {
  const enrolled = MOCK_COURSES.filter((c) => ENROLLED_IDS.includes(c.id));
  const pendingHw = MOCK_HOMEWORK.filter((h) => h.status === "pending").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Dashboard</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>Good morning, Aram</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Notify", "Settings"].map((l) => (
            <button key={l} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: 10 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {([
            ["Modules",  String(enrolled.length), "var(--accent)",  "enrolled"],
            ["Progress", "45%",                    "var(--text)",    "avg"],
            ["Homework", String(pendingHw),         "var(--warn)",   "pending"],
            ["Certs",    "0",                       "var(--success)","earned"],
          ] as const).map(([l, v, c, s]) => (
            <div key={l} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 4, padding: 16 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>{l}</span>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 24, color: c }}>{v}</div>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginTop: 4, display: "block" }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>My modules</div>

        {enrolled.map((c, i) => (
          <div key={c.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 4, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, flexShrink: 0, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: 7 }}>
              <ModuleIcon name={c.iconKey} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: c.accent }}>{c.num}</span>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{c.title}</div>
              </div>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>
                Last: {LASTS[i]}
              </span>
              <div style={{ height: 3, background: "var(--bg-3)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${PCTS[i]}%`, background: c.accent, borderRadius: 2 }}/>
              </div>
            </div>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: c.accent, fontWeight: 700 }}>{PCTS[i]}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
