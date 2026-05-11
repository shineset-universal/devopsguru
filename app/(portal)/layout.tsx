import PortalSidebar from "@/components/layout/PortalSidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <PortalSidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
