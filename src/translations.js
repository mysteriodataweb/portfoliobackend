import { query } from "./db.js";

// English versions of the content, added after the first release. The columns are created on start so the
// deployment needs no manual migration; an empty column means the site shows the French text instead.
export const translationsReady = query(`
  ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS short_description_en TEXT,
    ADD COLUMN IF NOT EXISTS full_description_en TEXT,
    ADD COLUMN IF NOT EXISTS context_en TEXT,
    ADD COLUMN IF NOT EXISTS approach_en TEXT,
    ADD COLUMN IF NOT EXISTS results_en TEXT,
    ADD COLUMN IF NOT EXISTS challenges_en TEXT;
  ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
    ADD COLUMN IF NOT EXISTS content_en TEXT;
  ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio_en TEXT;
  ALTER TABLE skill_categories ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);
  ALTER TABLE cv_sections ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
  ALTER TABLE cv_items
    ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS subtitle_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description_en TEXT,
    ADD COLUMN IF NOT EXISTS highlights_en JSONB;
`).catch((err) => {
  console.error("Erreur ajout des colonnes anglaises:", err);
});

export const projectTranslations = (row) => ({
  titleEn: row.title_en ?? null,
  shortDescriptionEn: row.short_description_en ?? null,
  fullDescriptionEn: row.full_description_en ?? null,
  contextEn: row.context_en ?? null,
  approachEn: row.approach_en ?? null,
  resultsEn: row.results_en ?? null,
  challengesEn: row.challenges_en ?? null,
});

export const postTranslations = (row) => ({
  titleEn: row.title_en ?? null,
  excerptEn: row.excerpt_en ?? null,
  contentEn: row.content_en ?? null,
});

/** The English text when the visitor reads in English and one was written, otherwise the French one. */
export const pick = (lang, french, english) =>
  lang === "en" && typeof english === "string" && english.trim() ? english : french;

export const readLang = (value) => (value === "en" ? "en" : "fr");
