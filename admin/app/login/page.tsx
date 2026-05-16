"use client";

import { useState } from "react";

type Step = "password" | "totp";

export default function AdminLoginPage(): React.JSX.Element {
  const [step, setStep]       = useState<Step>("password");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function submitPassword(): Promise<void> {
    if (!email || !password) { setError("Email and password are required."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { step?: string; error?: string };
      if (!res.ok) { setError(data.error ?? "Login failed."); return; }
      if (data.step === "totp") setStep("totp");
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitTotp(): Promise<void> {
    if (code.length !== 6) { setError("Enter the 6-digit code from your authenticator app."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Invalid code."); return; }
      window.location.href = "/dashboard";
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
          {(["password", "totp"] as Step[]).map((s, i) => (
            <div key={s} style={{ flex: 1, height: 2, borderRadius: 99, background: step === s ? "var(--danger)" : (i === 0 || step === "totp") ? "color-mix(in srgb, var(--danger) 40%, transparent)" : "var(--border)" }}/>
          ))}
        </div>

        {step === "password" ? (
          <>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 21, color: "var(--text)", marginBottom: 4 }}>Admin login</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
              Enter your credentials to continue.
            </div>

            <div style={{ marginBottom: 14 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarmen@devopsguru.am"
                autoComplete="email"
                onKeyDown={(e) => e.key === "Enter" && void submitPassword()}
                style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === "Enter" && void submitPassword()}
                style={{ width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 13px", fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text)", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginBottom: 12 }}>✕ {error}</div>}

            <button
              onClick={() => void submitPassword()}
              disabled={loading}
              style={{ width: "100%", background: loading ? "color-mix(in srgb, var(--danger) 60%, transparent)" : "var(--danger)", border: "none", color: "#fff", padding: "11px 22px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Verifying…" : "Continue →"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 21, color: "var(--text)", marginBottom: 4 }}>Two-factor auth</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
              Open Google Authenticator and enter the 6-digit code for <span style={{ color: "var(--accent)", fontFamily: "Space Mono, monospace", fontSize: 11 }}>DevOpsGuru Admin</span>.
            </div>

            <div style={{ marginBottom: 18 }}>
              <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>Authenticator code</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && void submitTotp()}
                style={{
                  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: 6, padding: "12px 13px",
                  fontFamily: "Space Mono, monospace", fontSize: 22, letterSpacing: "0.3em",
                  color: "var(--text)", outline: "none", boxSizing: "border-box", textAlign: "center",
                }}
              />
            </div>

            {error && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)", marginBottom: 12 }}>✕ {error}</div>}

            <button
              onClick={() => void submitTotp()}
              disabled={loading || code.length !== 6}
              style={{ width: "100%", background: loading || code.length !== 6 ? "color-mix(in srgb, var(--danger) 50%, transparent)" : "var(--danger)", border: "none", color: "#fff", padding: "11px 22px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: loading || code.length !== 6 ? "not-allowed" : "pointer" }}
            >
              {loading ? "Verifying…" : "Verify & sign in"}
            </button>

            <button
              onClick={() => { setStep("password"); setCode(""); setError(""); }}
              style={{ width: "100%", marginTop: 10, background: "transparent", border: "none", color: "var(--text-dim)", fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer", padding: "8px" }}
            >
              ← Back to password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
