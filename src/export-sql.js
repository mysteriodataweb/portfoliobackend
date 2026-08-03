import pg from "pg";
import "dotenv/config";

const localPool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "portfolio",
  user: "postgres",
  password: "trust",
});

async function exportSQL() {
  console.log("Export SQL en cours...");

  let sql = `-- Migration portfolio vers Supabase\n-- Genere le ${new Date().toISOString()}\n\n`;

  // Schema
  sql += `-- Schema\n`;
  sql += `
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
`;

  // Export data
  const tables = ["projects", "blog_posts", "skill_categories", "skills", "certifications", "tools", "profile", "admin_users", "messages"];

  for (const table of tables) {
    const result = await localPool.query(`SELECT * FROM ${table}`);
    if (result.rows.length > 0) {
      sql += `\n-- Donnees ${table}\n`;
      for (const row of result.rows) {
        const keys = Object.keys(row);
        const values = keys.map(k => {
          const v = row[k];
          if (v === null) return "NULL";
          if (typeof v === "boolean") return v ? "true" : "false";
          if (typeof v === "number") return v;
          if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
          return `'${String(v).replace(/'/g, "''")}'`;
        });
        sql += `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")}) ON CONFLICT DO NOTHING;\n`;
      }
    }
  }

  // Write to file
  const fs = await import("fs");
  fs.writeFileSync("migrate-supabase.sql", sql);
  console.log("Fichier migrate-supabase.sql cree !");
  console.log("Copie-colle ce fichier dans l'editeur SQL de Supabase.");

  await localPool.end();
}

exportSQL();
