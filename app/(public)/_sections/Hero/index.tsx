import Link from "next/link";
import ModuleIcon from "@/components/icons/ModuleIcon";
import HeroAnimation from "./HeroAnimation";

const TOOL_LABELS = ["Linux", "Git", "CI/CD", "Terraform", "Docker", "Kubernetes", "Monitoring", "GitOps"];
const TOOL_ICONS  = ["linux", "git", "cicd", "terraform", "docker", "kubernetes", "grafana", "gitops"];

export default function Hero(): React.JSX.Element {
  return (
    <section style={{ padding: "96px 40px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, right: -80, width: 560, height: 560, background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 65%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.3, pointerEvents: "none" }}/>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 60 }}>

        {/* ── Left content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 24, height: 1, background: "var(--accent)" }}/>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>
              DevOps Coaching · Yerevan, Armenia
            </span>
          </div>

          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 52, lineHeight: 1.04, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 40px" }}>
            From zero to<br/><span style={{ color: "var(--accent)" }}>production-ready</span><br/>DevOps engineer.
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {TOOL_LABELS.map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 14px" }}>
                <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                  <ModuleIcon name={TOOL_ICONS[i]!} />
                </div>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text)", letterSpacing: "0.04em" }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/enroll" style={{
              background: "var(--accent)", color: "#050810", border: "none",
              padding: "14px 32px", borderRadius: 8,
              fontFamily: "Space Mono, monospace", fontSize: 12, fontWeight: 700,
              cursor: "pointer", textDecoration: "none", display: "inline-block",
            }}>
              Apply now
            </Link>
            <a href="#courses" style={{
              background: "transparent", color: "var(--text)", border: "1px solid var(--border)",
              padding: "14px 32px", borderRadius: 8,
              fontFamily: "Space Mono, monospace", fontSize: 12,
              cursor: "pointer", textDecoration: "none", display: "inline-block",
            }}>
              View curriculum
            </a>
          </div>

          <div style={{ display: "flex", marginTop: 56, borderTop: "1px solid var(--border)", paddingTop: 32, maxWidth: 440 }}>
            {([["9", "Modules"], ["20+", "Weeks"], ["100%", "Hands-on"], ["15+", "Yrs exp."]] as const).map(([v, l], i) => (
              <div key={l} style={{
                flex: 1, paddingRight: 20,
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                paddingLeft: i > 0 ? 20 : 0,
              }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 26, color: "var(--accent)" }}>{v}</div>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: animated terminal ── */}
        <div style={{ flexShrink: 0, width: 560 }}>
          <HeroAnimation />
        </div>

      </div>
    </section>
  );
}
