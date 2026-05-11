import Link from "next/link";

export default function LessonPage({ params }: { params: { slug: string; lessonId: string } }): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href={`/courses/${params.slug}`} style={{ color: "var(--text-dim)", textDecoration: "none", fontFamily: "Space Mono, monospace", fontSize: 11 }}>← Back to course</Link>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Lesson {params.lessonId}</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>▷</div>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>Video — Phase 2</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 16 }}>Lesson content</h1>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8 }}>
            Lesson content and materials will be available in Phase 2 when the backend is connected.
          </p>

          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "11px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Mark complete
            </button>
            <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "11px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, cursor: "pointer" }}>
              Next lesson →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
