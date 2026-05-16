"use client";

import { useState } from "react";
import Link from "next/link";
import ModuleIcon from "@/components/icons/ModuleIcon";

export interface PublicVideo {
  id: number;
  youtube_id: string | null;
  video_url: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  course: string | null;
  course_accent: string;
  icon_key: string;
  level: string;
  sort_order: number;
}

// Shown when the DB has no published videos yet
const SAMPLE_VIDEOS: PublicVideo[] = [
  { id: 1,  youtube_id: "ryxx5V_KA_Q", video_url: null, title: "Linux Command Line Full Course",          description: "Master the Linux command line from scratch — file system navigation, permissions, processes, shell scripting, and everything you need to get productive in a terminal.", duration: "5h 22m", course: "Linux Basics",                 course_accent: "#00d4ff", icon_key: "linux",      level: "Beginner",     sort_order: 1 },
  { id: 2,  youtube_id: "RGOj5yH7evk", video_url: null, title: "Git & GitHub Complete Tutorial",          description: "Everything about Git: commits, branching, merging, rebasing, pull requests, and real team workflows. From your first repo to advanced strategies used in production.",   duration: "1h 19m", course: "Version Control with Git",    course_accent: "#f05033", icon_key: "git",        level: "Beginner",     sort_order: 2 },
  { id: 3,  youtube_id: "3c-iBn73dDE", video_url: null, title: "Docker Tutorial for Beginners",           description: "Build, ship, and run containers. Covers Dockerfiles, images, volumes, networks, Docker Compose, and how containers work in production deployments.",                     duration: "3h 07m", course: "Containerization with Docker", course_accent: "#2496ed", icon_key: "docker",     level: "Intermediate", sort_order: 3 },
  { id: 4,  youtube_id: "X48VuDVv0do", video_url: null, title: "Kubernetes Tutorial for Beginners",       description: "Full Kubernetes crash course — pods, deployments, services, Ingress, ConfigMaps, Secrets, Helm charts, and real cluster operations you'll actually use on the job.",     duration: "4h 19m", course: "Kubernetes Orchestration",    course_accent: "#326ce5", icon_key: "kubernetes", level: "Advanced",     sort_order: 4 },
  { id: 5,  youtube_id: "7xngnjfIlK4", video_url: null, title: "Terraform Full Course",                   description: "Provision and manage cloud infrastructure with Terraform. Covers providers, state, modules, workspaces, and real-world patterns for AWS and Azure.",                     duration: "2h 04m", course: "Infrastructure as Code",      course_accent: "#7b2fff", icon_key: "terraform",  level: "Intermediate", sort_order: 5 },
  { id: 6,  youtube_id: "PGyhBwLyK2U", video_url: null, title: "CI/CD Pipeline with Jenkins",            description: "Build real delivery pipelines with Jenkins — freestyle jobs, declarative pipelines, shared libraries, Docker integration, and deploying to Kubernetes.",                duration: "53m",    course: "CI/CD Pipelines",             course_accent: "#ff9f43", icon_key: "cicd",       level: "Intermediate", sort_order: 6 },
  { id: 7,  youtube_id: "QXevQTGSIGg", video_url: null, title: "Prometheus & Grafana Monitoring",         description: "Set up full observability with Prometheus scraping, PromQL queries, alert rules, and Grafana dashboards. Exactly what production SRE teams use.",                        duration: "1h 28m", course: "Monitoring & Logging",         course_accent: "#00ff88", icon_key: "grafana",    level: "Intermediate", sort_order: 7 },
  { id: 8,  youtube_id: "MeU5_k9ssrs", video_url: null, title: "ArgoCD & GitOps for Kubernetes",          description: "Use Git as the single source of truth for your Kubernetes clusters. Covers ArgoCD setup, app of apps pattern, sync waves, and automated rollouts.",                     duration: "1h 10m", course: "GitOps & Infra Automation",   course_accent: "#f97316", icon_key: "gitops",     level: "Advanced",     sort_order: 8 },
];

const LEVEL_COLOR: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#00ff8818", color: "#00ff88" },
  Intermediate: { bg: "#ffaa0018", color: "#ffaa00" },
  Advanced:     { bg: "#ff606018", color: "#ff6060" },
};

const ALL_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type LevelFilter = (typeof ALL_LEVELS)[number];

function videoSrc(v: PublicVideo): string {
  if (v.youtube_id) return `https://www.youtube.com/embed/${v.youtube_id}?rel=0&modestbranding=1`;
  return v.video_url ?? "";
}

export default function VideosClient({ dbVideos }: { dbVideos: PublicVideo[] }): React.JSX.Element {
  const videos = dbVideos.length > 0 ? dbVideos : SAMPLE_VIDEOS;

  const [activeVideo, setActiveVideo] = useState<PublicVideo>(videos[0]!);
  const [filter,      setFilter]      = useState<LevelFilter>("All");

  const filtered = filter === "All" ? videos : videos.filter((v) => v.level === filter);

  // If active video got filtered out, reset to first in filtered list
  const active = filtered.find((v) => v.id === activeVideo.id) ?? filtered[0] ?? videos[0]!;

  return (
    <section style={{ padding: "80px 40px 100px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 24, height: 1, background: "var(--accent)" }} />
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>
            Free lessons
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 38, color: "var(--text)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              Watch. Learn. Ship.
            </h1>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", margin: 0, maxWidth: 520, lineHeight: 1.7 }}>
              Free video lessons from the DevOpsGuru curriculum. No sign-up required — just press play and start learning production-grade DevOps.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {ALL_LEVELS.map((l) => {
              const isActive = filter === l;
              const c = l === "All" ? { bg: "#ffffff12", color: "var(--text-dim)" } : LEVEL_COLOR[l]!;
              return (
                <button
                  key={l}
                  onClick={() => setFilter(l)}
                  style={{
                    fontFamily: "Space Mono, monospace", fontSize: 9, letterSpacing: "0.06em",
                    background: isActive ? c.bg : "transparent",
                    color: isActive ? c.color : "var(--text-dim)",
                    border: isActive ? `1px solid ${c.color}44` : "1px solid var(--border)",
                    padding: "6px 14px", borderRadius: 99, cursor: "pointer",
                    transition: "all 0.15s", textTransform: "uppercase",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

        {/* Player */}
        <div>
          <div style={{
            position: "relative", width: "100%", paddingTop: "56.25%",
            borderRadius: 10, overflow: "hidden",
            border: `1px solid ${active.course_accent}44`,
            background: "var(--bg-2)",
            boxShadow: `0 0 40px ${active.course_accent}18`,
          }}>
            <iframe
              key={active.id}
              src={videoSrc(active)}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>

          {/* Meta */}
          <div style={{ marginTop: 20, padding: "20px 24px", background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, flexShrink: 0 }}>
                <ModuleIcon name={active.icon_key} />
              </div>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: active.course_accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {active.course ?? "DevOpsGuru"}
              </span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: LEVEL_COLOR[active.level]?.bg, color: LEVEL_COLOR[active.level]?.color, padding: "2px 8px", borderRadius: 99, marginLeft: 4 }}>
                {active.level}
              </span>
              {active.duration && (
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", marginLeft: "auto" }}>
                  {active.duration}
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              {active.title}
            </h2>
            {active.description && (
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.75, margin: 0 }}>
                {active.description}
              </p>
            )}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
              <Link href="/enroll" style={{ background: "var(--accent)", color: "#050810", padding: "10px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
                Enroll for full access
              </Link>
              <Link href="/#courses" style={{ background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)", padding: "10px 24px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, textDecoration: "none", display: "inline-block" }}>
                View curriculum
              </Link>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 4, paddingLeft: 2 }}>
            {filtered.length} {filtered.length === 1 ? "lesson" : "lessons"}
          </div>

          {filtered.map((v, i) => {
            const isActive = v.id === active.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVideo(v)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: isActive ? `color-mix(in srgb, ${v.course_accent} 8%, var(--card-dark))` : "var(--card-dark)",
                  border: isActive ? `1px solid ${v.course_accent}55` : "1px solid var(--border)",
                  borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.15s", width: "100%",
                }}
              >
                <div style={{
                  width: 72, height: 42, flexShrink: 0,
                  background: v.youtube_id
                    ? `url(https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg) center/cover`
                    : `radial-gradient(circle at center, ${v.course_accent}14 0%, var(--bg-2) 70%)`,
                  border: `1px solid ${v.course_accent}22`,
                  borderRadius: 5, overflow: "hidden", position: "relative",
                }}>
                  {!v.youtube_id && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 20, height: 20 }}><ModuleIcon name={v.icon_key} /></div>
                    </div>
                  )}
                  {isActive && (
                    <div style={{ position: "absolute", inset: 0, background: `color-mix(in srgb, ${v.course_accent} 30%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${v.course_accent}` }} />
                    </div>
                  )}
                  {v.duration && (
                    <div style={{ position: "absolute", bottom: 2, right: 3, fontFamily: "Space Mono, monospace", fontSize: 7, color: "var(--text-dim)", background: "rgba(5,8,16,0.8)", padding: "1px 3px", borderRadius: 2 }}>
                      {v.duration}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 8, color: v.course_accent, letterSpacing: "0.04em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: 7, background: LEVEL_COLOR[v.level]?.bg, color: LEVEL_COLOR[v.level]?.color, padding: "1px 5px", borderRadius: 99 }}>
                      {v.level}
                    </span>
                  </div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 12, color: isActive ? "var(--text)" : "var(--text-dim)", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {v.title}
                  </div>
                </div>
              </button>
            );
          })}

          <div style={{ marginTop: 8, padding: "18px 16px", background: "color-mix(in srgb, var(--accent) 6%, var(--card-dark))", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: 8 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>Want the full course?</div>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.65, margin: "0 0 14px" }}>
              Enroll to unlock all lessons, live sessions, homework, and your certificate.
            </p>
            <a href="/enroll" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#050810", padding: 10, borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, textDecoration: "none" }}>
              Apply to enroll →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
