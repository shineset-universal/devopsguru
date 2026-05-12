"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Assignment {
  id: number;
  title: string;
  course_title: string;
  due_date: string | null;
  submission: { grade: number | null; graded_at: string | null; submitted_at: string } | null;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#ff606018", color: "#ff6060", label: "Pending" },
  submitted: { bg: "#ffaa0018", color: "#ffaa00", label: "Submitted" },
  graded:    { bg: "#00ff8818", color: "#00ff88", label: "Graded" },
};

function getStatus(a: Assignment): "pending" | "submitted" | "graded" {
  if (!a.submission) return "pending";
  if (a.submission.graded_at) return "graded";
  return "submitted";
}

export default function HomeworkPage(): React.JSX.Element {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homework")
      .then((r) => r.json())
      .then((d: { assignments: Assignment[] }) => setAssignments(d.assignments ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = assignments.filter((a) => getStatus(a) === "pending").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Homework</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          {loading ? "Loading..." : `${pending} pending assignment${pending !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {loading ? (
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>Loading assignments…</div>
        ) : assignments.length === 0 ? (
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>No assignments yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {assignments.map((hw) => {
              const status = getStatus(hw);
              const s = STATUS_STYLE[status]!;
              return (
                <Link key={hw.id} href={`/homework/${hw.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{hw.title}</div>
                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{hw.course_title}</span>
                        {hw.due_date && (
                          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>
                            Due: {new Date(hw.due_date).toLocaleDateString()}
                          </span>
                        )}
                        {status === "graded" && hw.submission?.grade !== null && (
                          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--success)" }}>Grade: {hw.submission?.grade}/100</span>
                        )}
                      </div>
                    </div>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>{s.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
