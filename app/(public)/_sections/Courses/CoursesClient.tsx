"use client";

import { useState } from "react";
import Link from "next/link";
import ModuleIcon from "@/components/icons/ModuleIcon";
import type { MockCourse } from "@/lib/mock-data";

const LEVEL_COLOR: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#00ff8818", color: "#00ff88" },
  Intermediate: { bg: "#ffaa0018", color: "#ffaa00" },
  Advanced:     { bg: "#ff606018", color: "#ff6060" },
  Capstone:     { bg: "#00d4ff18", color: "#00d4ff" },
};

function LevelBadge({ level }: { level: string }): React.JSX.Element {
  const c = LEVEL_COLOR[level] ?? LEVEL_COLOR["Beginner"]!;
  return (
    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: c.bg, color: c.color, padding: "3px 8px", borderRadius: 99 }}>
      {level}
    </span>
  );
}

function CourseCard({ course, onClick }: { course: MockCourse; onClick: (c: MockCourse) => void }): React.JSX.Element {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(course)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--card-dark)",
        border: `1px solid ${hov ? course.accent + "66" : "var(--border)"}`,
        borderRadius: 8, overflow: "hidden", cursor: "pointer",
        display: "flex", flexDirection: "column",
        transition: "all 0.2s",
        transform: hov ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{ position: "relative", height: 130, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50%, ${course.accent}10 0%, transparent 70%)` }}/>
        <div style={{ width: 64, height: 64, position: "relative", zIndex: 1 }}><ModuleIcon name={course.iconKey} /></div>
        <div style={{ position: "absolute", top: 10, left: 12, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, color: course.accent, background: "color-mix(in srgb, var(--card-dark) 80%, transparent)", border: `1px solid ${course.accent}33`, padding: "2px 7px", borderRadius: 4 }}>
          {course.num}
        </div>
        {course.capstone && (
          <div style={{ position: "absolute", top: 10, right: 12, fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 20%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)", padding: "2px 8px", borderRadius: 99 }}>
            CAPSTONE
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <LevelBadge level={course.level} />
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{course.weeks}</span>
        </div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 6, lineHeight: 1.3 }}>{course.title}</div>
        <p style={{ fontFamily: "Syne, sans-serif", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7, margin: "0 0 12px", flex: 1 }}>{course.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {course.topics.slice(0, 3).map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: course.accent, flexShrink: 0, marginTop: 5 }}/>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
          {course.topics.length > 3 && (
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: course.accent, marginLeft: 10 }}>
              +{course.topics.length - 3} more
            </span>
          )}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: course.accent, textTransform: "uppercase" }}>View details</span>
        </div>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose }: { course: MockCourse | null; onClose: () => void }): React.JSX.Element | null {
  if (!course) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(5,8,16,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
    >
      <div style={{ background: "var(--bg-2)", border: `1px solid ${course.accent}44`, borderRadius: 10, width: "100%", maxWidth: 500, overflow: "hidden" }}>
        <div style={{ height: 3, background: course.accent }}/>
        <div style={{ background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", height: 110, borderBottom: "1px solid var(--border)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, ${course.accent}10 0%, transparent 65%)` }}/>
          <div style={{ width: 60, height: 60, position: "relative", zIndex: 1 }}><ModuleIcon name={course.iconKey} /></div>
        </div>
        <div style={{ padding: "22px 26px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: course.accent, fontWeight: 700 }}>{course.num}</span>
            <LevelBadge level={course.level} />
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{course.weeks}</span>
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", margin: "0 0 8px" }}>{course.title}</h2>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.75, margin: "0 0 18px" }}>{course.desc}</p>
          <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>Topics covered</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
            {course.topics.map((t, i) => (
              <div key={t} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: course.accent, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)" }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/enroll" style={{ flex: 1, background: "var(--accent)", border: "none", color: "#050810", padding: 12, borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "block", textAlign: "center" }}>
              Apply to enroll
            </Link>
            <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "12px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesClient({ courses }: { courses: MockCourse[] }): React.JSX.Element {
  const [selected, setSelected] = useState<MockCourse | null>(null);

  return (
    <section id="courses" style={{ padding: "80px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 1, background: "var(--accent)" }}/>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>Full curriculum</span>
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>9 modules. One complete path.</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => {
            const c = LEVEL_COLOR[l]!;
            return <span key={l} style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 99 }}>{l}</span>;
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} onClick={setSelected} />
        ))}
      </div>

      <CourseModal course={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
