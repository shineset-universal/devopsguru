"use client";

import { useState } from "react";
import Link from "next/link";

type Mode = "login" | "enroll";

export default function LoginPage(): React.JSX.Element {
  const [mode, setMode]   = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [code, setCode]   = useState("");
  const [sent, setSent]   = useState(false);
  const [err, setErr]     = useState("");

  function submit(): void {
    if (mode === "enroll" && !name.trim()) { setErr("Please enter your full name."); return; }
    if (!email.includes("@"))              { setErr("Please enter a valid email.");   return; }
    if (mode === "enroll" && code.length < 4) { setErr("Please enter your access code."); return; }
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
        <Link href="/" style={{ background: "transparent", border: "none", color: "var(--text-dim)", fontFamily: "Space Mono, monospace", fontSize: 11, cursor: "pointer", textDecoration: "none" }}>
          Back to site
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div style={{ background: "#ffaa0012", borderBottom: "1px solid #ffaa0033", padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "#ffaa00" }}>
            ⚡ DEV MODE — skip magic link and access portal directly
          </span>
          <a href="/api/dev-login" style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "#050810", background: "#ffaa00", padding: "5px 14px", borderRadius: 4, textDecoration: "none", fontWeight: 700 }}>
            Login as Aram Hakobyan →
          </a>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, width: 380, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--accent-2), var(--accent), var(--accent-3))", borderRadius: "10px 10px 0 0" }}/>

          <div style={{ marginBottom: 28 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text)", letterSpacing: "-0.02em" }}>
              DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
            </span>
            <span style={{ display: "block", marginTop: 4, fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>
              {"// devopsguru.am"}
            </span>
          </div>

          {!sent ? (
            <>
              <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 6, marginBottom: 24, overflow: "hidden" }}>
                {(["login", "enroll"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErr(""); }}
                    style={{
                      flex: 1, padding: 9, border: "none", cursor: "pointer",
                      background: mode === m ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent",
                      color: mode === m ? "var(--accent)" : "var(--text-dim)",
                      fontFamily: "Space Mono, monospace", fontSize: 11, textTransform: "capitalize",
                    }}
                  >
                    {m === "login" ? "Login" : "Enroll"}
                  </button>
                ))}
              </div>

              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 21, color: "var(--text)", marginBottom: 4 }}>
                {mode === "login" ? "Welcome back" : "Get access"}
              </div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
                {mode === "login" ? "Enter your email. We will send you a magic link." : "Enter the access code you received by email."}
              </div>

              {mode === "enroll" && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Full name</span>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Email address</span>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {mode === "enroll" && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Access code</span>
                  <input
                    value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DEVOPS2026"
                    style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Space Mono, monospace", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box", letterSpacing: "0.12em" }}
                  />
                </div>
              )}

              {err && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginBottom: 12 }}>✕ {err}</div>}

              <button
                onClick={submit}
                style={{ width: "100%", background: "var(--accent)", border: "none", color: "#050810", padding: "11px 22px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
              >
                {mode === "login" ? "Send magic link" : "Create my account"}
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✉️</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>Check your inbox</div>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
                Link sent to{" "}
                <span style={{ color: "var(--accent)", fontFamily: "Space Mono, monospace", fontSize: 11 }}>{email}</span>.<br/>
                {mode === "login" ? "Expires in 15 minutes." : "Click to access your courses."}
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); setCode(""); setName(""); }}
                style={{ marginTop: 20, background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "9px 20px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, cursor: "pointer" }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
