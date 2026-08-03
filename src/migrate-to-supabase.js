import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const localPool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "portfolio",
  user: "postgres",
  password: "trust",
});

const supabasePool = new pg.Pool({
  connectionString: `postgresql://postgres:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
  ssl: { rejectUnauthorized: false },
});

const query = (pool, text, params) => pool.query(text, params);

async function migrate() {
  console.log("Migration vers Supabase...");

  try {
    // Test local connection
    console.log("Test connexion locale...");
    await localPool.query("SELECT NOW()");
    console.log("OK");

    // Test Supabase connection
    console.log("Test connexion Supabase...");
    await supabasePool.query("SELECT NOW()");
    console.log("OK");

    // Create tables on Supabase
    console.log("Creation des tables...");
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

    const statements = schema.split(";").filter((s) => s.trim());
    for (const stmt of statements) {
      await query(supabasePool, stmt);
    }
    console.log("Tables creees");

    // Migrate data
    const tables = ["projects", "blog_posts", "skill_categories", "skills", "certifications", "profile", "admin_users", "cv_sections", "cv_items", "messages"];

    for (const table of tables) {
      console.log(`Migration ${table}...`);
      const result = await query(localPool, `SELECT * FROM ${table}`);
      
      if (result.rows.length > 0) {
        for (const row of result.rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map((_, i) => `$${i + 1}`);
          
          const insertQuery = `
            INSERT INTO ${table} (${keys.join(", ")})
            VALUES (${placeholders.join(", ")})
            ON CONFLICT DO NOTHING
          `;
          
          await query(supabasePool, insertQuery, values);
        }
        console.log(`${result.rows.length} lignes migrees`);
      } else {
        console.log("Vide, skip");
      }
    }

    console.log("Migration terminee !");
  } catch (err) {
    console.error("Erreur migration:", err);
  } finally {
    await localPool.end();
    await supabasePool.end();
  }
}

migrate();
