"use client";

import { useState, useEffect, useRef } from "react";

interface PublicVideo {
  id: number;
  title: string;
  description: string | null;
  youtube_id: string | null;
  video_url: string | null;
  duration: string | null;
  course: string | null;
  course_accent: string;
  icon_key: string;
  level: string;
  sort_order: number;
  published: boolean;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  duration?: number;
}

const LEVELS   = ["Beginner", "Intermediate", "Advanced"] as const;
const COURSES  = ["Linux Basics", "Version Control with Git", "CI/CD Pipelines", "Infrastructure as Code", "Containerization with Docker", "Kubernetes Orchestration", "Monitoring & Logging", "GitOps & Infra Automation", "Real-World DevOps Project"];
const ICONS    = ["linux", "git", "cicd", "terraform", "docker", "kubernetes", "grafana", "gitops", "capstone"];
const ACCENTS  = ["#00d4ff", "#f05033", "#ff9f43", "#7b2fff", "#2496ed", "#326ce5", "#00ff88", "#f97316"];

const LEVEL_COLOR: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#00ff8818", color: "#00ff88" },
  Intermediate: { bg: "#ffaa0018", color: "#ffaa00" },
  Advanced:     { bg: "#ff606018", color: "#ff6060" },
};

const EMPTY_FORM = {
  title: "", description: "", youtube_id: "", video_url: "",
  duration: "", course: "", course_accent: "#00d4ff", icon_key: "linux",
  level: "Beginner" as (typeof LEVELS)[number], sort_order: 0, published: false,
};

type FormData = typeof EMPTY_FORM;

export default function AdminVideosPage(): React.JSX.Element {
  const [videos,    setVideos]    = useState<PublicVideo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<PublicVideo | null>(null);
  const [form,      setForm]      = useState<FormData>(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [uploadTab, setUploadTab] = useState<"youtube" | "cloudinary">("youtube");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { void fetchVideos(); }, []);

  async function fetchVideos(): Promise<void> {
    setLoading(true);
    try {
      const res  = await fetch("/api/videos");
      const data = await res.json() as { videos: PublicVideo[] };
      setVideos(data.videos ?? []);
    } finally {
      setLoading(false);
    }
  }

  function openAdd(): void {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setUploadTab("youtube");
    setShowModal(true);
  }

  function openEdit(v: PublicVideo): void {
    setEditing(v);
    setForm({
      title:         v.title,
      description:   v.description ?? "",
      youtube_id:    v.youtube_id  ?? "",
      video_url:     v.video_url   ?? "",
      duration:      v.duration    ?? "",
      course:        v.course      ?? "",
      course_accent: v.course_accent,
      icon_key:      v.icon_key,
      level:         v.level as (typeof LEVELS)[number],
      sort_order:    v.sort_order,
      published:     v.published,
    });
    setUploadTab(v.youtube_id ? "youtube" : "cloudinary");
    setError("");
    setShowModal(true);
  }

  async function handleCloudinaryUpload(file: File): Promise<void> {
    setUploading(true);
    setUploadProgress(0);
    try {
      const paramsRes  = await fetch("/api/videos/upload-params");
      const paramsData = await paramsRes.json() as { cloudName?: string; uploadPreset?: string; error?: string };
      if (!paramsRes.ok || !paramsData.cloudName) {
        setError(paramsData.error ?? "Cloudinary is not configured");
        return;
      }

      const fd = new FormData();
      fd.append("file",           file);
      fd.append("upload_preset",  paramsData.uploadPreset ?? "");
      fd.append("resource_type",  "video");

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };

      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${paramsData.cloudName}/video/upload`);
        xhr.send(fd);
      });

      setForm((f) => ({
        ...f,
        video_url:  uploadResult.secure_url,
        youtube_id: "",
        duration:   uploadResult.duration ? `${Math.ceil(uploadResult.duration / 60)}m` : f.duration,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function save(): Promise<void> {
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.youtube_id.trim() && !form.video_url.trim()) {
      setError("Provide a YouTube ID/URL or upload a video file");
      return;
    }
    setError(""); setSaving(true);

    const youtubeId = extractYoutubeId(form.youtube_id) ?? (form.youtube_id || null);
    const body = {
      ...form,
      youtube_id:  youtubeId  || null,
      video_url:   form.video_url  || null,
      description: form.description || null,
      duration:    form.duration    || null,
      course:      form.course      || null,
    };

    try {
      const url    = editing ? `/api/videos/${editing.id}` : "/api/videos";
      const method = editing ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data   = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Save failed"); return; }
      setShowModal(false);
      await fetchVideos();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(v: PublicVideo): Promise<void> {
    await fetch(`/api/videos/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !v.published }),
    });
    await fetchVideos();
  }

  async function deleteVideo(v: PublicVideo): Promise<void> {
    if (!confirm(`Delete "${v.title}"?`)) return;
    await fetch(`/api/videos/${v.id}`, { method: "DELETE" });
    await fetchVideos();
  }

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Public Videos</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)" }}>
            {videos.length} videos · {videos.filter((v) => v.published).length} published — shown on /videos page
          </span>
        </div>
        <button
          onClick={openAdd}
          style={{ background: "var(--accent)", border: "none", color: "#050810", padding: "9px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
        >
          + Add video
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--text-dim)", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : videos.length === 0 ? (
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, color: "var(--text-dim)", padding: "60px 0", textAlign: "center" }}>
          No videos yet. Click <strong>+ Add video</strong> to add your first one.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {videos.map((v) => (
            <div key={v.id} style={{ background: "var(--card-dark)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
              {/* Thumbnail preview */}
              <div style={{
                width: 80, height: 45, flexShrink: 0, borderRadius: 6, overflow: "hidden",
                background: `color-mix(in srgb, ${v.course_accent} 10%, var(--bg-2))`,
                border: `1px solid ${v.course_accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: v.course_accent,
              }}>
                {v.youtube_id
                  ? <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "▷"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{v.title}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {v.course  && <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: v.course_accent }}>{v.course}</span>}
                  {v.level   && <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: LEVEL_COLOR[v.level]?.bg, color: LEVEL_COLOR[v.level]?.color, padding: "1px 6px", borderRadius: 99 }}>{v.level}</span>}
                  {v.duration && <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>{v.duration}</span>}
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)" }}>
                    {v.youtube_id ? `YT: ${v.youtube_id}` : "Cloudinary"}
                  </span>
                </div>
              </div>

              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, background: v.published ? "#00ff8818" : "var(--bg-3)", color: v.published ? "#00ff88" : "var(--text-dim)", padding: "3px 10px", borderRadius: 99 }}>
                {v.published ? "Published" : "Draft"}
              </span>

              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => togglePublish(v)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "5px 10px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 9, cursor: "pointer" }}>
                  {v.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => openEdit(v)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "5px 10px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 9, cursor: "pointer" }}>Edit</button>
                <button onClick={() => void deleteVideo(v)} style={{ background: "transparent", border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)", color: "var(--danger)", padding: "5px 10px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 9, cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(5,8,16,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
        >
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                {editing ? "Edit video" : "Add video"}
              </span>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "var(--text-dim)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title */}
              <Field label="Title *">
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Docker Tutorial for Beginners" style={inputStyle} />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="What students will learn…" style={{ ...inputStyle, resize: "vertical" }} />
              </Field>

              {/* Video source tabs */}
              <div>
                <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>Video source *</span>
                <div style={{ display: "flex", gap: 0, marginBottom: 12, background: "var(--bg-3)", borderRadius: 6, padding: 3 }}>
                  {(["youtube", "cloudinary"] as const).map((t) => (
                    <button key={t} onClick={() => setUploadTab(t)} style={{
                      flex: 1, padding: "7px", borderRadius: 4, border: "none",
                      background: uploadTab === t ? "var(--card-dark)" : "transparent",
                      color: uploadTab === t ? "var(--text)" : "var(--text-dim)",
                      fontFamily: "Space Mono, monospace", fontSize: 10, cursor: "pointer",
                    }}>
                      {t === "youtube" ? "YouTube URL" : "Upload file"}
                    </button>
                  ))}
                </div>

                {uploadTab === "youtube" ? (
                  <input
                    value={form.youtube_id}
                    onChange={(e) => setForm((f) => ({ ...f, youtube_id: e.target.value, video_url: "" }))}
                    placeholder="https://youtube.com/watch?v=… or video ID"
                    style={inputStyle}
                  />
                ) : (
                  <div>
                    {form.video_url ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-3)", border: "1px solid #00ff8844", borderRadius: 6 }}>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#00ff88" }}>✓ Uploaded</span>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--text-dim)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.video_url}</span>
                        <button onClick={() => setForm((f) => ({ ...f, video_url: "" }))} style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 12 }}>✕</button>
                      </div>
                    ) : uploading ? (
                      <div style={{ padding: "16px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6 }}>
                        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)", marginBottom: 8 }}>Uploading to Cloudinary… {uploadProgress}%</div>
                        <div style={{ height: 3, background: "var(--border)", borderRadius: 99 }}>
                          <div style={{ height: "100%", width: `${uploadProgress}%`, background: "var(--accent)", borderRadius: 99, transition: "width 0.2s" }} />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef.current?.click()}
                        style={{ padding: "24px", background: "var(--bg-3)", border: "2px dashed var(--border)", borderRadius: 6, textAlign: "center", cursor: "pointer" }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>▶</div>
                        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, color: "var(--text-dim)" }}>Click to select video file</div>
                        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#2a3450", marginTop: 4 }}>MP4, WebM, MOV — uploaded directly to Cloudinary</div>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleCloudinaryUpload(file);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Row: Course + Level */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Course">
                  <select value={form.course} onChange={(e) => {
                    const idx = COURSES.indexOf(e.target.value);
                    setForm((f) => ({
                      ...f,
                      course:        e.target.value,
                      course_accent: ACCENTS[idx] ?? f.course_accent,
                      icon_key:      ICONS[idx]   ?? f.icon_key,
                    }));
                  }} style={inputStyle}>
                    <option value="">— select —</option>
                    {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Level">
                  <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as (typeof LEVELS)[number] }))} style={inputStyle}>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row: Duration + Sort order */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Duration">
                  <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="1h 22m" style={inputStyle} />
                </Field>
                <Field label="Sort order">
                  <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} style={inputStyle} />
                </Field>
              </div>

              {/* Published toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                  style={{
                    width: 40, height: 22, borderRadius: 99, border: "none", cursor: "pointer",
                    background: form.published ? "var(--success)" : "var(--border)",
                    position: "relative", transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3, left: form.published ? 20 : 3,
                    width: 16, height: 16, borderRadius: "50%", background: "#050810",
                    transition: "left 0.2s",
                  }} />
                </button>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: form.published ? "var(--success)" : "var(--text-dim)" }}>
                  {form.published ? "Published — visible on /videos" : "Draft — hidden from public"}
                </span>
              </div>

              {error && <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--danger)" }}>✕ {error}</div>}

              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <button
                  onClick={() => void save()}
                  disabled={saving}
                  style={{ flex: 1, background: saving ? "color-mix(in srgb, var(--accent) 60%, transparent)" : "var(--accent)", border: "none", color: "#050810", padding: 11, borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
                >
                  {saving ? "Saving…" : editing ? "Save changes" : "Add video"}
                </button>
                <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", padding: "11px 18px", borderRadius: 6, fontFamily: "Space Mono, monospace", fontSize: 11, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 7 }}>{label}</span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)",
  borderRadius: 6, padding: "9px 12px", fontFamily: "Syne, sans-serif", fontSize: 13,
  color: "var(--text)", outline: "none", boxSizing: "border-box",
};

function extractYoutubeId(input: string): string | null {
  if (!input) return null;
  // Already just an ID (no slashes or dots)
  if (/^[A-Za-z0-9_-]{11}$/.test(input.trim())) return input.trim();
  // URL patterns
  const match = input.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}
