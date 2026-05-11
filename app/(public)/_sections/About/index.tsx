const EXPERIENCE = [
  { role: "Senior DevOps Engineer", company: "Ameriabank", period: "Oct 2023 — Present",    stack: "K8s · Istio · ArgoCD · GitOps · Prometheus · Grafana · DataDog · ELK" },
  { role: "Senior DevOps Engineer", company: "digitAI",    period: "Dec 2022 — May 2024",   stack: "AKS · Azure DevOps · ArgoCD · GitOps · Helm · Prometheus · Grafana" },
  { role: "DevOps Engineer",        company: "IDT",        period: "Jun 2021 — Jul 2023",   stack: "Kubernetes · ELK · Azure DevOps CI/CD · ArgoCD · Prometheus · Grafana" },
];

const CERTS  = ["GitOps at Scale", "Linux — Linux Academy"];
const STACK  = ["Linux · Bash", "Git · GitHub / GitLab", "Jenkins · GitLab CI · Azure DevOps", "Terraform · Ansible", "Docker · Kubernetes · Istio", "Prometheus · Grafana · DataDog · ELK", "ArgoCD · FluxCD"];

export default function About(): React.JSX.Element {
  return (
    <section id="about" style={{ padding: "80px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 24, height: 1, background: "var(--accent)" }}/>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>Instructor</span>
      </div>

      <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Sarmen Gharibian</h2>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--accent)", marginBottom: 22 }}>// Senior DevOps Engineer · Founder, DevOpsGuru</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.85, margin: "0 0 28px", maxWidth: 500 }}>
            I build and ship production-grade infrastructure every day — on-premise Kubernetes clusters, GitOps pipelines, Istio service meshes, and cloud infrastructure at Ameriabank, one of Armenia&apos;s leading banks. I teach exactly what I use in production.
          </p>

          <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 14 }}>Experience</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
            {EXPERIENCE.map((e) => (
              <div key={e.company} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{e.role} — {e.company}</div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{e.period}</span>
                </div>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{e.stack}</div>
              </div>
            ))}
          </div>

          <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>Certifications</span>
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {CERTS.map((c) => (
              <span key={c} style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 33%, transparent)", padding: "5px 12px", borderRadius: 4 }}>{c}</span>
            ))}
          </div>

          <a
            href="https://www.linkedin.com/in/sarmen-gharibian90"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0a66c2", color: "#fff", textDecoration: "none", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2" fill="white"/>
            </svg>
            linkedin.com/in/sarmen-gharibian90
          </a>
        </div>

        <div style={{ width: 240, flexShrink: 0 }}>
          <div style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 22px" }}>
            <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 12 }}>Stack I teach</span>
            {STACK.map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }}/>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text)" }}>{t}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
              {([["7+", "Years"], ["500+", "Connects"], ["2", "Certs"]] as const).map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>{v}</div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 8, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
