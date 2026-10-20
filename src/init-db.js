import pg from "pg";
import fs from "fs";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "portfolio",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});
 
const query = (text, params) => pool.query(text, params);

const schema = `
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

  CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS cv_sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'custom',
    sort_order INT DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cv_items (
    id SERIAL PRIMARY KEY,
    section_id INT REFERENCES cv_sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    date_start VARCHAR(50),
    date_end VARCHAR(50),
    description TEXT,
    highlights JSONB DEFAULT '[]',
    sort_order INT DEFAULT 0
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
`;

const seedData = `

  INSERT INTO blog_posts (slug, title, excerpt, category, tags, image, date, read_time, content, published)
  VALUES
    ('comprendre-transformers-attention', 'Comprendre les Transformers : Le Mécanisme d''Attention Expliqué', 'Une plongée en profondeur dans le mécanisme d''attention.', 'IA/ML', '["Transformers","NLP","Deep Learning","Attention"]', '/images/blog-cover-1.jpg', '2025-12-15', '8 min', '## Introduction\n\nLes Transformers ont révolutionné le NLP.', true),
    ('react-server-components-guide', 'React Server Components : Guide Pratique pour 2025', 'Comment tirer parti des React Server Components.', 'Fullstack', '["React","Server Components","Performance","Next.js"]', '/images/blog-cover-2.jpg', '2025-11-28', '6 min', '## Pourquoi les Server Components ?', true),
    ('pipeline-donnees-moderne', 'Construire un Pipeline de Données Moderne en 2025', 'Architecture et outils pour un pipeline data robuste.', 'Data Science', '["Data Engineering","ETL","Pipeline","Airflow","dbt"]', '/images/blog-cover-3.jpg', '2025-11-10', '10 min', '## L''Évolution des Pipelines Data', true)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO skill_categories (name, icon, color, sort_order)
  VALUES
    ('Langages', 'Code2', 'primary', 1),
    ('Data Science & ML', 'Brain', 'accent-purple', 2),
    ('AI & Generative AI', 'Sparkles', 'accent-orange', 3),
    ('Frontend', 'Monitor', 'accent-cyan', 4),
    ('Backend & DevOps', 'Server', 'accent-blue', 5),
    ('Data Analysis & Visualisation', 'BarChart3', 'accent-green', 6)
  ON CONFLICT DO NOTHING;

  INSERT INTO skills (category_id, name, level, sort_order)
  VALUES
    (1, 'Python', 95, 1), (1, 'TypeScript', 90, 2), (1, 'JavaScript', 90, 3), (1, 'SQL', 88, 4), (1, 'R', 70, 5), (1, 'Jupyter', 85, 6),
    (2, 'Pandas / NumPy', 95, 1), (2, 'Scikit-learn', 92, 2), (2, 'PyTorch', 85, 3), (2, 'TensorFlow', 80, 4), (2, 'XGBoost / LightGBM', 88, 5), (2, 'MLOps', 75, 6), (2, 'SHAP', 80, 7), (2, 'Feature Engineering', 82, 8),
    (3, 'OpenAI / GPT API', 85, 1), (3, 'HuggingFace Transformers', 82, 2), (3, 'LangChain / LLM Orchestration', 78, 3), (3, 'RAG (Retrieval Augmented Generation)', 80, 4), (3, 'Prompt Engineering', 85, 5), (3, 'Pinecone / Vector DB', 75, 6), (3, 'GROQ AI', 72, 7), (3, 'Stable Diffusion', 68, 8),
    (4, 'React', 92, 1), (4, 'Next.js', 85, 2), (4, 'TailwindCSS', 90, 3), (4, 'Framer Motion', 78, 4), (4, 'D3.js / Plotly', 78, 5), (4, 'shadcn/ui', 82, 6), (4, 'Vue.js', 65, 7),
    (5, 'Node.js', 88, 1), (5, 'FastAPI', 85, 2), (5, 'PostgreSQL', 88, 3), (5, 'Docker', 82, 4), (5, 'DuckDB', 78, 5), (5, 'CI/CD', 80, 6), (5, 'AWS / Cloud', 75, 7), (5, 'Git / GitHub Actions', 85, 8),
    (6, 'Pandas / NumPy', 95, 1), (6, 'Matplotlib / Seaborn', 88, 2), (6, 'Plotly / Dash', 82, 3), (6, 'Power BI', 78, 4), (6, 'Excel / Google Sheets', 80, 5), (6, 'Statistique & Inference Causale', 85, 6), (6, 'Data Storytelling', 82, 7), (6, 'EDA (Exploratory Data Analysis)', 88, 8)
  ON CONFLICT DO NOTHING;

  INSERT INTO certifications (name, org, year)
  VALUES
    ('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024'),
    ('TensorFlow Developer Certificate', 'Google', '2024'),
    ('Data Science Professional', 'IBM', '2023')
  ON CONFLICT DO NOTHING;

  INSERT INTO profile (full_name, title, bio, email, github_url, linkedin_url, values_title, values)
  VALUES (
    'Alfred BIAM',
    'Data & AI Engineer',
    'Passionné par la data science et le développement web, je crée des solutions innovantes alliant IA et performance.',
    'fredbiam9@gmail.com',
    'https://github.com/mysteriodataweb',
    'https://www.linkedin.com/in/alfredbiam',
    'Mes Valeurs',
    '["Innovation continue","Qualité du code","Impact mesurable"]'
  );
`;

const toolsSeed = `
  INSERT INTO tools (name, image, sort_order)
  VALUES
    ('TypeScript', 'https://cdn.simpleicons.org/typescript/3178C6', 1),
    ('React', 'https://cdn.simpleicons.org/react/61DAFB', 2),
    ('Next.js', 'https://cdn.simpleicons.org/nextdotjs/000000', 3),
    ('TailwindCSS', 'https://cdn.simpleicons.org/tailwindcss/38BDF8', 4),
    ('Python', 'https://cdn.simpleicons.org/python/3776AB', 5),
    ('Node.js', 'https://cdn.simpleicons.org/nodedotjs/5FA04E', 6),
    ('PostgreSQL', 'https://cdn.simpleicons.org/postgresql/4169E1', 7),
    ('Docker', 'https://cdn.simpleicons.org/docker/2496ED', 8),
    ('FastAPI', 'https://cdn.simpleicons.org/fastapi/05998B', 9),
    ('PyTorch', 'https://cdn.simpleicons.org/pytorch/EE4C2C', 10),
    ('Scikit-learn', 'https://cdn.simpleicons.org/scikitlearn/F7931E', 11),
    ('Hugging Face', 'https://cdn.simpleicons.org/huggingface/FFD21E', 12),
    ('Pandas', 'https://cdn.simpleicons.org/pandas/150458', 13),
    ('Git', 'https://cdn.simpleicons.org/git/F05032', 14),
    ('GitHub', 'https://cdn.simpleicons.org/github/181717', 15),
    ('Linux', 'https://cdn.simpleicons.org/linux/FCC624', 16),
    ('Vercel', 'https://cdn.simpleicons.org/vercel/000000', 17),
    ('AWS', 'https://cdn.simpleicons.org/amazonaws/FF9900', 18)
`;

async function initDB() {
  try {
    console.log(" Initialisation de la base de données...");

    const statements = schema.split(";").filter((s) => s.trim());
    for (const stmt of statements) {
      await query(stmt);
    }
    console.log(" Tables créées avec succès.");

    const existing = await query("SELECT COUNT(*) FROM projects");
    if (parseInt(existing.rows[0].count) === 0) {
      console.log(" Insertion des données de test...");

      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || adminPassword.length < 12) {
        throw new Error("ADMIN_PASSWORD manquant ou trop court (12 caractères minimum)");
      }
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      const seedStatements = seedData.split(";").filter((s) => s.trim());
      for (const stmt of seedStatements) {
        if (stmt.trim()) {
          await query(stmt);
        }
      }

      // Projects live in their own script, which also updates an existing database.
      await query(fs.readFileSync(new URL("../migrate-projets-reels.sql", import.meta.url), "utf8"));

      await query(
        "INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = $2",
        [process.env.ADMIN_USERNAME || "admin", passwordHash]
      );

      console.log(" Données insérées avec succès.");
      console.log(` Admin créé : ${process.env.ADMIN_USERNAME || "admin"}`);
    } else {
      console.log(" La base de données contient déjà des données.");
    }

    const toolCount = await query("SELECT COUNT(*) FROM tools");
    if (parseInt(toolCount.rows[0].count) === 0) {
      console.log(" Insertion des outils par défaut...");
      await query(toolsSeed);
      console.log(" Outils insérés avec succès.");
    }

    console.log(" Initialisation terminée !");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error(" Erreur lors de l'initialisation:", err);
    await pool.end();
    process.exit(1);
  }
}

initDB();
