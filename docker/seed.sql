-- DevOpsGuru — seed data

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
