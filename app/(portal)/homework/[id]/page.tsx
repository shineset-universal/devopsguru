"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Assignment {
  id: number;
  title: string;
  description: string | null;
  course_title: string;
  due_date: string | null;
  max_score: number;
  submission: Submission | null;
}

interface Submission {
  content: string | null;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
}

export default function HomeworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/homework")
      .then((r) => r.json())
      .then((d: { assignments: Assignment[] }) => {
        const found = d.assignments?.find((a) => String(a.id) === id);
        setAssignment(found ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function submitHomework(): Promise<void> {
    if (!content.trim()) return;
    setErr("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/homework/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json() as { error?: string; submission?: Submission };
      if (!res.ok) { setErr(data.error ?? "Failed to submit."); return; }
      setAssignment((prev) => prev ? { ...prev, submission: data.submission ?? null } : prev);
    } catch {
      setErr("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 28, fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>Loading…</div>;
  }

  if (!assignment) {
    return <div style={{ padding: 28, fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--danger)" }}>Assignment not found.</div>;
  }

  const isGraded = !!assignment.submission?.graded_at;
  const isSubmitted = !!assignment.submission;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/homework" style={{ color: "var(--text-dim)", textDecoration: "none", fontFamily: "Space Mono, monospace", fontSize: 11 }}>← Homework</Link>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Assignment</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text)", margin: 0 }}>{assignment.title}</h1>
              {isGraded && (
                <div style={{ background: "#00ff8818", border: "1px solid #00ff8844", borderRadius: 8, padding: "10px 16px", textAlign: "center", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#00ff88" }}>{assignment.submission?.grade}</div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#00ff88" }}>/{assignment.max_score}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{assignment.course_title}</span>
              {assignment.due_date && (
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
            {assignment.description && (
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
                {assignment.description}
              </p>
            )}
          </div>

          {isGraded ? (
            <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 24 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Instructor feedback</span>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>
                {assignment.submission?.feedback || "No feedback provided."}
              </p>
            </div>
          ) : isSubmitted ? (
            <div style={{ background: "#ffaa0018", border: "1px solid #ffaa0044", borderRadius: 8, padding: 24, textAlign: "center" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "#ffaa00", marginBottom: 8 }}>Submitted — awaiting review</div>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>Your instructor will grade this soon.</p>
            </div>
          ) : (
            <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 24 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Your submission</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your solution here..."
                rows={8}
                style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Space Mono, monospace", fontSize: 12, color: "var(--text)", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }}
              />
              {err && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginTop: 8 }}>✕ {err}</div>}
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={submitHomework}
                  disabled={!content.trim() || submitting}
                  style={{ background: content.trim() && !submitting ? "var(--accent)" : "var(--border)", border: "none", color: content.trim() && !submitting ? "#050810" : "var(--text-dim)", padding: "11px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: content.trim() && !submitting ? "pointer" : "default" }}
                >
                  {submitting ? "Submitting…" : "Submit assignment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
