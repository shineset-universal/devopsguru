# CLAUDE.md — DevOpsGuru Coaching Portal
# Project — v3.0
# Generated: May 2026

> This file is the project memory for Claude Code.
> Read this file at the start of every session before doing anything.
> All rules here are mandatory — never skip them.

---

## Project Overview

**Client:** Sarmen Gharibian (personal brand)
**Project:** DevOpsGuru — DevOps Coaching Portal
**Type:** Personal Brand Website + Private Student LMS
**URL (dev):**     http://localhost:3000
**URL (staging):** https://dev.devopsguru.am
**URL (prod):**    https://devopsguru.am
**Admin (dev):**   http://localhost:3001
**Admin (prod):**  https://admin.devopsguru.am
**Started:** May 2026
**Stack decision:** Next.js App Router for unified public site + student portal in one codebase. Separate admin on port 3001. PostgreSQL for all relational data. Redis for sessions and rate limiting. Cloudinary for video/file storage. Resend for magic link auth and email notifications.
**Responsive:** Mobile-first 375px+

---

## CRITICAL — Docker Workflow

**NEVER run npm, node, or any package manager directly on the host machine.**
**ALL commands must go through Docker. No exceptions.**

```powershell
# Start / rebuild
docker compose up -d
docker compose up -d --build

# Logs
docker compose logs -f app
docker compose logs -f admin

# Install packages — ALWAYS via docker
docker compose exec app npm install [package]
docker compose exec app npm install -D [package]
docker compose exec admin npm install [package]

# Run scripts
docker compose exec app npm run dev
docker compose exec app npm run build
docker compose exec app npm run lint
docker compose exec app npm run typecheck
docker compose exec app npm run test
docker compose exec app npm run test:coverage
docker compose exec app npm run test:integration
docker compose exec app npx playwright test

# Shell
docker compose exec app sh

# DB
docker compose exec postgres psql -U devopsguru -d devopsguru_db

# Restart / stop
docker compose restart app
docker compose down
docker compose down -v

# Production
docker compose -f docker-compose.prod.yml up -d --build
```

**Before every commit:**
```powershell
docker compose exec app npm run lint
docker compose exec app npm run typecheck
docker compose exec app npm run test
docker compose exec app npm run build
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16+ (App Router, TypeScript strict)
- **Styling:** Tailwind CSS v4 — no inline styles, ever
- **Animations:** Framer Motion (whileInView pattern)
- **Fonts:** Syne (headings) + Space Mono (mono/labels)
- **Icons:** lucide-react
- **Dates:** date-fns
- **PDF:** @react-pdf/renderer (certificates)

### Backend
- **Auth:** Magic link via Resend
- **Email:** Resend
- **Files/Video:** Cloudinary

### Databases
- PostgreSQL 16 — port 5432
- Redis 7 — port 6379 (sessions, rate limiting)

### Mandatory packages
- `jose` — JWT (**NEVER** use `jsonwebtoken`)
- `zod` — all input validation
- `date-fns` — date math
- `@react-pdf/renderer` — certificates
- `papaparse` — CSV exports

### Infrastructure
- **Local:** Docker Compose + Windows + PowerShell
- **Staging:** Linux VPS + Docker Compose + Nginx + SSL
- **Production:** Kubernetes
- **CI/CD:** git push to main → docker compose up --build on server

---

## Docker Services

| Service  | Container           | Port | Purpose                   |
|----------|---------------------|------|---------------------------|
| app      | devopsguru-app      | 3000 | Next.js (public + portal) |
| admin    | devopsguru-admin    | 3001 | Admin CMS                 |
| postgres | devopsguru-postgres | 5432 | Database                  |
| redis    | devopsguru-redis    | 6379 | Sessions / rate limiting  |
| adminer  | devopsguru-adminer  | 8080 | DB GUI (dev only)         |

---

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DevOpsGuru
NODE_ENV=development

# Host = container name, NOT localhost
DATABASE_URL=postgresql://devopsguru:devopsguru_pass@devopsguru-postgres:5432/devopsguru_db
REDIS_URL=redis://devopsguru-redis:6379

JWT_SECRET=[32+ char secret — openssl rand -base64 32]
ADMIN_EMAIL=sarmen@devopsguru.am

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@devopsguru.am

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_UPLOAD_PRESET=devopsguru_uploads

# Always separate — NEVER test against dev data
TEST_DATABASE_URL=postgresql://devopsguru:devopsguru_pass@devopsguru-postgres:5432/devopsguru_test
```

---

## Project Structure

```
devopsguru/
├── app/
│   ├── (public)/
│   │   ├── _sections/
│   │   │   ├── Hero/index.tsx + HeroClient.tsx
│   │   │   ├── Courses/index.tsx + CoursesClient.tsx
│   │   │   ├── HowItWorks/index.tsx
│   │   │   ├── About/index.tsx + AboutClient.tsx
│   │   │   └── Contact/index.tsx + ContactClient.tsx
│   │   └── page.tsx
│   ├── enroll/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── verify/page.tsx
│   ├── (portal)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── courses/page.tsx
│   │   ├── courses/[slug]/page.tsx
│   │   ├── courses/[slug]/[lessonId]/page.tsx
│   │   ├── recordings/page.tsx
│   │   ├── homework/page.tsx
│   │   ├── homework/[id]/page.tsx
│   │   ├── sessions/page.tsx
│   │   ├── messages/[courseId]/page.tsx
│   │   └── certificates/page.tsx
│   ├── api/
│   │   ├── auth/magic-link/route.ts
│   │   ├── auth/verify/route.ts
│   │   ├── auth/logout/route.ts
│   │   ├── enroll/route.ts
│   │   ├── courses/route.ts
│   │   ├── courses/[slug]/route.ts
│   │   ├── courses/[slug]/lessons/[id]/progress/route.ts
│   │   ├── homework/route.ts
│   │   ├── homework/[id]/submit/route.ts
│   │   ├── messages/route.ts
│   │   ├── recordings/route.ts
│   │   ├── sessions/route.ts
│   │   ├── certificates/[id]/route.ts
│   │   └── contact/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── admin/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── dashboard/students/page.tsx
│   │   ├── dashboard/invite-codes/page.tsx
│   │   ├── dashboard/courses/page.tsx
│   │   ├── dashboard/courses/[id]/page.tsx
│   │   ├── dashboard/recordings/page.tsx
│   │   ├── dashboard/homework/page.tsx
│   │   ├── dashboard/sessions/page.tsx
│   │   ├── dashboard/messages/page.tsx
│   │   ├── dashboard/settings/page.tsx
│   │   └── api/[...all admin routes]
│   └── middleware.ts
│
├── services/
│   ├── auth/lib/jwt.ts + session.ts + magic-link.ts
│   ├── enrollment/lib/invite-codes.ts + queries.ts
│   ├── courses/lib/queries.ts + progress.ts
│   ├── homework/lib/queries.ts + grading.ts
│   ├── messages/lib/queries.ts
│   └── certificates/lib/generator.ts + queries.ts
│
├── components/
│   ├── ui/Button.tsx + Card.tsx + Badge.tsx + Input.tsx + Modal.tsx + ProgressBar.tsx
│   ├── layout/Navbar.tsx + Footer.tsx + PortalSidebar.tsx + PortalTopbar.tsx
│   └── icons/ModuleIcon.tsx
│
├── lib/
│   ├── db.ts
│   ├── redis.ts
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── fmt.ts
│   ├── utils.ts
│   └── mock-data.ts          ← Phase 1 ONLY
│
├── middleware.ts
├── tests/unit/ + integration/ + e2e/
├── docker/Dockerfile + Dockerfile.dev + init.sql + seed.sql + nginx.conf
├── docker-compose.yml
├── docker-compose.prod.yml
├── k8s/
├── .env.local
└── CLAUDE.md
```

---

## Design System

```css
--bg:        #050810;    --bg-2:      #080d1a;    --bg-3:    #0c1225;
--card-dark: #0f1520;    --border:    #1a2340;
--accent:    #00d4ff;    --accent-2:  #0057ff;    --accent-3:#7b2fff;
--text:      #e8edf8;    --text-dim:  #7a8aaa;
--success:   #00ff88;    --warn:      #ffaa00;     --danger:  #ff6060;
--font-display: 'Syne', sans-serif;
--font-mono:    'Space Mono', monospace;
```

**Tailwind v4:** `bg-(--accent)` not `bg-[#00d4ff]`

**Design reference:** `CoachingPortalUI.jsx` — approved mockup. Phase 1 must match it exactly.

---

## Database Schema

```sql
-- STUDENTS
CREATE TABLE students (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(30),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COURSES
CREATE TABLE courses (
  id           SERIAL PRIMARY KEY,
  num          VARCHAR(3)   NOT NULL,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) NOT NULL UNIQUE,
  description  TEXT,
  level        VARCHAR(20)  NOT NULL CHECK (level IN ('Beginner','Intermediate','Advanced','Capstone')),
  weeks        VARCHAR(50),
  accent_color VARCHAR(10)  NOT NULL DEFAULT '#00d4ff',
  icon_key     VARCHAR(30)  NOT NULL DEFAULT 'linux',
  is_capstone  BOOLEAN NOT NULL DEFAULT false,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVITE CODES
CREATE TABLE invite_codes (
  id         SERIAL PRIMARY KEY,
  code       VARCHAR(50) NOT NULL UNIQUE,
  course_id  INTEGER     NOT NULL REFERENCES courses(id),
  max_uses   INTEGER,
  used_count INTEGER     NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENROLLMENTS
CREATE TABLE enrollments (
  id             SERIAL PRIMARY KEY,
  student_id     INTEGER NOT NULL REFERENCES students(id),
  course_id      INTEGER NOT NULL REFERENCES courses(id),
  invite_code_id INTEGER REFERENCES invite_codes(id),
  enrolled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- MODULES
CREATE TABLE modules (
  id         SERIAL PRIMARY KEY,
  course_id  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- LESSONS
CREATE TABLE lessons (
  id           SERIAL PRIMARY KEY,
  module_id    INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  content      TEXT,
  video_url    VARCHAR(500),
  duration_min INTEGER,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_lessons_module ON lessons(module_id);

-- LESSON PROGRESS
CREATE TABLE lesson_progress (
  student_id   INTEGER NOT NULL REFERENCES students(id),
  lesson_id    INTEGER NOT NULL REFERENCES lessons(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (student_id, lesson_id)
);

-- RECORDINGS
CREATE TABLE recordings (
  id           SERIAL PRIMARY KEY,
  course_id    INTEGER NOT NULL REFERENCES courses(id),
  lesson_id    INTEGER REFERENCES lessons(id),
  title        VARCHAR(200) NOT NULL,
  video_url    VARCHAR(500) NOT NULL,
  recorded_at  TIMESTAMPTZ,
  duration_min INTEGER,
  published    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ASSIGNMENTS
CREATE TABLE assignments (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER NOT NULL REFERENCES courses(id),
  lesson_id   INTEGER REFERENCES lessons(id),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  due_date    TIMESTAMPTZ,
  max_score   INTEGER NOT NULL DEFAULT 100,
  published   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBMISSIONS
CREATE TABLE submissions (
  id            SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id),
  student_id    INTEGER NOT NULL REFERENCES students(id),
  content       TEXT,
  file_url      VARCHAR(500),
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  grade         INTEGER,
  feedback      TEXT,
  graded_at     TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student    ON submissions(student_id);

-- LIVE SESSIONS
CREATE TABLE live_sessions (
  id           SERIAL PRIMARY KEY,
  course_id    INTEGER NOT NULL REFERENCES courses(id),
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 90,
  meeting_url  VARCHAR(500),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_scheduled ON live_sessions(scheduled_at);

-- MESSAGES
CREATE TABLE messages (
  id         SERIAL PRIMARY KEY,
  course_id  INTEGER NOT NULL REFERENCES courses(id),
  student_id INTEGER NOT NULL REFERENCES students(id),
  sender     VARCHAR(20) NOT NULL CHECK (sender IN ('student','instructor')),
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at    TIMESTAMPTZ
);

CREATE INDEX idx_messages_course_student ON messages(course_id, student_id);

-- CERTIFICATES
CREATE TABLE certificates (
  id         SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  course_id  INTEGER NOT NULL REFERENCES courses(id),
  issued_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cert_url   VARCHAR(500),
  UNIQUE(student_id, course_id)
);

-- MAGIC LINKS
CREATE TABLE magic_links (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  token      VARCHAR(255) NOT NULL UNIQUE,
  role       VARCHAR(20)  NOT NULL CHECK (role IN ('student','admin')),
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_magic_links_token ON magic_links(token);

-- SITE SETTINGS
CREATE TABLE site_settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CONTACT REQUESTS
CREATE TABLE contact_requests (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Seed Data (docker/seed.sql)

```sql
INSERT INTO site_settings (key, value) VALUES
  ('instructor_name',           'Sarmen Gharibian'),
  ('instructor_title',          'Senior DevOps Engineer · Founder, DevOpsGuru'),
  ('instructor_linkedin',       'https://www.linkedin.com/in/sarmen-gharibian90'),
  ('instructor_bio',            'I build and ship production-grade infrastructure every day — Kubernetes clusters, GitOps pipelines, Istio service meshes, and cloud infrastructure at Ameriabank. I teach exactly what I use in production.'),
  ('contact_email',             'sarmen@devopsguru.am'),
  ('passing_grade',             '70'),
  ('magic_link_expiry_minutes', '15');

INSERT INTO courses (num,title,slug,description,level,weeks,accent_color,icon_key,sort_order) VALUES
  ('01','Linux Basics',                'linux-basics','File system navigation, shell scripting, process management and system services.',                  'Beginner',     '2 weeks', '#00d4ff','linux',      1),
  ('02','Version Control with Git',    'git',         'Master branching strategies, Git workflows and team collaboration.',                                'Beginner',     '2 weeks', '#f05033','git',        2),
  ('03','CI/CD Pipelines',             'cicd',        'Automated delivery pipelines with Jenkins, GitLab CI and Azure DevOps.',                           'Intermediate', '3 weeks', '#ff9f43','cicd',       3),
  ('04','Infrastructure as Code',      'iac',         'Terraform for cloud infra, Ansible for configuration management.',                                  'Intermediate', '3 weeks', '#7b2fff','terraform',  4),
  ('05','Containerization with Docker','docker',      'Build, ship and run containers in production.',                                                     'Intermediate', '3 weeks', '#2496ed','docker',     5),
  ('06','Kubernetes Orchestration',    'kubernetes',  'Pods, services, Ingress, Helm. Real cluster management at scale.',                                  'Advanced',     '4 weeks', '#326ce5','kubernetes', 6),
  ('07','Monitoring & Logging',        'monitoring',  'Full observability with Prometheus, Grafana and the ELK stack.',                                    'Intermediate', '2 weeks', '#00ff88','grafana',    7),
  ('08','GitOps & Infra Automation',   'gitops',      'Git as single source of truth. ArgoCD and FluxCD for automated Kubernetes delivery.',              'Advanced',     '2 weeks', '#f97316','gitops',     8),
  ('09','Real-World DevOps Project',   'capstone',    'Full capstone: CI/CD, Kubernetes, Terraform, monitoring and GitOps delivery.','Capstone',    '3 weeks', '#00d4ff','capstone',   9);

UPDATE courses SET is_capstone = true WHERE slug = 'capstone';

INSERT INTO invite_codes (code, course_id, max_uses, expires_at) VALUES
  ('LINUX2026',  1, 20, NOW() + INTERVAL '3 months'),
  ('DEVOPS2026', 5, 20, NOW() + INTERVAL '3 months');
```

---

## Key Business Rules

1. **Access code required.** No student can register without a valid, unexpired, non-exhausted invite code. The code auto-enrolls them in the linked course.
2. **One submission per assignment.** Editable until graded. Once `graded_at` is set, submission is locked.
3. **Certificate auto-issued** when all published lessons are complete AND all published assignments have `grade >= passing_grade` (from `site_settings`). Check runs after every lesson completion and every grade save.
4. **Magic links expire in 15 min**, single-use. `used` flag set immediately on first verify.
5. **Video access is enrollment-scoped.** Never expose raw Cloudinary URLs in HTML — proxy through API for enrolled students only.
6. **Disabled students** (`is_active = false`) are rejected at login even with a valid token.
7. **`passing_grade`** always comes from `site_settings` — never hardcoded.
8. **Messages are async.** No WebSockets. Poll on tab focus (5 min max interval).
9. **Single admin.** Only `ADMIN_EMAIL` env var can access admin panel.
10. **`used_count`** must be incremented atomically in a transaction when code is consumed.

---

## Auth Flow

```
STUDENT ENROLL (first time):
  /enroll → code + name + email
  → POST /api/enroll
  → validate code (exists, not expired, used_count < max_uses)
  → BEGIN tx → INSERT student → INSERT enrollment → UPDATE used_count → COMMIT
  → send magic link (Resend)
  → /auth/verify?token=xxx → JWT 7d httpOnly cookie → /dashboard

STUDENT RETURN LOGIN:
  /auth/login → email
  → POST /api/auth/magic-link { role:'student' }
  → check student exists + is_active
  → INSERT magic_links (15 min ttl)
  → Resend sends link → /auth/verify → JWT → /dashboard

ADMIN LOGIN:
  /auth/login → check email === ADMIN_EMAIL env
  → same magic link flow → JWT role:'admin' → /admin/dashboard

RATE LIMIT: 5 attempts / IP / min via Redis on all /api/auth/* routes
```

---

## Certificate Logic

```typescript
// services/certificates/lib/generator.ts
export async function checkAndIssueCertificate(studentId: number, courseId: number): Promise<void> {
  // 1. Get passing_grade from site_settings (never hardcode)
  // 2. Count all published lessons for course
  // 3. Count completed lessons for student in lesson_progress
  // 4. If not all lessons done → return early
  // 5. Count all published assignments for course
  // 6. Count submissions where grade >= passing_grade for student
  // 7. If not all passed → return early
  // 8. Check certificate doesn't already exist (idempotent)
  // 9. Generate PDF → upload to Cloudinary → INSERT certificates
  // 10. Send congratulations email via Resend
}
```

---

## Coding Rules (MANDATORY)

### No Hardcoding — Zero Tolerance

| Value | Must come from |
|-------|---------------|
| Passing grade | DB: site_settings |
| Magic link expiry | DB: site_settings |
| Instructor info | DB: site_settings |
| Course data | DB: courses table |
| Counts / stats | Real DB queries |
| Today's date | `new Date()` |

`lib/mock-data.ts` — **Phase 1 UI only.** Any import in Phase 2+ is a bug.

### TypeScript
- Strict mode, zero `any`
- Explicit return types on all functions
- Interfaces over types for objects
- No `// @ts-ignore`
- Zod for all external input

### React / Next.js
- Functional components only
- `"use client"` only when needed
- Server Components by default
- Loading + error states on every async component
- `key` on every mapped element

### API routes
```typescript
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error:'Invalid input' }, { status:400 })
    // business logic with parsed.data only
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/xxx]', error)
    return NextResponse.json({ error:'Internal server error' }, { status:500 })
  }
}
```

---

## Phase 0 Scaffold Prompt for Claude Code

Paste this into Claude Code to start:

```
Read CLAUDE.md fully before doing anything.

Execute Phase 0 in this exact order — stop after each step and confirm:

1. docker-compose.yml — services: devopsguru-app (3000), devopsguru-admin (3001),
   devopsguru-postgres (5432), devopsguru-redis (6379), devopsguru-adminer (8080).
   DB host = container name, NOT localhost.

2. docker/Dockerfile.dev — Next.js with WATCHPACK_POLLING=true, non-root user.

3. Main app (port 3000) — package.json, tsconfig.json (strict), next.config.ts,
   app/globals.css with ALL design tokens from CLAUDE.md Design System section,
   Google Fonts: Syne + Space Mono.
   Packages: next react react-dom typescript tailwindcss framer-motion
   lucide-react date-fns zod jose ioredis pg @react-pdf/renderer resend
   cloudinary papaparse

4. Admin app in ./admin/ (port 3001) — same stack.

5. docker/init.sql — full schema exactly as in CLAUDE.md Database Schema section.

6. docker/seed.sql — seed data exactly as in CLAUDE.md Seed Data section.

7. lib/mock-data.ts — typed mock exports:
   - MOCK_COURSES: all 9 courses matching CoachingPortalUI.jsx data
   - MOCK_STUDENTS: 3 sample students
   - MOCK_SESSIONS: 2 upcoming sessions
   - MOCK_HOMEWORK: 3 homework items with statuses

8. middleware.ts — protect routes: /dashboard/*, /courses/*, /recordings/*,
   /homework/*, /sessions/*, /messages/*, /certificates/*

9. docker compose up -d --build
   Confirm localhost:3000 returns 200.

Report: "Phase 0 complete — localhost:3000 running"
Do NOT start Phase 1 until I approve.
```

---

## Progress

### PHASE 0 — Setup
- [ ] CLAUDE.md in project root
- [ ] docker-compose.yml
- [ ] docker/Dockerfile + Dockerfile.dev
- [ ] docker/init.sql
- [ ] docker/seed.sql
- [ ] lib/mock-data.ts
- [ ] app/globals.css — design tokens + fonts
- [ ] middleware.ts
- [ ] docker compose up confirmed at localhost:3000

### PHASE 1 — UI (match CoachingPortalUI.jsx exactly)

| # | Page | Route | Status |
|---|------|-------|--------|
| 1  | Public — Hero             | /                    | [ ] |
| 2  | Public — Courses          | /                    | [ ] |
| 3  | Public — How it works     | /                    | [ ] |
| 4  | Public — About            | /                    | [ ] |
| 5  | Public — Footer/Contact   | /                    | [ ] |
| 6  | Enroll page               | /enroll              | [ ] |
| 7  | Auth — Login              | /auth/login          | [ ] |
| 8  | Auth — Verify             | /auth/verify         | [ ] |
| 9  | Portal — Dashboard        | /dashboard           | [ ] |
| 10 | Portal — Courses list     | /courses             | [ ] |
| 11 | Portal — Course detail    | /courses/[slug]      | [ ] |
| 12 | Portal — Lesson           | /courses/[slug]/[id] | [ ] |
| 13 | Portal — Recordings       | /recordings          | [ ] |
| 14 | Portal — Homework list    | /homework            | [ ] |
| 15 | Portal — Homework detail  | /homework/[id]       | [ ] |
| 16 | Portal — Sessions         | /sessions            | [ ] |
| 17 | Portal — Messages         | /messages/[courseId] | [ ] |
| 18 | Portal — Certificates     | /certificates        | [ ] |
| 19 | Admin — Login             | :3001/login          | [ ] |
| 20 | Admin — Dashboard         | :3001/dashboard      | [ ] |
| 21 | Admin — Students          | :3001/dashboard/students | [ ] |
| 22 | Admin — Invite codes      | :3001/dashboard/invite-codes | [ ] |
| 23 | Admin — Courses/modules   | :3001/dashboard/courses | [ ] |
| 24 | Admin — Recordings        | :3001/dashboard/recordings | [ ] |
| 25 | Admin — Homework/grading  | :3001/dashboard/homework | [ ] |
| 26 | Admin — Sessions          | :3001/dashboard/sessions | [ ] |
| 27 | Admin — Messages          | :3001/dashboard/messages | [ ] |
| 28 | Admin — Settings/About    | :3001/dashboard/settings | [ ] |

### PHASE 2 — Microservices

| # | Service | Covers | Status |
|---|---------|--------|--------|
| 1  | auth        | Magic link, JWT, session, middleware      | [ ] |
| 2  | enrollment  | Invite code validation, student creation  | [ ] |
| 3  | courses     | Course/module/lesson CRUD, progress       | [ ] |
| 4  | recordings  | CRUD, enrollment-scoped access            | [ ] |
| 5  | homework    | Assignments, submission, grading          | [ ] |
| 6  | sessions    | Scheduling, Zoom link delivery            | [ ] |
| 7  | messages    | Send/receive, admin reply                 | [ ] |
| 8  | certificates| Completion check, PDF gen, upload         | [ ] |
| 9  | admin-cms   | All admin routes, site settings           | [ ] |
| 10 | contact     | Public form → Resend                      | [ ] |

### PHASE 3 — E2E (Playwright)

| # | Scenario | Status |
|---|----------|--------|
| 1 | Full enroll: valid code → portal access | [ ] |
| 2 | Invalid / expired code → error | [ ] |
| 3 | Return login → magic link → dashboard | [ ] |
| 4 | All lessons + homework passed → cert issued | [ ] |
| 5 | Submit homework → admin grades → student sees | [ ] |
| 6 | Unenrolled student blocked from recording | [ ] |
| 7 | Message: student → admin replies → student sees | [ ] |
| 8 | Admin: create course → invite code → enroll student | [ ] |

### PHASE 4 — Deploy

| # | Step | Status |
|---|------|--------|
| 1 | devopsguru.am DNS → VPS | [ ] |
| 2 | Staging deploy on Linux VPS | [ ] |
| 3 | SSL certs (devopsguru.am + admin.devopsguru.am) | [ ] |
| 4 | Production deploy (Kubernetes) | [ ] |
| 5 | Smoke test on production URL | [ ] |

### Progress Summary

```
Phase 0 — Setup:     0/9  done
Phase 1 — UI:        0/28 done
Phase 2 — Services:  0/10 done
Phase 3 — E2E:       0/8  done
Phase 4 — Deploy:    0/5  done
─────────────────────────────
Total:               0/60 done
```

---

*Last updated: May 2026*
*devopsguru.am · Yerevan, Armenia*