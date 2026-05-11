"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    section: "Main",
    items: [
      { id: "dashboard",    label: "Dashboard",    icon: "▣", href: "/dashboard" },
      { id: "courses",      label: "My courses",   icon: "◈", href: "/courses" },
      { id: "recordings",   label: "Recordings",   icon: "▷", href: "/recordings" },
    ],
  },
  {
    section: "Learning",
    items: [
      { id: "homework",     label: "Homework",     icon: "✓", href: "/homework",     badge: "2", badgeColor: "#ff6060" },
      { id: "sessions",     label: "Sessions",     icon: "◷", href: "/sessions" },
      { id: "messages",     label: "Messages",     icon: "▤", href: "/messages/1",   badge: "1", badgeColor: "#00d4ff" },
      { id: "certificates", label: "Certificates", icon: "◆", href: "/certificates" },
    ],
  },
];

export default function PortalSidebar(): React.JSX.Element {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href.split("/messages")[0] === href ? href : href.split("/")[1] ? `/${href.split("/")[1]}` : href);
  }

  return (
    <aside style={{
      width: 228, background: "var(--bg-2)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", flexShrink: 0,
      height: "100vh", position: "sticky", top: 0,
    }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.02em" }}>
            DevOps<span style={{ color: "var(--accent)" }}>Guru</span>
          </span>
        </Link>
        <span style={{ display: "block", marginTop: 3, fontFamily: "Space Mono, monospace", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          // devopsguru.am
        </span>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "color-mix(in srgb, var(--accent) 15%, transparent)",
          border: "1px solid color-mix(in srgb, var(--accent) 44%, transparent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--accent)", fontWeight: 700, flexShrink: 0,
        }}>
          AH
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Aram Hakobyan</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-dim)", textTransform: "uppercase" }}>3 modules active</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: "10px 10px 0", overflowY: "auto" }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 4 }}>
            <div style={{
              fontFamily: "Space Mono, monospace", fontSize: 9, letterSpacing: "0.12em",
              color: "#2a3450", textTransform: "uppercase", padding: "8px 8px 4px",
            }}>
              {section}
            </div>
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 10px", borderRadius: 6, cursor: "pointer",
                    background: active ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-dim)",
                    fontSize: 12, marginBottom: 2, textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: `color-mix(in srgb, ${item.badgeColor} 22%, transparent)`,
                      color: item.badgeColor,
                      fontFamily: "Space Mono, monospace", fontSize: 9,
                      padding: "2px 7px", borderRadius: 99,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", cursor: "pointer", color: "#3a4460", fontSize: 12 }}>
          <span>←</span> Sign out
        </div>
      </div>
    </aside>
  );
}
