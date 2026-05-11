import Link from "next/link";

const STEPS = [
  { num: "01", title: "Apply",                desc: "Fill out the application form. I review every request personally and respond within 48 hours." },
  { num: "02", title: "Get your access code", desc: "Once accepted you receive a personal access code by email to register in your student portal." },
  { num: "03", title: "Start learning",       desc: "Attend live sessions, complete hands-on assignments, watch recordings and message me directly." },
  { num: "04", title: "Graduate",             desc: "Complete all 9 modules and the capstone project. Earn your certificate and ship real infrastructure." },
];

export default function HowItWorks(): React.JSX.Element {
  return (
    <section id="how-it-works" style={{ padding: "80px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 24, height: 1, background: "var(--accent)" }}/>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>Process</span>
      </div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, color: "var(--text)", margin: "0 0 48px", letterSpacing: "-0.02em" }}>
        How it works
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ paddingRight: 32, paddingLeft: i > 0 ? 32 : 0, borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 26, fontWeight: 700, color: "color-mix(in srgb, var(--accent) 40%, transparent)", marginBottom: 16 }}>{s.num}</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56, textAlign: "center" }}>
        <Link href="/enroll" style={{
          background: "var(--accent)", color: "#050810", border: "none",
          padding: "14px 36px", borderRadius: 8,
          fontFamily: "Space Mono, monospace", fontSize: 12, fontWeight: 700,
          cursor: "pointer", textDecoration: "none", display: "inline-block",
        }}>
          Apply now
        </Link>
      </div>
    </section>
  );
}
