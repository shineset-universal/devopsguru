export default function CertificatesPage(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Certificates</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>0 earned</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>◆</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", marginBottom: 12 }}>No certificates yet</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 24 }}>
            Complete all lessons and assignments in a course to earn your certificate. You need a grade of 70% or higher on all assignments.
          </p>
          <div style={{ display: "flex", flex: 1, height: 4, background: "var(--bg-3)", borderRadius: 2, marginBottom: 8, maxWidth: 300, margin: "0 auto 8px" }}>
            <div style={{ height: "100%", width: "45%", background: "var(--accent)", borderRadius: 2 }}/>
          </div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>45% average progress across enrolled courses</span>
        </div>
      </div>
    </div>
  );
}
