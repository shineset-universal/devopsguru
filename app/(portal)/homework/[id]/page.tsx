"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_HOMEWORK } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default function HomeworkDetailPage({ params }: { params: { id: string } }): React.JSX.Element {
  const hw = MOCK_HOMEWORK.find((h) => h.id === Number(params.id));
  if (!hw) notFound();

  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(hw.status !== "pending");

  const isGraded = hw.status === "graded";

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
              <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text)", margin: 0 }}>{hw.title}</h1>
              {isGraded && (
                <div style={{ background: "#00ff8818", border: "1px solid #00ff8844", borderRadius: 8, padding: "10px 16px", textAlign: "center", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#00ff88" }}>{hw.grade}</div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#00ff88" }}>/100</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)" }}>{hw.course}</span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>Due: {hw.dueDate}</span>
            </div>
          </div>

          {isGraded ? (
            <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 24 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Instructor feedback</span>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>
                Great work! Your solution demonstrates a solid understanding of the concepts. Well done on the edge case handling.
              </p>
            </div>
          ) : submitted ? (
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
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!content.trim()}
                  style={{ background: content.trim() ? "var(--accent)" : "var(--border)", border: "none", color: content.trim() ? "#050810" : "var(--text-dim)", padding: "11px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: content.trim() ? "pointer" : "default" }}
                >
                  Submit assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
