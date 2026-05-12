"use client";

import { useEffect, useState } from "react";

interface Certificate {
  id: number;
  course_id: number;
  course_title: string;
  issued_at: string;
  cert_url: string | null;
}

export default function CertificatesPage(): React.JSX.Element {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((d: { certificates: Certificate[] }) => setCerts(d.certificates ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Certificates</div>
        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          {loading ? "Loading..." : `${certs.length} earned`}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {loading ? (
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>Loading…</div>
        ) : certs.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 28 }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>◆</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", marginBottom: 12 }}>No certificates yet</div>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>
                Complete all lessons and assignments in a course to earn your certificate. You need a grade of 70% or higher on all assignments.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {certs.map((cert) => (
              <div key={cert.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{cert.course_title}</div>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>
                    Issued {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                {cert.cert_url && (
                  <a
                    href={`/api/certificates/${cert.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "#050810", background: "var(--accent)", padding: "8px 18px", borderRadius: 6, textDecoration: "none", fontWeight: 700 }}
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
