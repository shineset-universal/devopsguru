const IMAGE_ICONS: Record<string, string> = {
  linux:      "/icons/linux.png",
  git:        "/icons/git.svg",
  cicd:       "/icons/cicd.png",
  terraform:  "/icons/ansible.png",
  docker:     "/icons/docker.png",
  kubernetes: "/icons/kubernetes.png",
  gitops:     "/icons/argocd.png",
};

function IconGrafana() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#0a1a0a"/>
      <rect x="6" y="10" width="36" height="25" rx="3" fill="#111d11" stroke="#00ff88" strokeWidth="1"/>
      <polyline points="9,30 14,22 19,26 25,15 31,20 39,11" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="25" cy="15" r="2.5" fill="#00ff88"/>
      <rect x="14" y="38" width="20" height="3" rx="1.5" fill="#00ff88" opacity="0.3"/>
    </svg>
  );
}

function IconCapstone() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#050d1a"/>
      <polygon points="24,6 28,18 41,18 31,26 35,38 24,30 13,38 17,26 7,18 20,18" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinejoin="round"/>
      <polygon points="24,10 27,19 37,19 29,25 32,35 24,29 16,35 19,25 11,19 21,19" fill="#00d4ff" opacity="0.12"/>
    </svg>
  );
}

export default function ModuleIcon({ name }: { name: string }) {
  const src = IMAGE_ICONS[name];
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    );
  }
  if (name === "grafana") return <IconGrafana />;
  return <IconCapstone />;
}
