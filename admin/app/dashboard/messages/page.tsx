const MOCK_THREADS = [
  { id: 1, student: "Aram Hakobyan",   course: "Linux Basics",                lastMsg: "The for loop syntax with arrays. Can you share an example?", time: "Apr 1",   unread: 1 },
  { id: 2, student: "Ani Petrosyan",   course: "Version Control with Git",     lastMsg: "Thanks for the explanation on rebasing!",                     time: "Apr 3",   unread: 0 },
  { id: 3, student: "Narek Vardanyan", course: "CI/CD Pipelines",              lastMsg: "How do I set up the Jenkins pipeline for my repo?",            time: "May 10",  unread: 2 },
];

export default function AdminMessagesPage(): React.JSX.Element {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Messages</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)" }}>3 unread messages</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MOCK_THREADS.map((t) => (
          <div key={t.id} style={{ background: "var(--card-dark)", border: `1px solid ${t.unread ? "color-mix(in srgb, var(--accent) 30%, var(--border))" : "var(--border)"}`, borderRadius: 8, padding: 18, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "color-mix(in srgb, var(--accent) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>
              {t.student.split(" ").map((w) => w[0]).join("")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{t.student}</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{t.time}</span>
              </div>
              <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--accent)", marginBottom: 2 }}>{t.course}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 12, color: "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.lastMsg}</div>
            </div>
            {t.unread > 0 && (
              <span style={{ background: "var(--accent)", color: "#050810", fontFamily: "Space Mono, monospace", fontSize: 9, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {t.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
