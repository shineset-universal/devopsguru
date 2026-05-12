import Link from "next/link";

export default function Footer(): React.JSX.Element {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "32px 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, color: "var(--text)", letterSpacing: "-0.02em" }}>
          DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
        </span>
        <span style={{
          display: "block", marginTop: 4,
          fontFamily: "Space Mono, monospace", fontSize: 10,
          letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase",
        }}>
          {"// devopsguru.am · Yerevan, Armenia"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/auth/login" style={{
          background: "transparent", border: "1px solid var(--border)",
          color: "var(--text-dim)", padding: "11px 22px", borderRadius: 6,
          fontFamily: "Space Mono, monospace", fontSize: 11,
          cursor: "pointer", textDecoration: "none", display: "inline-block",
        }}>
          Login
        </Link>
        <Link href="/enroll" style={{
          background: "var(--accent)", border: "none", color: "#050810",
          padding: "11px 22px", borderRadius: 6,
          fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700,
          cursor: "pointer", textDecoration: "none", display: "inline-block",
        }}>
          Enroll now
        </Link>
      </div>
    </footer>
  );
}
