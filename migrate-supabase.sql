-- Migration portfolio vers Supabase
-- Genere le 2026-07-16T03:14:56.749Z

-- Schema

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image VARCHAR(500),
  tech_stack JSONB DEFAULT '[]',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  date VARCHAR(10),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  context TEXT,
  approach TEXT,
  results TEXT,
  challenges TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  image VARCHAR(500),
  date VARCHAR(10),
  read_time VARCHAR(20),
  content TEXT,
  published BOOLEAN DEFAULT true,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org VARCHAR(255),
  year VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  photo VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  website_url VARCHAR(500),
  values_title VARCHAR(255),
  values JSONB DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Donnees projects : executer ensuite migrate-projets-reels.sql

-- Donnees blog_posts
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (1, 'comprendre-transformers-attention', 'Comprendre les Transformers : Le Mécanisme d''Attention Expliqué', 'Une plongée en profondeur dans le mécanisme d''attention.', 'IA/ML', '["Transformers","NLP","Deep Learning","Attention"]', '/images/blog-cover-1.jpg', '2025-12-15', '8 min', '## Introduction

Les Transformers ont révolutionné le NLP.', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (2, 'react-server-components-guide', 'React Server Components : Guide Pratique pour 2025', 'Comment tirer parti des React Server Components.', 'Fullstack', '["React","Server Components","Performance","Next.js"]', '/images/blog-cover-2.jpg', '2025-11-28', '6 min', '## Pourquoi les Server Components ?', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (3, 'pipeline-donnees-moderne', 'Construire un Pipeline de Données Moderne en 2025', 'Architecture et outils pour un pipeline data robuste.', 'Data Science', '["Data Engineering","ETL","Pipeline","Airflow","dbt"]', '/images/blog-cover-3.jpg', '2025-11-10', '10 min', '## L''Évolution des Pipelines Data', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;

-- Donnees skill_categories
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (1, 'Langages', 'Code2', 'primary', 1) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (2, 'Data Science & ML', 'Brain', 'accent-purple', 2) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (3, 'AI & Generative AI', 'Sparkles', 'accent-orange', 3) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (4, 'Frontend', 'Monitor', 'accent-cyan', 4) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (5, 'Backend & DevOps', 'Server', 'accent-blue', 5) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (6, 'Data Analysis & Visualisation', 'BarChart3', 'accent-green', 6) ON CONFLICT DO NOTHING;

-- Donnees skills
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (1, 1, 'Python', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (2, 1, 'TypeScript', 90, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (3, 1, 'JavaScript', 90, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (4, 1, 'SQL', 88, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (5, 1, 'R', 70, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (6, 1, 'Jupyter', 85, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (7, 2, 'Pandas / NumPy', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (8, 2, 'Scikit-learn', 92, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (9, 2, 'PyTorch', 85, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (10, 2, 'TensorFlow', 80, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (11, 2, 'XGBoost / LightGBM', 88, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (12, 2, 'MLOps', 75, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (13, 2, 'SHAP', 80, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (14, 2, 'Feature Engineering', 82, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (15, 3, 'OpenAI / GPT API', 85, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (16, 3, 'HuggingFace Transformers', 82, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (17, 3, 'LangChain / LLM Orchestration', 78, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (18, 3, 'RAG (Retrieval Augmented Generation)', 80, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (19, 3, 'Prompt Engineering', 85, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (20, 3, 'Pinecone / Vector DB', 75, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (21, 3, 'GROQ AI', 72, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (22, 3, 'Stable Diffusion', 68, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (23, 4, 'React', 92, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (24, 4, 'Next.js', 85, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (25, 4, 'TailwindCSS', 90, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (26, 4, 'Framer Motion', 78, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (27, 4, 'D3.js / Plotly', 78, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (28, 4, 'shadcn/ui', 82, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (29, 4, 'Vue.js', 65, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (30, 5, 'Node.js', 88, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (31, 5, 'FastAPI', 85, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (32, 5, 'PostgreSQL', 88, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (33, 5, 'Docker', 82, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (34, 5, 'DuckDB', 78, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (35, 5, 'CI/CD', 80, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (36, 5, 'AWS / Cloud', 75, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (37, 5, 'Git / GitHub Actions', 85, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (38, 6, 'Pandas / NumPy', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (39, 6, 'Matplotlib / Seaborn', 88, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (40, 6, 'Plotly / Dash', 82, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (41, 6, 'Power BI', 78, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (43, 6, 'Statistique & Inference Causale', 85, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (44, 6, 'Data Storytelling', 82, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (45, 6, 'EDA (Exploratory Data Analysis)', 88, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (42, NULL, 'Excel / Google Sheets', 80, 0) ON CONFLICT DO NOTHING;

-- Donnees certifications
INSERT INTO certifications (id, name, org, year) VALUES (1, 'AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024') ON CONFLICT DO NOTHING;
INSERT INTO certifications (id, name, org, year) VALUES (2, 'TensorFlow Developer Certificate', 'Google', '2024') ON CONFLICT DO NOTHING;
INSERT INTO certifications (id, name, org, year) VALUES (3, 'Data Science Professional', 'IBM', '2023') ON CONFLICT DO NOTHING;

-- Donnees profile
INSERT INTO profile (id, full_name, title, bio, photo, email, phone, location, github_url, linkedin_url, twitter_url, website_url, values_title, values, updated_at) VALUES (1, 'Alfred BIAM', 'Data & AI Engineer', 'Passionné par la data science et le développement web, je crée des solutions innovantes alliant IA et performance.', NULL, 'contact@example.com', NULL, NULL, 'https://github.com', 'https://linkedin.com', NULL, NULL, 'Mes Valeurs', '["Innovation continue","Qualité du code","Impact mesurable"]', '"2026-07-15T06:23:51.475Z"') ON CONFLICT DO NOTHING;

-- Le compte admin n'est pas exporte : creez-le avec `npm run admin:password`.
