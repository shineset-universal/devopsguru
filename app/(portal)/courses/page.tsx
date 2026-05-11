import Link from "next/link";
import ModuleIcon from "@/components/icons/ModuleIcon";
import { MOCK_COURSES } from "@/lib/mock-data";

const ENROLLED_IDS = [1, 5, 6];
const PCTS: Record<number, number> = { 1: 78, 5: 45, 6: 12 };

const LEVEL_COLOR: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#00ff8818", color: "#00ff88" },
  Intermediate: { bg: "#ffaa0018", color: "#ffaa00" },
  Advanced:     { bg: "#ff606018", color: "#ff6060" },
  Capstone:     { bg: "#00d4ff18", color: "#00d4ff" },
};

export default function CoursesPage(): React.JSX.Element {
  const enrolled = MOCK_COURSES.filter((c) => ENROLLED_IDS.includes(c.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>My courses</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{enrolled.length} modules enrolled</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {enrolled.map((c) => {
            const lc = LEVEL_COLOR[c.level]!;
            const pct = PCTS[c.id] ?? 0;
            return (
              <Link key={c.id} href={`/courses/${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, flexShrink: 0, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                    <ModuleIcon name={c.iconKey} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: c.accent }}>{c.num}</span>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: lc.bg, color: lc.color, padding: "2px 8px", borderRadius: 99 }}>{c.level}</span>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{c.weeks}</span>
                    </div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 10 }}>{c.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, height: 4, background: "var(--bg-3)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: c.accent, borderRadius: 2 }}/>
                      </div>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: c.accent, fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                    </div>
                  </div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
