export default function HomePage(): React.JSX.Element {
  return (
    <main style={{ minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "Syne, sans-serif", color: "#e8edf8", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800 }}>
          DevOps<span style={{ color: "#00d4ff" }}>Guru</span>
        </h1>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color: "#7a8aaa", marginTop: 12 }}>
          // Phase 0 complete — localhost:3000 running
        </p>
      </div>
    </main>
  );
}
