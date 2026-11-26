import { Router } from "express";
import { query } from "../db.js";
import { projectTranslations } from "../translations.js";

// Free-form page in Markdown (text, code, screenshots), shown instead of the four fixed sections when filled in.
// Added after the first release: the column is created on start so the deployment needs no manual migration.
export const projectContentReady = query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT").catch((err) => {
  console.error("Erreur ajout colonne projects.content:", err);
});

const mapProject = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  shortDescription: row.short_description,
  fullDescription: row.full_description,
  image: row.image,
  techStack: row.tech_stack,
  githubUrl: row.github_url,
  demoUrl: row.demo_url,
  date: row.date,
  featured: row.featured,
  published: row.published,
  context: row.context,
  approach: row.approach,
  results: row.results,
  challenges: row.challenges,
  content: row.content ?? null,
  ...projectTranslations(row),
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let sql = "SELECT * FROM projects WHERE published = true";
    const params = [];
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    sql += " ORDER BY date DESC";
    const result = await query(sql, params);
    res.json(result.rows.map(mapProject));
  } catch (err) {
    console.error("Erreur get projects:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const result = await query("SELECT * FROM projects WHERE featured = true AND published = true ORDER BY date DESC");
    res.json(result.rows.map(mapProject));
  } catch (err) {
    console.error("Erreur get featured:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const result = await query("SELECT * FROM projects WHERE slug = $1 AND published = true", [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }
    res.json(mapProject(result.rows[0]));
  } catch (err) {
    console.error("Erreur get project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
