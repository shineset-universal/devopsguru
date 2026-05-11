import ModuleIcon from "@/components/icons/ModuleIcon";
import { MOCK_COURSES } from "@/lib/mock-data";

const LEVEL_COLOR: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#00ff8818", color: "#00ff88" },
  Intermediate: { bg: "#ffaa0018", color: "#ffaa00" },
  Advanced:     { bg: "#ff606018", color: "#ff6060" },
  Capstone:     { bg: "#00d4ff18", color: "#00d4ff" },
};

export default function AdminCoursesPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Courses & Modules</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Manage course content and modules</span>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
          + Add module
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_COURSES.map((c) => {
          const lc = LEVEL_COLOR[c.level]!;
          return (
            <div key={c.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
                <ModuleIcon name={c.iconKey} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: c.accent }}>{c.num}</span>
                  <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{c.title}</span>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: lc.bg, color: lc.color, padding: "2px 8px", borderRadius: 99 }}>{c.level}</span>
                </div>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{c.weeks} · {c.topics.length} topics</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Edit</button>
                <button style={{ background: "color-mix(in srgb, var(--danger) 18%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 44%, transparent)", color: "var(--danger)", padding: "6px 12px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
