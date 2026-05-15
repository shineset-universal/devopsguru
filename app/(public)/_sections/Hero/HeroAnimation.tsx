"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Line { text: string; color: string }

const SEQUENCES: Array<{ prompt: string; cmd: string; lines: Line[]; accent: string }> = [
  {
    prompt: "sarmen@k8s-prod:~$",
    cmd: "kubectl get pods -n production",
    lines: [
      { text: "NAME                   READY   STATUS",   color: "#7a8aaa" },
      { text: "api-deploy-7f9d-xk9p  1/1     Running",  color: "#00ff88" },
      { text: "web-deploy-4a2b-m3r7  1/1     Running",  color: "#00ff88" },
      { text: "redis-cache-8n2q1-p4  1/1     Running",  color: "#00ff88" },
    ],
    accent: "#326ce5",
  },
  {
    prompt: "sarmen@ci-runner:~$",
    cmd: "docker build -t app:v2.1.0 .",
    lines: [
      { text: "[1/4] FROM node:20-alpine",             color: "#7a8aaa" },
      { text: "[3/4] RUN npm ci --production",         color: "#ffaa00" },
      { text: "[4/4] COPY --chown=node . .",           color: "#ffaa00" },
      { text: "Successfully built a3f9c2d1e4b8",       color: "#00ff88" },
    ],
    accent: "#2496ed",
  },
  {
    prompt: "sarmen@infra:~$",
    cmd: "terraform apply -auto-approve",
    lines: [
      { text: "aws_vpc.main: Creating...",             color: "#9b5fff" },
      { text: "aws_instance.app: Creating...",         color: "#9b5fff" },
      { text: "aws_alb.main: Creating...",             color: "#9b5fff" },
      { text: "Apply complete! 3 added, 0 destroyed.", color: "#00ff88" },
    ],
    accent: "#7b2fff",
  },
  {
    prompt: "sarmen@gitops:~$",
    cmd: "argocd app sync devops-production",
    lines: [
      { text: "Syncing to HEAD (a3f9c2d)...",          color: "#f97316" },
      { text: "Deployment/api  Synced",                color: "#00ff88" },
      { text: "Sync Status:    Synced",                color: "#00ff88" },
      { text: "Health:         Healthy ✓",             color: "#00ff88" },
    ],
    accent: "#f97316",
  },
];

export default function HeroAnimation(): React.JSX.Element {
  const [idx, setIdx]               = useState(0);
  const [typed, setTyped]           = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seq = SEQUENCES[idx]!;

  function clear(): void {
    if (timer.current) clearTimeout(timer.current);
  }

  useEffect(() => {
    setTyped(0);
    setShowOutput(false);
    setVisibleLines(0);
  }, [idx]);

  useEffect(() => {
    clear();
    if (typed < seq.cmd.length) {
      timer.current = setTimeout(() => setTyped((t) => t + 1), 42);
    } else {
      timer.current = setTimeout(() => setShowOutput(true), 300);
    }
    return clear;
  }, [typed, seq.cmd.length]);

  useEffect(() => {
    if (!showOutput) return;
    clear();
    if (visibleLines < seq.lines.length) {
      timer.current = setTimeout(() => setVisibleLines((l) => l + 1), 200);
    } else {
      timer.current = setTimeout(
        () => setIdx((i) => (i + 1) % SEQUENCES.length),
        2600
      );
    }
    return clear;
  }, [showOutput, visibleLines, seq.lines.length]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: -40,
        background: `radial-gradient(circle at 50% 50%, ${seq.accent}18 0%, transparent 70%)`,
        transition: "background 1s",
        pointerEvents: "none",
      }}/>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          style={{
            background: "#070c18",
            border: `1px solid ${seq.accent}44`,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: `0 0 40px ${seq.accent}18`,
            position: "relative",
          }}
        >
          {/* top accent line */}
          <div style={{ height: 2, background: `linear-gradient(90deg, ${seq.accent}, transparent)` }}/>

          {/* title bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #1a2340", background: "#080e1c" }}>
            <div style={{ display: "flex", gap: 7 }}>
              {["#ff6060", "#ffaa00", "#00ff88"].map((c) => (
                <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.7 }}/>
              ))}
            </div>
            <span style={{ flex: 1, textAlign: "center", fontFamily: "Space Mono, monospace", fontSize: 11, color: "#2a3450", letterSpacing: "0.08em" }}>
              bash — devopsguru
            </span>
          </div>

          {/* terminal body */}
          <div style={{ padding: "22px 26px 26px", minHeight: 260 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 13, color: seq.accent, flexShrink: 0 }}>
                {seq.prompt}
              </span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: 13, color: "#e8edf8", wordBreak: "break-all" }}>
                {seq.cmd.slice(0, typed)}
                <span style={{ borderRight: `2px solid ${seq.accent}`, marginLeft: 1, animation: "blink 1s step-end infinite" }}>&nbsp;</span>
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {seq.lines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={`${idx}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: 12, color: line.color, lineHeight: 1.8 }}>
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* status bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", background: `${seq.accent}12`, borderTop: `1px solid ${seq.accent}22` }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: seq.accent, letterSpacing: "0.08em" }}>
              ● LIVE
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["k8s", "docker", "tf", "argocd"].map((t, i) => (
                <span key={t} style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: i === idx ? seq.accent : "#2a3450", transition: "color 0.4s" }}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
