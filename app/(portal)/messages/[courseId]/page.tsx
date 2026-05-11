"use client";

import { useState } from "react";

const MOCK_MESSAGES = [
  { id: 1, sender: "instructor" as const, body: "Welcome to the course! Feel free to ask questions here.",     time: "Apr 1, 09:00" },
  { id: 2, sender: "student"    as const, body: "Thanks! I had a question about the shell scripting module.",   time: "Apr 1, 10:15" },
  { id: 3, sender: "instructor" as const, body: "Of course — what specifically are you unsure about?",          time: "Apr 1, 10:30" },
  { id: 4, sender: "student"    as const, body: "The for loop syntax with arrays. Can you share an example?",   time: "Apr 1, 11:00" },
  { id: 5, sender: "instructor" as const, body: 'Sure: `for item in "${arr[@]}"; do echo "$item"; done`',       time: "Apr 1, 11:05" },
];

export default function MessagesPage(): React.JSX.Element {
  const [body, setBody] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Messages</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Linux Basics · Direct message with instructor</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        {MOCK_MESSAGES.map((m) => {
          const isStudent = m.sender === "student";
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: isStudent ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "66%", background: isStudent ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "var(--card-dark)", border: `1px solid ${isStudent ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)"}`, borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", lineHeight: 1.6, margin: "0 0 6px" }}>{m.body}</p>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{m.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message..."
          style={{ flex: 1, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none" }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setBody(""); } }}
        />
        <button
          onClick={() => setBody("")}
          style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "10px 20px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
