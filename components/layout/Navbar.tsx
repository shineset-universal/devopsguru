import Link from "next/link";

export default function Navbar(): React.JSX.Element {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 40px",
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb, var(--bg) 93%, transparent)",
      backdropFilter: "blur(8px)",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em" }}>
          DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {(["Courses", "About", "How it works"] as const).map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/ /g, "-")}`}
            style={{
              fontFamily: "Space Mono, monospace", fontSize: 11,
              letterSpacing: "0.06em", color: "var(--text-dim)",
              textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
        <Link href="/auth/login" style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text-dim)",
          padding: "11px 22px", borderRadius: 6,
          fontFamily: "Space Mono, monospace", fontSize: 11,
          cursor: "pointer", textDecoration: "none", display: "inline-block",
        }}>
          Login
        </Link>
        <Link href="/enroll" style={{
          background: "var(--accent)",
          border: "none",
          color: "#050810",
          padding: "11px 22px", borderRadius: 6,
          fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700,
          cursor: "pointer", textDecoration: "none", display: "inline-block",
        }}>
          Enroll now
        </Link>
      </div>
    </nav>
  );
}
