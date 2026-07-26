-- Tables CV manquantes

CREATE TABLE IF NOT EXISTS cv_sections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'custom',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cv_items (
  id SERIAL PRIMARY KEY,
  section_id INT REFERENCES cv_sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  date_start VARCHAR(20) DEFAULT '',
  date_end VARCHAR(20) DEFAULT '',
  description TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0
);
