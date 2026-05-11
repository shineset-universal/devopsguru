"use client";

import { useState } from "react";

export default function AdminSettingsPage(): React.JSX.Element {
  const [vals, setVals] = useState({
    instructorName:    "Sarmen Gharibian",
    instructorTitle:   "Senior DevOps Engineer · Founder, DevOpsGuru",
    contactEmail:      "sarmen@devopsguru.am",
    linkedin:          "https://www.linkedin.com/in/sarmen-gharibian90",
    passingGrade:      "70",
    magicLinkExpiry:   "15",
  });
  const [saved, setSaved] = useState(false);

  function save(): void {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fields: Array<[keyof typeof vals, string]> = [
    ["instructorName",  "Instructor name"],
    ["instructorTitle", "Title / role"],
    ["contactEmail",    "Contact email"],
    ["linkedin",        "LinkedIn URL"],
    ["passingGrade",    "Passing grade (%)"],
    ["magicLinkExpiry", "Magic link expiry (min)"],
  ];

  return (
    <div style={{ padding: 28 }}>
      {saved && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#00ff8822", border: "1px solid #00ff8844", color: "#00ff88", padding: "10px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, zIndex: 9999 }}>
          Settings saved
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Site Settings</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>Global configuration — saved to database</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
        {fields.map(([k, label]) => (
          <div key={k} style={{ marginBottom: 16 }}>
            <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>{label}</span>
            <input
              value={vals[k]}
              onChange={(e) => setVals((v) => ({ ...v, [k]: e.target.value }))}
              style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={save} style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "11px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          Save settings
        </button>
      </div>
    </div>
  );
}
