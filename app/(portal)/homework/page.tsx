import Link from "next/link";
import { MOCK_HOMEWORK } from "@/lib/mock-data";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#ff606018", color: "#ff6060", label: "Pending" },
  submitted: { bg: "#ffaa0018", color: "#ffaa00", label: "Submitted" },
  graded:    { bg: "#00ff8818", color: "#00ff88", label: "Graded" },
};

export default function HomeworkPage(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Homework</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          {MOCK_HOMEWORK.filter((h) => h.status === "pending").length} pending assignments
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_HOMEWORK.map((hw) => {
            const s = STATUS_STYLE[hw.status]!;
            return (
              <Link key={hw.id} href={`/homework/${hw.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{hw.title}</div>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{hw.course}</span>
                      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Due: {hw.dueDate}</span>
                      {hw.grade !== undefined && (
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--success)" }}>Grade: {hw.grade}/100</span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>{s.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
