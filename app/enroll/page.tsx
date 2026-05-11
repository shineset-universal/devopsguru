"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnrollPage(): React.JSX.Element {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode]   = useState("");
  const [sent, setSent]   = useState(false);
  const [err, setErr]     = useState("");

  function submit(): void {
    if (!name.trim())        { setErr("Please enter your full name.");    return; }
    if (!email.includes("@")){ setErr("Please enter a valid email.");     return; }
    if (code.length < 4)     { setErr("Please enter your access code."); return; }
    setErr(""); setSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 40px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text)", letterSpacing: "-0.02em" }}>
            DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
          </span>
        </Link>
        <Link href="/" style={{ color: "var(--text-dim)", fontFamily: "Space Mono, monospace", fontSize: 11, textDecoration: "none" }}>
          Back to site
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, width: 420, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--accent-2), var(--accent), var(--accent-3))", borderRadius: "10px 10px 0 0" }}/>

          {!sent ? (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text)", margin: "0 0 6px" }}>Apply to enroll</h1>
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
                  Enter your details and the access code you received.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Full name</span>
                <input
                  value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                  style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Email address</span>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Access code</span>
                <input
                  value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DEVOPS2026"
                  style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Space Mono, monospace", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box", letterSpacing: "0.12em" }}
                />
              </div>

              {err && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginBottom: 12 }}>✕ {err}</div>}

              <button
                onClick={submit}
                style={{ width: "100%", background: "var(--accent)", border: "none", color: "#050810", padding: "11px 22px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
              >
                Create my account
              </button>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Link href="/auth/login" style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)", textDecoration: "none" }}>
                  Already have an account? Login →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✉️</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>Check your inbox</div>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
                Magic link sent to{" "}
                <span style={{ color: "var(--accent)", fontFamily: "Space Mono, monospace", fontSize: 11 }}>{email}</span>.<br/>
                Click it to access your courses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
