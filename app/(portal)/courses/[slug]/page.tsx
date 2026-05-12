import Link from "next/link";
import ModuleIcon from "@/components/icons/ModuleIcon";
import { MOCK_COURSES } from "@/lib/mock-data";
import { notFound } from "next/navigation";

const MOCK_MODULES = [
  { id: 1, title: "Module 1: Getting Started",   lessons: [{ id: 1, title: "Introduction", durationMin: 12, completed: true }, { id: 2, title: "Installation & Setup", durationMin: 18, completed: true }, { id: 3, title: "First Commands", durationMin: 22, completed: false }] },
  { id: 2, title: "Module 2: Core Concepts",      lessons: [{ id: 4, title: "File System", durationMin: 30, completed: false }, { id: 5, title: "Permissions", durationMin: 25, completed: false }] },
  { id: 3, title: "Module 3: Advanced Topics",    lessons: [{ id: 6, title: "Shell Scripting", durationMin: 45, completed: false }, { id: 7, title: "Process Management", durationMin: 35, completed: false }] },
];

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  const totalLessons = MOCK_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = MOCK_MODULES.reduce((acc, m) => acc + m.lessons.filter((l) => l.completed).length, 0);
  const pct = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/courses" style={{ color: "var(--text-dim)", textDecoration: "none", fontFamily: "Space Mono, monospace", fontSize: 11 }}>← Courses</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>{course.title}</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>{completedLessons} / {totalLessons} lessons · {pct}% complete</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, flexShrink: 0 }}><ModuleIcon name={course.iconKey} /></div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, margin: "0 0 12px" }}>{course.desc}</p>
            <div style={{ height: 6, background: "var(--bg-3)", borderRadius: 3, marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: course.accent, borderRadius: 3 }}/>
            </div>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: course.accent }}>{pct}% complete</span>
          </div>
        </div>

        {MOCK_MODULES.map((mod) => (
          <div key={mod.id} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 8, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              {mod.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mod.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/courses/${course.slug}/${lesson.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 6, background: "var(--card-dark)", border: "1px solid var(--border)", cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${lesson.completed ? course.accent : "var(--border)"}`, background: lesson.completed ? course.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {lesson.completed && <span style={{ fontSize: 10, color: "#050810" }}>✓</span>}
                    </div>
                    <span style={{ flex: 1, fontFamily: "Syne, sans-serif", fontSize: 13, color: lesson.completed ? "var(--text-dim)" : "var(--text)" }}>{lesson.title}</span>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{lesson.durationMin}min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
