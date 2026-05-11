import Link from "next/link";

export default function VerifyPage(): React.JSX.Element {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 40, width: 380, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--accent-2), var(--accent), var(--accent-3))", borderRadius: "10px 10px 0 0" }}/>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🔗</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
          Verifying your link...
        </div>
        <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 24 }}>
          Please wait while we verify your magic link.
        </p>
        <Link href="/auth/login" style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)", textDecoration: "none" }}>
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
