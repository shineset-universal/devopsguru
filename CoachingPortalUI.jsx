import { useState } from "react";

const T = {
  bg:"#050810", bg2:"#080d1a", bg3:"#0c1225", card:"#0f1520",
  border:"#1a2340", accent:"#00d4ff", accent2:"#0057ff", accent3:"#7b2fff",
  text:"#e8edf8", dim:"#7a8aaa", success:"#00ff88", warn:"#ffaa00", danger:"#ff6060",
};

const LEVEL_COLOR = {
  Beginner:     { bg:"#00ff8818", color:"#00ff88" },
  Intermediate: { bg:"#ffaa0018", color:"#ffaa00" },
  Advanced:     { bg:"#ff606018", color:"#ff6060" },
  Capstone:     { bg:"#00d4ff18", color:"#00d4ff" },
};

const ICON_KEYS = ["linux","git","cicd","terraform","docker","kubernetes","grafana","gitops","capstone"];

// Icons as FUNCTIONS — never as module-level JSX objects
function IconLinux() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <circle cx="24" cy="24" r="22" fill="#0d1117" stroke="#00d4ff" strokeWidth="1.2"/>
      <ellipse cx="24" cy="17" rx="8" ry="10" fill="#f5c842"/>
      <circle cx="20.5" cy="15" r="2" fill="#0d1117"/>
      <circle cx="27.5" cy="15" r="2" fill="#0d1117"/>
      <path d="M20 20 Q24 23 28 20" stroke="#0d1117" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 27 Q12 35 15 39 Q17 41 20 40 L24 33 L28 40 Q31 41 33 39 Q36 35 32 27 L28 23 Q24 21 20 23Z" fill="#f5c842"/>
      <path d="M16 33 L13 39 M32 33 L35 39" stroke="#d4a020" strokeWidth="1.5"/>
    </svg>
  );
}
function IconGit() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#1a0a08"/>
      <path d="M44 22.6L25.4 4a2.7 2.7 0 00-3.8 0L17.8 7.8l4.8 4.8a3.2 3.2 0 014.1 4.1l4.6 4.6a3.2 3.2 0 11-1.9 1.9l-4.3-4.3v11.3a3.2 3.2 0 11-2.6-.1V18.4a3.2 3.2 0 01-1.7-4.2L16 9.4 4 21.4a2.7 2.7 0 000 3.8L22.6 44a2.7 2.7 0 003.8 0L44 26.4a2.7 2.7 0 000-3.8z" fill="#f05033"/>
    </svg>
  );
}
function IconCicd() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#0d1117"/>
      <circle cx="10" cy="24" r="4.5" fill="none" stroke="#ff9f43" strokeWidth="1.8"/>
      <circle cx="24" cy="12" r="4.5" fill="none" stroke="#ff9f43" strokeWidth="1.8"/>
      <circle cx="38" cy="24" r="4.5" fill="none" stroke="#ff9f43" strokeWidth="1.8"/>
      <circle cx="24" cy="36" r="4.5" fill="none" stroke="#ff9f43" strokeWidth="1.8"/>
      <line x1="14" y1="22" x2="20" y2="15" stroke="#ff9f43" strokeWidth="1.4"/>
      <line x1="28" y1="15" x2="34" y2="22" stroke="#ff9f43" strokeWidth="1.4"/>
      <line x1="34" y1="26" x2="28" y2="33" stroke="#ff9f43" strokeWidth="1.4"/>
      <line x1="14" y1="26" x2="20" y2="33" stroke="#ff9f43" strokeWidth="1.4"/>
      <circle cx="10" cy="24" r="2" fill="#ff9f43"/>
      <circle cx="24" cy="12" r="2" fill="#ff9f43"/>
      <circle cx="38" cy="24" r="2" fill="#ff9f43"/>
      <circle cx="24" cy="36" r="2" fill="#ff9f43"/>
    </svg>
  );
}
function IconTerraform() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#0d0a1a"/>
      <polygon points="17,8 8,13 8,23 17,18" fill="#7b2fff" opacity="0.9"/>
      <polygon points="17,8 17,18 26,23 26,13" fill="#9b5fff"/>
      <polygon points="8,25 8,35 17,40 17,30" fill="#7b2fff" opacity="0.7"/>
      <polygon points="27,13 27,23 36,18 36,8" fill="#9b5fff" opacity="0.8"/>
      <polygon points="19,28 19,38 28,33 28,23" fill="#7b2fff"/>
    </svg>
  );
}
function IconDocker() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#050d1a"/>
      <rect x="6" y="20" width="6" height="5" rx="1" fill="#2496ed"/>
      <rect x="13" y="20" width="6" height="5" rx="1" fill="#2496ed"/>
      <rect x="20" y="20" width="6" height="5" rx="1" fill="#2496ed"/>
      <rect x="13" y="14" width="6" height="5" rx="1" fill="#2496ed"/>
      <rect x="20" y="14" width="6" height="5" rx="1" fill="#2496ed"/>
      <rect x="20" y="8" width="6" height="5" rx="1" fill="#2496ed"/>
      <path d="M30 22c1-1 3-1 4 0 0 0 3-5 7 0 0 7-6 9-10 9H10c-4 0-6-3-5-6 1-2 5-3 5-3s-1-5 4-5c2 0 3 1 4 2" fill="#2496ed" opacity="0.65"/>
      <path d="M33 16c0-2 1-3 3-3" stroke="#2496ed" strokeWidth="1.5" fill="none"/>
      <circle cx="36" cy="12" r="1.5" fill="#2496ed"/>
    </svg>
  );
}
function IconKubernetes() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <circle cx="24" cy="24" r="23" fill="#050d1a"/>
      <circle cx="24" cy="24" r="17" fill="none" stroke="#326ce5" strokeWidth="1.4"/>
      <circle cx="24" cy="24" r="5" fill="#326ce5"/>
      <circle cx="24" cy="24" r="2.5" fill="#050d1a"/>
      <line x1="31" y1="24" x2="41" y2="24" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="41" cy="24" r="2.2" fill="#326ce5"/>
      <line x1="28.95" y1="28.95" x2="36.02" y2="36.02" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="36.02" cy="36.02" r="2.2" fill="#326ce5"/>
      <line x1="24" y1="31" x2="24" y2="41" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="24" cy="41" r="2.2" fill="#326ce5"/>
      <line x1="19.05" y1="28.95" x2="11.98" y2="36.02" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="11.98" cy="36.02" r="2.2" fill="#326ce5"/>
      <line x1="17" y1="24" x2="7" y2="24" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="7" cy="24" r="2.2" fill="#326ce5"/>
      <line x1="19.05" y1="19.05" x2="11.98" y2="11.98" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="11.98" cy="11.98" r="2.2" fill="#326ce5"/>
      <line x1="24" y1="17" x2="24" y2="7" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="24" cy="7" r="2.2" fill="#326ce5"/>
      <line x1="28.95" y1="19.05" x2="36.02" y2="11.98" stroke="#326ce5" strokeWidth="1.6"/>
      <circle cx="36.02" cy="11.98" r="2.2" fill="#326ce5"/>
    </svg>
  );
}
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
function IconGitops() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect width="48" height="48" rx="8" fill="#1a0d05"/>
      <circle cx="24" cy="10" r="5" fill="#f97316"/>
      <circle cx="10" cy="34" r="5" fill="#f97316"/>
      <circle cx="38" cy="34" r="5" fill="#f97316"/>
      <line x1="24" y1="15" x2="24" y2="24" stroke="#f97316" strokeWidth="2"/>
      <line x1="24" y1="24" x2="12" y2="30" stroke="#f97316" strokeWidth="2"/>
      <line x1="24" y1="24" x2="36" y2="30" stroke="#f97316" strokeWidth="2"/>
      <circle cx="24" cy="24" r="3" fill="#f97316"/>
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

function Icon({ name, ...props }) {
  const map = {
    linux: IconLinux, git: IconGit, cicd: IconCicd, terraform: IconTerraform,
    docker: IconDocker, kubernetes: IconKubernetes, grafana: IconGrafana,
    gitops: IconGitops, capstone: IconCapstone,
  };
  const C = map[name] || IconCapstone;
  return <C {...props} />;
}

// ── Course data ───────────────────────────────────────────────
const INIT_COURSES = [
  { id:1,  num:"01", iconKey:"linux",      title:"Linux Basics",                desc:"File system navigation, shell scripting, process management and system services — the foundation every DevOps engineer needs.", topics:["Linux command-line basics","File permissions & process management","Shell scripting","Package management","System services (systemd)"],                                                                   accent:"#00d4ff", level:"Beginner",     weeks:"2 weeks"  },
  { id:2,  num:"02", iconKey:"git",        title:"Version Control with Git",     desc:"Master branching strategies, Git workflows and team collaboration. From first commit to resolving complex merge conflicts.",        topics:["Git basics (init, clone, commit, push, pull)","Branching & merging strategies","GitHub / GitLab / Bitbucket","Git Flow & trunk-based development","Resolving merge conflicts"],                accent:"#f05033", level:"Beginner",     weeks:"2 weeks"  },
  { id:3,  num:"03", iconKey:"cicd",       title:"CI/CD Pipelines",              desc:"Build automated delivery pipelines with Jenkins, GitLab CI and Azure DevOps. Rolling, canary and blue-green deployments.",           topics:["Setting up CI/CD pipelines","Building and testing automatically","Rolling, canary & blue-green deployments","Continuous Testing & Monitoring","Jenkins, GitLab CI, CircleCI, Azure DevOps"],  accent:"#ff9f43", level:"Intermediate", weeks:"3 weeks"  },
  { id:4,  num:"04", iconKey:"terraform",  title:"Infrastructure as Code",       desc:"Provision cloud infrastructure with Terraform and manage configurations at scale using Ansible across AWS, Azure and GCP.",           topics:["IaC with Terraform","Provisioning VMs, networks & storage","Configuration management with Ansible","Automation with playbooks & roles","Managing cloud infra (AWS, Azure, GCP)"],           accent:"#7b2fff", level:"Intermediate", weeks:"3 weeks"  },
  { id:5,  num:"05", iconKey:"docker",     title:"Containerization with Docker", desc:"Build, ship and run containers in production. Docker images, networking, volumes and container security from scratch.",               topics:["Introduction to Docker","Building and managing Docker images","Running and linking containers","Networking and volumes in Docker","Container security best practices"],                         accent:"#2496ed", level:"Intermediate", weeks:"3 weeks"  },
  { id:6,  num:"06", iconKey:"kubernetes", title:"Kubernetes Orchestration",     desc:"Deploy and scale applications on Kubernetes. Pods, services, Ingress, Helm charts and real cluster management.",                    topics:["Kubernetes architecture","Deploying and scaling applications","Managing clusters and nodes","Services, Ingress & Load Balancing","Helm for managing K8s applications"],                             accent:"#326ce5", level:"Advanced",      weeks:"4 weeks"  },
  { id:7,  num:"07", iconKey:"grafana",    title:"Monitoring & Logging",         desc:"Full-stack observability with Prometheus, Grafana and the ELK stack. Custom metrics, alerts and centralized logging.",               topics:["Monitoring with Prometheus & Grafana","ELK stack (Elasticsearch, Logstash, Kibana)","Centralized logging with Fluentd / Filebeat","Alerts and notifications","Custom metrics and tracing"],       accent:"#00ff88", level:"Intermediate", weeks:"2 weeks"  },
  { id:8,  num:"08", iconKey:"gitops",     title:"GitOps & Infra Automation",    desc:"Git as the single source of truth. ArgoCD and FluxCD for automated Kubernetes delivery and infrastructure management.",               topics:["Introduction to GitOps","Kubernetes deployments with ArgoCD / FluxCD","Automating infrastructure changes via Git","Continuous delivery with GitOps workflows"],                                  accent:"#f97316", level:"Advanced",      weeks:"2 weeks"  },
  { id:9,  num:"09", iconKey:"capstone",   title:"Real-World DevOps Project",    desc:"A complete capstone: CI/CD pipeline, Kubernetes deployment, Terraform provisioning, monitoring and GitOps delivery.",                topics:["CI/CD pipeline from scratch","Microservices with Docker & Kubernetes","Terraform & Ansible infra provisioning","Monitoring & alerting setup","GitOps-based application delivery"],                accent:"#00d4ff", level:"Capstone",     weeks:"3 weeks", capstone:true },
];

const INIT_ABOUT = {
  name:"Sarmen Gharibian",
  title:"Senior DevOps Engineer · Founder, DevOpsGuru",
  linkedin:"https://www.linkedin.com/in/sarmen-gharibian90",
  bio:"I build and ship production-grade infrastructure every day — on-premise Kubernetes clusters, GitOps pipelines, Istio service meshes, and cloud infrastructure at Ameriabank, one of Armenia's leading banks. I teach exactly what I use in production.",
  experience:[
    { role:"Senior DevOps Engineer", company:"Ameriabank", period:"Oct 2023 — Present", stack:"K8s · Istio · ArgoCD · GitOps · Prometheus · Grafana · DataDog · ELK" },
    { role:"Senior DevOps Engineer", company:"digitAI",    period:"Dec 2022 — May 2024", stack:"AKS · Azure DevOps · ArgoCD · GitOps · Helm · Prometheus · Grafana"    },
    { role:"DevOps Engineer",        company:"IDT",        period:"Jun 2021 — Jul 2023", stack:"Kubernetes · ELK · Azure DevOps CI/CD · ArgoCD · Prometheus · Grafana"  },
  ],
  certs:["GitOps at Scale","Linux — Linux Academy"],
};

// ── Atoms ──────────────────────────────────────────────────────
function Logo({ size=16 }) {
  return (
    <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:size, color:T.text, letterSpacing:"-0.02em" }}>
      DevOps<span style={{ color:T.accent }}>Guru</span>
    </span>
  );
}
function Mono({ children, s={} }) {
  return <span style={{ fontFamily:"Space Mono,monospace", fontSize:10, letterSpacing:"0.1em", color:T.dim, textTransform:"uppercase", ...s }}>{children}</span>;
}
function LevelBadge({ level }) {
  const c = LEVEL_COLOR[level] || LEVEL_COLOR.Beginner;
  return <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, background:c.bg, color:c.color, padding:"3px 8px", borderRadius:99 }}>{level}</span>;
}
function PBar({ pct, color=T.accent }) {
  return (
    <div style={{ height:3, background:T.bg3, borderRadius:2 }}>
      <div style={{ height:"100%", width:pct+"%", background:color, borderRadius:2 }}/>
    </div>
  );
}
function Btn({ children, onClick, primary=false, small=false, danger=false, full=false, style:sx={} }) {
  return (
    <button onClick={onClick} style={{
      background: danger ? T.danger+"18" : primary ? T.accent : "transparent",
      border: danger ? "1px solid "+T.danger+"44" : primary ? "none" : "1px solid "+T.border,
      color: danger ? T.danger : primary ? "#050810" : T.dim,
      padding: small ? "6px 12px" : "11px 22px",
      borderRadius:6, fontFamily:"Space Mono,monospace",
      fontSize: small ? 10 : 11, fontWeight: primary ? 700 : 400,
      cursor:"pointer", width: full ? "100%" : "auto", ...sx,
    }}>{children}</button>
  );
}
function Inp({ value, onChange, placeholder, type="text", style:sx={} }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", background:T.bg3, border:"1px solid "+T.border, borderRadius:6, padding:"10px 13px", fontFamily:"Syne,sans-serif", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", ...sx }}
      onFocus={e => e.target.style.borderColor = T.accent}
      onBlur={e  => e.target.style.borderColor = T.border}
    />
  );
}
function Txa({ value, onChange, placeholder, rows=3 }) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ width:"100%", background:T.bg3, border:"1px solid "+T.border, borderRadius:6, padding:"10px 13px", fontFamily:"Syne,sans-serif", fontSize:13, color:T.text, outline:"none", boxSizing:"border-box", resize:"vertical" }}
      onFocus={e => e.target.style.borderColor = T.accent}
      onBlur={e  => e.target.style.borderColor = T.border}
    />
  );
}
function Fld({ label, children }) {
  return <div style={{ marginBottom:16 }}><Mono s={{ display:"block", marginBottom:7 }}>{label}</Mono>{children}</div>;
}
function Card({ children, style:sx={} }) {
  return <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:8, padding:"20px 22px", ...sx }}>{children}</div>;
}
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position:"fixed", top:24, right:24, background:T.success+"22", border:"1px solid "+T.success+"44", color:T.success, padding:"10px 18px", borderRadius:6, fontFamily:"Space Mono,monospace", fontSize:11, zIndex:9999 }}>
      {msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PUBLIC SITE
// ══════════════════════════════════════════════════════════════
function Navbar({ onLogin, onEnroll }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 40px", borderBottom:"1px solid "+T.border, background:T.bg+"ee" }}>
      <Logo size={20}/>
      <div style={{ display:"flex", alignItems:"center", gap:28 }}>
        {["Courses","About","How it works"].map(l => (
          <span key={l} style={{ fontFamily:"Space Mono,monospace", fontSize:11, letterSpacing:"0.06em", color:T.dim, textTransform:"uppercase", cursor:"pointer" }}>{l}</span>
        ))}
        <Btn onClick={onLogin}>Login</Btn>
        <Btn onClick={onEnroll} primary>Enroll now</Btn>
      </div>
    </nav>
  );
}

function Hero({ onEnroll, courses }) {
  const toolLabels = ["Linux","Git","CI/CD","Terraform","Docker","Kubernetes","Monitoring","GitOps"];
  const toolIcons  = ["linux","git","cicd","terraform","docker","kubernetes","grafana","gitops"];
  return (
    <section style={{ padding:"96px 40px 80px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-120, right:-80, width:560, height:560, background:"radial-gradient(circle,"+T.accent+"08 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient("+T.border+" 1px,transparent 1px)", backgroundSize:"32px 32px", opacity:0.3, pointerEvents:"none" }}/>
      <div style={{ position:"relative", maxWidth:680 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:24, height:1, background:T.accent }}/>
          <Mono s={{ color:T.accent }}>DevOps Coaching · Yerevan, Armenia</Mono>
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:56, lineHeight:1.02, letterSpacing:"-0.03em", color:T.text, margin:"0 0 48px" }}>
          From zero to<br/><span style={{ color:T.accent }}>production-ready</span><br/>DevOps engineer.
        </h1>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:44 }}>
          {toolLabels.map((label, i) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7, background:T.card, border:"1px solid "+T.border, borderRadius:6, padding:"8px 14px" }}>
              <div style={{ width:16, height:16, flexShrink:0 }}><Icon name={toolIcons[i]}/></div>
              <span style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:T.text, letterSpacing:"0.04em" }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onEnroll} style={{ background:T.accent, color:"#050810", border:"none", padding:"14px 32px", borderRadius:8, fontFamily:"Space Mono,monospace", fontSize:12, fontWeight:700, cursor:"pointer" }}>Apply now</button>
          <button style={{ background:"transparent", color:T.text, border:"1px solid "+T.border, padding:"14px 32px", borderRadius:8, fontFamily:"Space Mono,monospace", fontSize:12, cursor:"pointer" }}>View curriculum</button>
        </div>
      </div>
      <div style={{ display:"flex", marginTop:72, borderTop:"1px solid "+T.border, paddingTop:32, maxWidth:480 }}>
        {[["9","Modules"],["20+","Weeks"],["100%","Hands-on"],["7+","Yrs exp."]].map(([v,l],i) => (
          <div key={l} style={{ flex:1, paddingRight:24, borderRight:i<3?"1px solid "+T.border:"none", paddingLeft:i>0?24:0 }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:28, color:T.accent }}>{v}</div>
            <Mono>{l}</Mono>
          </div>
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(course)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:T.card, border:"1px solid "+(hov ? course.accent+"66" : T.border), borderRadius:8, overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column", transition:"all 0.2s", transform:hov?"translateY(-4px)":"none" }}
    >
      <div style={{ position:"relative", height:130, background:T.bg2, display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid "+T.border }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50%,"+course.accent+"10 0%,transparent 70%)" }}/>
        <div style={{ width:64, height:64, position:"relative", zIndex:1 }}><Icon name={course.iconKey}/></div>
        <div style={{ position:"absolute", top:10, left:12, fontFamily:"Space Mono,monospace", fontSize:10, fontWeight:700, color:course.accent, background:T.card+"cc", border:"1px solid "+course.accent+"33", padding:"2px 7px", borderRadius:4 }}>{course.num}</div>
        {course.capstone && <div style={{ position:"absolute", top:10, right:12, fontFamily:"Space Mono,monospace", fontSize:9, color:T.accent, background:T.accent+"20", border:"1px solid "+T.accent+"40", padding:"2px 8px", borderRadius:99 }}>CAPSTONE</div>}
      </div>
      <div style={{ padding:"16px 18px 18px", flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <LevelBadge level={course.level}/><Mono>{course.weeks}</Mono>
        </div>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color:T.text, marginBottom:6, lineHeight:1.3 }}>{course.title}</div>
        <p style={{ fontFamily:"Syne,sans-serif", fontSize:12, color:T.dim, lineHeight:1.7, margin:"0 0 12px", flex:1 }}>{course.desc}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {course.topics.slice(0,3).map(t => (
            <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:7 }}>
              <div style={{ width:3, height:3, borderRadius:"50%", background:course.accent, flexShrink:0, marginTop:5 }}/>
              <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:T.dim, lineHeight:1.5 }}>{t}</span>
            </div>
          ))}
          {course.topics.length > 3 && <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:course.accent, marginLeft:10 }}>+{course.topics.length-3} more</span>}
        </div>
        <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid "+T.border }}>
          <Mono s={{ color:course.accent }}>View details</Mono>
        </div>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose, onEnroll }) {
  if (!course) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(5,8,16,0.92)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:24 }}>
      <div style={{ background:T.bg2, border:"1px solid "+course.accent+"44", borderRadius:10, width:"100%", maxWidth:500, overflow:"hidden" }}>
        <div style={{ height:3, background:course.accent }}/>
        <div style={{ background:T.bg3, display:"flex", alignItems:"center", justifyContent:"center", height:110, borderBottom:"1px solid "+T.border, position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle,"+course.accent+"10 0%,transparent 65%)" }}/>
          <div style={{ width:60, height:60, position:"relative", zIndex:1 }}><Icon name={course.iconKey}/></div>
        </div>
        <div style={{ padding:"22px 26px 26px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:course.accent, fontWeight:700 }}>{course.num}</span>
            <LevelBadge level={course.level}/><Mono>{course.weeks}</Mono>
          </div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:22, color:T.text, margin:"0 0 8px" }}>{course.title}</h2>
          <p style={{ fontFamily:"Syne,sans-serif", fontSize:13, color:T.dim, lineHeight:1.75, margin:"0 0 18px" }}>{course.desc}</p>
          <Mono s={{ display:"block", marginBottom:10 }}>Topics covered</Mono>
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:22 }}>
            {course.topics.map((t, i) => (
              <div key={t} style={{ display:"flex", gap:12 }}>
                <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:course.accent, marginTop:2, flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:13, color:T.text }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onEnroll} style={{ flex:1, background:T.accent, border:"none", color:"#050810", padding:12, borderRadius:6, fontFamily:"Space Mono,monospace", fontSize:11, fontWeight:700, cursor:"pointer" }}>Apply to enroll</button>
            <button onClick={onClose} style={{ background:"transparent", border:"1px solid "+T.border, color:T.dim, padding:"12px 18px", borderRadius:6, fontFamily:"Space Mono,monospace", fontSize:11, cursor:"pointer" }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesSection({ onEnroll, courses }) {
  const [sel, setSel] = useState(null);
  return (
    <section style={{ padding:"80px 40px", borderTop:"1px solid "+T.border }}>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:24, height:1, background:T.accent }}/><Mono s={{ color:T.accent }}>Full curriculum</Mono>
          </div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:34, color:T.text, margin:0, letterSpacing:"-0.02em" }}>9 modules. One complete path.</h2>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["Beginner","Intermediate","Advanced"].map(l => {
            const c = LEVEL_COLOR[l];
            return <span key={l} style={{ fontFamily:"Space Mono,monospace", fontSize:9, background:c.bg, color:c.color, padding:"4px 10px", borderRadius:99 }}>{l}</span>;
          })}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {courses.map(c => <CourseCard key={c.id} course={c} onClick={setSel}/>)}
      </div>
      <CourseModal course={sel} onClose={() => setSel(null)} onEnroll={() => { setSel(null); onEnroll(); }}/>
    </section>
  );
}

function HowItWorks({ onEnroll }) {
  const steps = [
    { num:"01", title:"Apply",                desc:"Fill out the application form. I review every request personally and respond within 48 hours." },
    { num:"02", title:"Get your access code", desc:"Once accepted you receive a personal access code by email to register in your student portal." },
    { num:"03", title:"Start learning",       desc:"Attend live sessions, complete hands-on assignments, watch recordings and message me directly." },
    { num:"04", title:"Graduate",             desc:"Complete all 9 modules and the capstone project. Earn your certificate and ship real infrastructure." },
  ];
  return (
    <section style={{ padding:"80px 40px", borderTop:"1px solid "+T.border }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:24, height:1, background:T.accent }}/><Mono s={{ color:T.accent }}>Process</Mono>
      </div>
      <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:34, color:T.text, margin:"0 0 48px", letterSpacing:"-0.02em" }}>How it works</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ paddingRight:32, paddingLeft:i>0?32:0, borderLeft:i>0?"1px solid "+T.border:"none" }}>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:26, fontWeight:700, color:T.accent+"40", marginBottom:16 }}>{s.num}</div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:15, color:T.text, marginBottom:8 }}>{s.title}</div>
            <p style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, color:T.dim, lineHeight:1.75, margin:0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop:56, textAlign:"center" }}>
        <button onClick={onEnroll} style={{ background:T.accent, color:"#050810", border:"none", padding:"14px 36px", borderRadius:8, fontFamily:"Space Mono,monospace", fontSize:12, fontWeight:700, cursor:"pointer" }}>Apply now</button>
      </div>
    </section>
  );
}

function AboutSection({ about }) {
  const stackItems = ["Linux · Bash","Git · GitHub / GitLab","Jenkins · GitLab CI · Azure DevOps","Terraform · Ansible","Docker · Kubernetes · Istio","Prometheus · Grafana · DataDog · ELK","ArgoCD · FluxCD"];
  return (
    <section style={{ padding:"80px 40px", borderTop:"1px solid "+T.border }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:24, height:1, background:T.accent }}/><Mono s={{ color:T.accent }}>Instructor</Mono>
      </div>
      <div style={{ display:"flex", gap:56, alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:34, color:T.text, margin:"0 0 4px", letterSpacing:"-0.02em" }}>{about.name}</h2>
          <div style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:T.accent, marginBottom:22 }}>// {about.title}</div>
          <p style={{ fontFamily:"Syne,sans-serif", fontSize:14, color:T.dim, lineHeight:1.85, margin:"0 0 28px", maxWidth:500 }}>{about.bio}</p>
          <Mono s={{ display:"block", marginBottom:14 }}>Experience</Mono>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:26 }}>
            {about.experience.map(e => (
              <Card key={e.company}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:13, color:T.text }}>{e.role} — {e.company}</div>
                  <Mono s={{ fontSize:9 }}>{e.period}</Mono>
                </div>
                <div style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:T.dim }}>{e.stack}</div>
              </Card>
            ))}
          </div>
          <Mono s={{ display:"block", marginBottom:10 }}>Certifications</Mono>
          <div style={{ display:"flex", gap:10, marginBottom:28 }}>
            {about.certs.map(c => (
              <span key={c} style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:T.accent, background:T.accent+"12", border:"1px solid "+T.accent+"33", padding:"5px 12px", borderRadius:4 }}>{c}</span>
            ))}
          </div>
          <a href={about.linkedin} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0a66c2", color:"#fff", textDecoration:"none", padding:"9px 18px", borderRadius:6, fontFamily:"Space Mono,monospace", fontSize:11 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="white"/></svg>
            linkedin.com/in/sarmen-gharibian90
          </a>
        </div>
        <div style={{ width:240, flexShrink:0 }}>
          <Card>
            <Mono s={{ display:"block", marginBottom:12 }}>Stack I teach</Mono>
            {stackItems.map(t => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid "+T.border }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:T.accent, flexShrink:0 }}/>
                <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:T.text }}>{t}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-around", marginTop:16 }}>
              {[["7+","Years"],["500+","Connects"],["2","Certs"]].map(([v,l]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:T.accent }}>{v}</div>
                  <Mono s={{ fontSize:8 }}>{l}</Mono>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Footer({ onLogin, onEnroll }) {
  return (
    <footer style={{ borderTop:"1px solid "+T.border, padding:"32px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div><Logo size={15}/><Mono s={{ display:"block", marginTop:4 }}>// devopsguru.am · Yerevan, Armenia</Mono></div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn onClick={onLogin}>Login</Btn>
        <Btn onClick={onEnroll} primary>Enroll now</Btn>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════
function LoginPage({ onBack }) {
  const [mode, setMode]   = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [code, setCode]   = useState("");
  const [sent, setSent]   = useState(false);
  const [err, setErr]     = useState("");

  function submit() {
    if (mode === "enroll" && !name.trim()) { setErr("Please enter your full name."); return; }
    if (!email.includes("@"))             { setErr("Please enter a valid email.");   return; }
    if (mode === "enroll" && code.length < 4) { setErr("Please enter your access code."); return; }
    setErr(""); setSent(true);
  }

  return (
    <div style={{ minHeight:"100%", background:T.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"18px 40px", borderBottom:"1px solid "+T.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo size={16}/>
        <button onClick={onBack} style={{ background:"transparent", border:"none", color:T.dim, fontFamily:"Space Mono,monospace", fontSize:11, cursor:"pointer" }}>Back to site</button>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ background:T.bg2, border:"1px solid "+T.border, borderRadius:10, padding:40, width:380, position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,"+T.accent2+","+T.accent+","+T.accent3+")", borderRadius:"10px 10px 0 0" }}/>
          <div style={{ marginBottom:28 }}><Logo size={16}/><Mono s={{ display:"block", marginTop:4 }}>// devopsguru.am</Mono></div>
          {!sent ? (
            <>
              <div style={{ display:"flex", border:"1px solid "+T.border, borderRadius:6, marginBottom:24, overflow:"hidden" }}>
                {[["Login","login"],["Enroll","enroll"]].map(([l,m]) => (
                  <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex:1, padding:"9px", border:"none", cursor:"pointer", background:mode===m?T.accent+"18":"transparent", color:mode===m?T.accent:T.dim, fontFamily:"Space Mono,monospace", fontSize:11 }}>{l}</button>
                ))}
              </div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:21, color:T.text, marginBottom:4 }}>{mode==="login"?"Welcome back":"Get access"}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, color:T.dim, marginBottom:24 }}>{mode==="login"?"Enter your email. We will send you a magic link.":"Enter the access code you received by email."}</div>
              {mode==="enroll" && <Fld label="Full name"><Inp value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></Fld>}
              <Fld label="Email address"><Inp value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></Fld>
              {mode==="enroll" && <Fld label="Access code"><Inp value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="DEVOPS2026" style={{ letterSpacing:"0.12em" }}/></Fld>}
              {err && <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:T.danger, marginBottom:12 }}>x {err}</div>}
              <Btn onClick={submit} primary full>{mode==="login"?"Send magic link":"Create my account"}</Btn>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"12px 0" }}>
              <div style={{ fontSize:36, marginBottom:14 }}>✉️</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:T.text, marginBottom:8 }}>Check your inbox</div>
              <p style={{ fontFamily:"Syne,sans-serif", fontSize:13, color:T.dim, lineHeight:1.7 }}>
                Link sent to <span style={{ color:T.accent, fontFamily:"Space Mono,monospace", fontSize:11 }}>{email}</span>.<br/>
                {mode==="login"?"Expires in 15 minutes.":"Click to access your courses."}
              </p>
              <button onClick={() => { setSent(false); setEmail(""); setCode(""); setName(""); }} style={{ marginTop:20, background:"transparent", border:"1px solid "+T.border, color:T.dim, padding:"9px 20px", borderRadius:6, fontFamily:"Space Mono,monospace", fontSize:11, cursor:"pointer" }}>Try a different email</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STUDENT PORTAL
// ══════════════════════════════════════════════════════════════
const SNAV = [
  { section:"Main", items:[{ id:"dashboard",label:"Dashboard",icon:"▣" },{ id:"courses",label:"My courses",icon:"◈" },{ id:"recordings",label:"Recordings",icon:"▷" }] },
  { section:"Learning", items:[{ id:"homework",label:"Homework",icon:"✓",badge:"2",bc:T.danger },{ id:"sessions",label:"Sessions",icon:"◷" },{ id:"messages",label:"Messages",icon:"▤",badge:"1",bc:T.accent },{ id:"certificates",label:"Certificates",icon:"◆" }] },
];

function Portal({ courses }) {
  const [active, setActive] = useState("dashboard");
  const enrolled = courses.filter(c => [1,5,6].includes(c.id));
  const pcts  = [78, 45, 12];
  const lasts = ["File permissions & process management","Building and managing Docker images","Kubernetes architecture"];

  return (
    <div style={{ display:"flex", height:"100%", fontFamily:"Syne,sans-serif" }}>
      <aside style={{ width:228, background:T.bg2, borderRight:"1px solid "+T.border, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid "+T.border }}><Logo size={14}/><Mono s={{ display:"block", marginTop:3 }}>// devopsguru.am</Mono></div>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid "+T.border, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:T.accent+"18", border:"1px solid "+T.accent+"44", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Mono,monospace", fontSize:11, color:T.accent, fontWeight:700, flexShrink:0 }}>AH</div>
          <div><div style={{ fontSize:12, fontWeight:600, color:T.text }}>Aram Hakobyan</div><Mono>3 modules active</Mono></div>
        </div>
        <div style={{ flex:1, padding:"10px 10px 0", overflowY:"auto" }}>
          {SNAV.map(({ section, items }) => (
            <div key={section} style={{ marginBottom:4 }}>
              <div style={{ fontFamily:"Space Mono,monospace", fontSize:9, letterSpacing:"0.12em", color:"#2a3450", textTransform:"uppercase", padding:"8px 8px 4px" }}>{section}</div>
              {items.map(item => (
                <div key={item.id} onClick={() => setActive(item.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:6, cursor:"pointer", background:active===item.id?T.accent+"14":"transparent", color:active===item.id?T.accent:T.dim, fontSize:12, marginBottom:2 }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.badge && <span style={{ background:item.bc+"22", color:item.bc, fontFamily:"Space Mono,monospace", fontSize:9, padding:"2px 7px", borderRadius:99 }}>{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding:12, borderTop:"1px solid "+T.border }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", cursor:"pointer", color:"#3a4460", fontSize:12 }}><span>←</span> Sign out</div>
        </div>
      </aside>
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", background:T.bg }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid "+T.border, flexShrink:0 }}>
          <div><div style={{ fontWeight:700, fontSize:18, color:T.text }}>Dashboard</div><Mono>Good morning, Aram</Mono></div>
          <div style={{ display:"flex", gap:8 }}>
            {["Notify","Settings"].map(l => <button key={l} style={{ background:"transparent", border:"1px solid "+T.border, color:T.dim, padding:"6px 12px", borderRadius:6, cursor:"pointer", fontFamily:"Space Mono,monospace", fontSize:10 }}>{l}</button>)}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
            {[["Modules","3",T.accent,"enrolled"],["Progress","45%",T.text,"avg"],["Homework","2",T.warn,"pending"],["Certs","0",T.success,"earned"]].map(([l,v,c,s]) => (
              <div key={l} style={{ background:T.card, border:"1px solid "+T.border, borderRadius:4, padding:16 }}>
                <Mono s={{ display:"block", marginBottom:8 }}>{l}</Mono>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:24, color:c }}>{v}</div>
                <Mono s={{ marginTop:4 }}>{s}</Mono>
              </div>
            ))}
          </div>
          <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:12 }}>My modules</div>
          {enrolled.map((c, i) => (
            <div key={c.id} style={{ background:T.card, border:"1px solid "+T.border, borderRadius:4, padding:14, marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
              <div style={{ width:44, height:44, flexShrink:0, background:T.bg2, border:"1px solid "+T.border, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", padding:7 }}><Icon name={c.iconKey}/></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:c.accent }}>{c.num}</span>
                  <div style={{ fontWeight:600, fontSize:13, color:T.text }}>{c.title}</div>
                </div>
                <Mono s={{ display:"block", marginBottom:7 }}>Last: {lasts[i]}</Mono>
                <PBar pct={pcts[i]} color={c.accent}/>
              </div>
              <div style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:c.accent, fontWeight:700 }}>{pcts[i]}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════
const ADMIN_NAV = [
  { section:"Overview", items:[{ id:"dashboard",label:"Dashboard",icon:"▣" },{ id:"students",label:"Students",icon:"◈" },{ id:"messages",label:"Messages",icon:"▤",badge:"3" }] },
  { section:"Content",  items:[{ id:"modules",label:"Modules",icon:"◆" },{ id:"about",label:"About Me",icon:"◎" },{ id:"site",label:"Site Settings",icon:"⚙" }] },
  { section:"Learning", items:[{ id:"homework",label:"Homework",icon:"✓" },{ id:"sessions",label:"Sessions",icon:"◷" },{ id:"recordings",label:"Recordings",icon:"▷" }] },
];

function AdminSidebar({ active, setActive }) {
  return (
    <aside style={{ width:220, background:T.bg2, borderRight:"1px solid "+T.border, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid "+T.border }}>
        <Logo size={14}/>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:T.danger, marginTop:3, letterSpacing:"0.08em" }}>// ADMIN PANEL</div>
      </div>
      <div style={{ padding:"14px 16px", borderBottom:"1px solid "+T.border, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:T.danger+"18", border:"1px solid "+T.danger+"44", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Mono,monospace", fontSize:11, color:T.danger, fontWeight:700, flexShrink:0 }}>SG</div>
        <div><div style={{ fontSize:12, fontWeight:600, color:T.text }}>Sarmen Gharibian</div><Mono s={{ fontSize:8, color:T.danger }}>Administrator</Mono></div>
      </div>
      <div style={{ flex:1, padding:"10px 10px 0", overflowY:"auto" }}>
        {ADMIN_NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom:4 }}>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:9, letterSpacing:"0.12em", color:"#2a3450", textTransform:"uppercase", padding:"8px 8px 4px" }}>{section}</div>
            {items.map(item => (
              <div key={item.id} onClick={() => setActive(item.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:6, cursor:"pointer", background:active===item.id?T.danger+"12":"transparent", color:active===item.id?T.danger:T.dim, fontSize:12, marginBottom:2 }}>
                <span style={{ fontSize:13 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ background:T.danger+"22", color:T.danger, fontFamily:"Space Mono,monospace", fontSize:9, padding:"2px 7px", borderRadius:99 }}>{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:12, borderTop:"1px solid "+T.border }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", cursor:"pointer", color:"#3a4460", fontSize:12 }}><span>←</span> Sign out</div>
      </div>
    </aside>
  );
}

function AdminDashboard({ courses }) {
  const recentStudents = [
    ["Aram Hakobyan","Linux + Docker + K8s","Active","#00d4ff"],
    ["Ani Petrosyan","Linux + Git","Active","#00ff88"],
    ["Narek Vardanyan","CI/CD + Terraform","Pending","#ffaa00"],
  ];
  return (
    <div style={{ padding:28 }}>
      <div style={{ fontWeight:700, fontSize:20, color:T.text, marginBottom:4 }}>Overview</div>
      <Mono s={{ display:"block", marginBottom:24 }}>Welcome back, Sarmen</Mono>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:32 }}>
        {[["Total students","24",T.accent],["Active modules",String(courses.length),T.success],["Unread messages","3",T.danger],["Pending homework","7",T.warn]].map(([l,v,c]) => (
          <Card key={l}><Mono s={{ display:"block", marginBottom:10 }}>{l}</Mono><div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:28, color:c }}>{v}</div></Card>
        ))}
      </div>
      <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:14 }}>Recent students</div>
      <Card>
        {recentStudents.map(([name, mods, status, sc]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid "+T.border }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:sc+"22", border:"1px solid "+sc+"44", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Mono,monospace", fontSize:10, color:sc, fontWeight:700, flexShrink:0 }}>
              {name.split(" ").map(w => w[0]).join("")}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:600, color:T.text }}>{name}</div>
              <Mono>{mods}</Mono>
            </div>
            <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, background:sc+"18", color:sc, padding:"3px 10px", borderRadius:99 }}>{status}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminModules({ courses, setCourses }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({});
  const [topicsStr, setTopicsStr] = useState("");
  const [toast, setToast]     = useState("");

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function openEdit(c) {
    setEditing(c);
    setForm({ title:c.title, desc:c.desc, level:c.level, weeks:c.weeks, accent:c.accent, iconKey:c.iconKey });
    setTopicsStr(c.topics.join("\n"));
  }
  function openNew() {
    const newId  = Math.max(...courses.map(c => c.id)) + 1;
    const newNum = String(newId).padStart(2,"0");
    const draft  = { id:newId, num:newNum, capstone:false };
    setEditing(draft);
    setForm({ title:"", desc:"", level:"Beginner", weeks:"2 weeks", accent:"#00d4ff", iconKey:"linux" });
    setTopicsStr("");
  }
  function save() {
    if (!form.title.trim()) { showToast("Title is required"); return; }
    const updated = { ...editing, ...form, topics: topicsStr.split("\n").map(t => t.trim()).filter(Boolean) };
    if (courses.find(c => c.id === editing.id)) setCourses(courses.map(c => c.id === editing.id ? updated : c));
    else setCourses([...courses, updated]);
    setEditing(null);
    showToast("Saved successfully");
  }
  function del(id) { setCourses(courses.filter(c => c.id !== id)); showToast("Module deleted"); }

  const accentColors = ["#00d4ff","#f05033","#ff9f43","#7b2fff","#2496ed","#326ce5","#00ff88","#f97316"];

  return (
    <div style={{ padding:28, position:"relative" }}>
      <Toast msg={toast}/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div><div style={{ fontWeight:700, fontSize:20, color:T.text, marginBottom:2 }}>Modules</div><Mono>Manage course modules</Mono></div>
        <Btn onClick={openNew} primary small>+ Add module</Btn>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {courses.map(c => (
          <Card key={c.id} style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:44, height:44, flexShrink:0, background:T.bg2, border:"1px solid "+T.border, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", padding:6 }}><Icon name={c.iconKey}/></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontFamily:"Space Mono,monospace", fontSize:9, color:c.accent }}>{c.num}</span>
                <span style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:13, color:T.text }}>{c.title}</span>
                <LevelBadge level={c.level}/>
              </div>
              <Mono>{c.weeks} · {c.topics.length} topics</Mono>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn onClick={() => openEdit(c)} small>Edit</Btn>
              <Btn onClick={() => del(c.id)} small danger>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div onClick={e => e.target === e.currentTarget && setEditing(null)} style={{ position:"fixed", inset:0, background:"rgba(5,8,16,0.85)", display:"flex", justifyContent:"flex-end", zIndex:300 }}>
          <div style={{ width:480, background:T.bg2, borderLeft:"1px solid "+T.border, height:"100%", overflowY:"auto", padding:28 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:T.text }}>{courses.find(c => c.id === editing.id) ? "Edit module" : "New module"}</div>
              <button onClick={() => setEditing(null)} style={{ background:"transparent", border:"none", color:T.dim, fontSize:20, cursor:"pointer" }}>×</button>
            </div>
            <Fld label="Module icon">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                {ICON_KEYS.map(k => (
                  <div key={k} onClick={() => setForm(f => ({ ...f, iconKey:k }))} style={{ background:form.iconKey===k?T.accent+"18":T.bg3, border:"1px solid "+(form.iconKey===k?T.accent:T.border), borderRadius:6, padding:8, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:32, height:32 }}><Icon name={k}/></div>
                    <span style={{ fontFamily:"Space Mono,monospace", fontSize:7, color:form.iconKey===k?T.accent:T.dim, textTransform:"uppercase" }}>{k}</span>
                  </div>
                ))}
              </div>
            </Fld>
            <Fld label="Module title"><Inp value={form.title||""} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} placeholder="e.g. Linux Basics"/></Fld>
            <Fld label="Description"><Txa value={form.desc||""} onChange={e => setForm(f => ({ ...f, desc:e.target.value }))} placeholder="Short description..." rows={3}/></Fld>
            <Fld label="Topics (one per line)"><Txa value={topicsStr} onChange={e => setTopicsStr(e.target.value)} placeholder={"Linux command-line basics\nFile permissions\nShell scripting"} rows={5}/></Fld>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Fld label="Level">
                <select value={form.level||"Beginner"} onChange={e => setForm(f => ({ ...f, level:e.target.value }))} style={{ width:"100%", background:T.bg3, border:"1px solid "+T.border, borderRadius:6, padding:"10px 13px", fontFamily:"Syne,sans-serif", fontSize:13, color:T.text, outline:"none" }}>
                  {["Beginner","Intermediate","Advanced","Capstone"].map(l => <option key={l}>{l}</option>)}
                </select>
              </Fld>
              <Fld label="Duration"><Inp value={form.weeks||""} onChange={e => setForm(f => ({ ...f, weeks:e.target.value }))} placeholder="2 weeks"/></Fld>
            </div>
            <Fld label="Accent color">
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {accentColors.map(col => (
                  <div key={col} onClick={() => setForm(f => ({ ...f, accent:col }))} style={{ width:28, height:28, borderRadius:6, background:col, cursor:"pointer", border:form.accent===col?"2px solid "+T.text:"2px solid transparent", opacity:0.9 }}/>
                ))}
              </div>
            </Fld>
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <Btn onClick={save} primary full>Save module</Btn>
              <Btn onClick={() => setEditing(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAbout({ about, setAbout }) {
  const [form, setForm]       = useState({ ...about });
  const [expStr, setExpStr]   = useState(about.experience.map(e => `${e.role}|${e.company}|${e.period}|${e.stack}`).join("\n"));
  const [certsStr, setCertsStr] = useState(about.certs.join("\n"));
  const [toast, setToast]     = useState(false);

  function save() {
    const experience = expStr.split("\n").filter(Boolean).map(line => {
      const [role,company,period,stack] = line.split("|");
      return { role:role||"", company:company||"", period:period||"", stack:stack||"" };
    });
    const certs = certsStr.split("\n").map(c => c.trim()).filter(Boolean);
    setAbout({ ...form, experience, certs });
    setToast(true); setTimeout(() => setToast(false), 2500);
  }

  return (
    <div style={{ padding:28 }}>
      <Toast msg={toast ? "Saved successfully" : ""}/>
      <div style={{ fontWeight:700, fontSize:20, color:T.text, marginBottom:4 }}>About Me</div>
      <Mono s={{ display:"block", marginBottom:24 }}>Edit your public profile</Mono>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
        <div>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:14, color:T.text, marginBottom:16 }}>Basic info</div>
            <Fld label="Full name"><Inp value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} placeholder="Sarmen Gharibian"/></Fld>
            <Fld label="Title / role"><Inp value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} placeholder="Senior DevOps Engineer..."/></Fld>
            <Fld label="LinkedIn URL"><Inp value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin:e.target.value }))} placeholder="https://linkedin.com/in/..."/></Fld>
            <Fld label="Bio"><Txa value={form.bio} onChange={e => setForm(f => ({ ...f, bio:e.target.value }))} placeholder="Write a short bio..." rows={4}/></Fld>
          </Card>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:14, color:T.text, marginBottom:8 }}>Experience</div>
            <Mono s={{ display:"block", marginBottom:8, fontSize:9 }}>Format: Role|Company|Period|Stack (one per line)</Mono>
            <Txa value={expStr} onChange={e => setExpStr(e.target.value)} placeholder="Senior DevOps Engineer|Ameriabank|Oct 2023 - Present|K8s · ArgoCD" rows={5}/>
          </Card>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:14, color:T.text, marginBottom:8 }}>Certifications</div>
            <Mono s={{ display:"block", marginBottom:8, fontSize:9 }}>One per line</Mono>
            <Txa value={certsStr} onChange={e => setCertsStr(e.target.value)} placeholder={"GitOps at Scale\nLinux - Linux Academy"} rows={3}/>
          </Card>
          <Card style={{ background:T.bg3 }}>
            <Mono s={{ display:"block", marginBottom:12, color:T.accent }}>Live preview</Mono>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:T.text }}>{form.name||"—"}</div>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:T.accent, marginBottom:8 }}>// {form.title||"—"}</div>
            <p style={{ fontFamily:"Syne,sans-serif", fontSize:12, color:T.dim, lineHeight:1.7, margin:0 }}>{form.bio||"—"}</p>
          </Card>
        </div>
      </div>
      <div style={{ marginTop:24 }}><Btn onClick={save} primary>Save changes</Btn></div>
    </div>
  );
}

function AdminSite() {
  const [vals, setVals] = useState({ siteName:"DevOpsGuru", siteUrl:"https://devopsguru.am", contactEmail:"sarmen@devopsguru.am", passingGrade:"70", magicLinkExpiry:"15", maintenanceMode:false });
  const [toast, setToast] = useState(false);
  function save() { setToast(true); setTimeout(() => setToast(false), 2500); }
  return (
    <div style={{ padding:28 }}>
      <Toast msg={toast ? "Settings saved" : ""}/>
      <div style={{ fontWeight:700, fontSize:20, color:T.text, marginBottom:4 }}>Site Settings</div>
      <Mono s={{ display:"block", marginBottom:24 }}>Global configuration</Mono>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:700 }}>
        {[["siteName","Site name"],["siteUrl","Site URL"],["contactEmail","Contact email"],["passingGrade","Passing grade (%)"],["magicLinkExpiry","Magic link expiry (min)"]].map(([k,l]) => (
          <Fld key={k} label={l}><Inp value={vals[k]} onChange={e => setVals(v => ({ ...v, [k]:e.target.value }))} placeholder={l}/></Fld>
        ))}
        <Fld label="Maintenance mode">
          <div onClick={() => setVals(v => ({ ...v, maintenanceMode:!v.maintenanceMode }))} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:40, height:22, borderRadius:11, background:vals.maintenanceMode?T.danger:T.border, position:"relative", transition:"background 0.2s" }}>
              <div style={{ position:"absolute", top:3, left:vals.maintenanceMode?20:3, width:16, height:16, borderRadius:"50%", background:T.text, transition:"left 0.2s" }}/>
            </div>
            <Mono s={{ color:vals.maintenanceMode?T.danger:T.dim }}>{vals.maintenanceMode?"ON":"OFF"}</Mono>
          </div>
        </Fld>
      </div>
      <div style={{ marginTop:24 }}><Btn onClick={save} primary>Save settings</Btn></div>
    </div>
  );
}

function Admin({ courses, setCourses, about, setAbout }) {
  const [active, setActive] = useState("dashboard");
  const titles = { dashboard:"Dashboard", students:"Students", messages:"Messages", modules:"Modules", about:"About Me", site:"Site Settings", homework:"Homework", sessions:"Sessions", recordings:"Recordings" };
  const contentPages = ["dashboard","modules","about","site"];

  return (
    <div style={{ display:"flex", height:"100%", fontFamily:"Syne,sans-serif" }}>
      <AdminSidebar active={active} setActive={setActive}/>
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", background:T.bg }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid "+T.border, flexShrink:0 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:T.text }}>{titles[active]||active}</div>
            <Mono s={{ color:T.danger }}>Admin panel · devopsguru.am</Mono>
          </div>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:T.accent, background:T.accent+"12", border:"1px solid "+T.accent+"33", padding:"6px 12px", borderRadius:6, cursor:"pointer" }}>View site</span>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {active === "dashboard" && <AdminDashboard courses={courses}/>}
          {active === "modules"   && <AdminModules courses={courses} setCourses={setCourses}/>}
          {active === "about"     && <AdminAbout about={about} setAbout={setAbout}/>}
          {active === "site"      && <AdminSite/>}
          {!contentPages.includes(active) && (
            <div style={{ padding:28, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, paddingTop:80 }}>
              <div style={{ fontSize:40 }}>🚧</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:T.text }}>{titles[active]}</div>
              <Mono>This section will be built in Phase 2</Mono>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]     = useState("public");
  const [courses, setCourses] = useState(INIT_COURSES);
  const [about, setAbout]   = useState(INIT_ABOUT);

  const TAB = on => ({
    padding:"11px 18px", fontFamily:"Space Mono,monospace", fontSize:11, letterSpacing:"0.08em",
    color: on ? T.accent : T.dim, cursor:"pointer", border:"none",
    borderBottom: on ? "2px solid "+T.accent : "2px solid transparent",
    background:"none", textTransform:"uppercase",
  });

  const isFullHeight = page === "portal" || page === "admin";

  return (
    <div style={{ background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", background:T.bg2, borderBottom:"1px solid "+T.border, padding:"0 20px", gap:4, flexShrink:0 }}>
        <button style={TAB(page==="public")} onClick={() => setPage("public")}>Public site</button>
        <button style={TAB(page==="login")}  onClick={() => setPage("login")}>Login / Enroll</button>
        <button style={TAB(page==="portal")} onClick={() => setPage("portal")}>Student portal</button>
        <button style={TAB(page==="admin")}  onClick={() => setPage("admin")}>Admin panel</button>
      </div>
      <div style={{ flex:1, overflow: isFullHeight ? "hidden" : "auto" }}>
        {page === "public" && (
          <div style={{ background:T.bg }}>
            <Navbar onLogin={() => setPage("login")} onEnroll={() => setPage("login")}/>
            <Hero onEnroll={() => setPage("login")} courses={courses}/>
            <CoursesSection onEnroll={() => setPage("login")} courses={courses}/>
            <HowItWorks onEnroll={() => setPage("login")}/>
            <AboutSection about={about}/>
            <Footer onLogin={() => setPage("login")} onEnroll={() => setPage("login")}/>
          </div>
        )}
        {page === "login"  && <LoginPage onBack={() => setPage("public")}/>}
        {page === "portal" && <Portal courses={courses}/>}
        {page === "admin"  && <Admin courses={courses} setCourses={setCourses} about={about} setAbout={setAbout}/>}
      </div>
    </div>
  );
}