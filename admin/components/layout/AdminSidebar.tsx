"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem { id: string; label: string; icon: string; href: string; badge?: string }
interface NavSection { section: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { id: "dashboard",    label: "Dashboard",   icon: "▣", href: "/dashboard" },
      { id: "students",     label: "Students",    icon: "◈", href: "/dashboard/students" },
      { id: "messages",     label: "Messages",    icon: "▤", href: "/dashboard/messages", badge: "3" },
    ],
  },
  {
    section: "Content",
    items: [
      { id: "courses",      label: "Courses",     icon: "◆", href: "/dashboard/courses" },
      { id: "recordings",   label: "Recordings",  icon: "▷", href: "/dashboard/recordings" },
      { id: "settings",     label: "Settings",    icon: "⚙", href: "/dashboard/settings" },
    ],
  },
  {
    section: "Learning",
    items: [
      { id: "homework",     label: "Homework",    icon: "✓", href: "/dashboard/homework" },
      { id: "sessions",     label: "Sessions",    icon: "◷", href: "/dashboard/sessions" },
      { id: "invite-codes", label: "Invite codes",icon: "⊞", href: "/dashboard/invite-codes" },
    ],
  },
];

export default function AdminSidebar(): React.JSX.Element {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside style={{
      width: 220, background: "var(--bg-2)",
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
        <span style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: 9, color: "var(--danger)", marginTop: 3, letterSpacing: "0.08em" }}>
          // ADMIN PANEL
        </span>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "color-mix(in srgb, var(--danger) 18%, transparent)",
          border: "1px solid color-mix(in srgb, var(--danger) 44%, transparent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--danger)", fontWeight: 700, flexShrink: 0,
        }}>SG</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "Syne, sans-serif" }}>Sarmen Gharibian</div>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 8, color: "var(--danger)", letterSpacing: "0.08em" }}>Administrator</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: "10px 10px 0", overflowY: "auto" }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, letterSpacing: "0.12em", color: "#2a3450", textTransform: "uppercase", padding: "8px 8px 4px" }}>
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
                    background: active ? "color-mix(in srgb, var(--danger) 12%, transparent)" : "transparent",
                    color: active ? "var(--danger)" : "var(--text-dim)",
                    fontSize: 12, marginBottom: 2, textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: "color-mix(in srgb, var(--danger) 22%, transparent)", color: "var(--danger)", fontFamily: "Space Mono, monospace", fontSize: 9, padding: "2px 7px", borderRadius: 99 }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", cursor: "pointer", color: "#3a4460", fontSize: 12, fontFamily: "Syne, sans-serif" }}>
          <span>←</span> Sign out
        </div>
      </div>
    </aside>
  );
}
