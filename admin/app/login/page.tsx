"use client";

import { useState } from "react";

export default function AdminLoginPage(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [err, setErr]     = useState("");

  function submit(): void {
    if (!email.includes("@")) { setErr("Please enter a valid email."); return; }
    setErr(""); setSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, width: 380, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--danger), var(--accent-3))", borderRadius: "10px 10px 0 0" }}/>

        <div style={{ marginBottom: 28 }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text)", letterSpacing: "-0.02em" }}>
            DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
          </span>
          <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--danger)", marginTop: 4, letterSpacing: "0.08em" }}>
            // ADMIN PANEL
          </span>
        </div>

        {!sent ? (
          <>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 21, color: "var(--text)", marginBottom: 4 }}>Admin login</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
              Enter your admin email to receive a magic link.
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarmen@devopsguru.am"
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {err && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginBottom: 12 }}>✕ {err}</div>}

            <button
              onClick={submit}
              style={{ width: "100%", background: "var(--danger)", border: "none", color: "#fff", padding: "11px 22px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              Send magic link
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>✉️</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>Check your inbox</div>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
              Link sent to{" "}
              <span style={{ color: "var(--accent)", fontFamily: "Space Mono, monospace", fontSize: 11 }}>{email}</span>.<br/>
              Expires in 15 minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
