-- DevOpsGuru — full schema

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

-- ADMIN USERS (password + TOTP 2FA — no magic links)
CREATE TABLE admin_users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret   VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PUBLIC VIDEOS (free preview lessons on /videos page)
CREATE TABLE public_videos (
  id            SERIAL PRIMARY KEY,
  youtube_id    VARCHAR(30),
  video_url     VARCHAR(500),
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  duration      VARCHAR(20),
  course        VARCHAR(100),
  course_accent VARCHAR(10) NOT NULL DEFAULT '#00d4ff',
  icon_key      VARCHAR(30) NOT NULL DEFAULT 'linux',
  level         VARCHAR(20) NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner','Intermediate','Advanced')),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Test database for integration tests
CREATE DATABASE devopsguru_test;
