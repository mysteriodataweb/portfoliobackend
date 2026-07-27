import { Router } from "express";
import { query } from "../../db.js";

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
  archived: row.archived,
  archivedAt: row.archived_at,
  context: row.context,
  approach: row.approach,
  results: row.results,
  challenges: row.challenges,
});

const router = Router();

// Auto-delete archived projects older than 3 days
const cleanupArchived = async () => {
  try {
    await query(
      "DELETE FROM projects WHERE archived = true AND archived_at < NOW() - INTERVAL '3 days'"
    );
  } catch (err) {
    console.error("Erreur cleanup projects:", err);
  }
};

router.get("/", async (req, res) => {
  try {
    await cleanupArchived();
    const result = await query("SELECT * FROM projects ORDER BY date DESC");
    res.json(result.rows.map(mapProject));
  } catch (err) {
    console.error("Erreur get projects admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title, slug, category, shortDescription, fullDescription,
      image, techStack, githubUrl, demoUrl, date, featured,
      published, context, approach, results, challenges,
    } = req.body;

    const techStackJson = Array.isArray(techStack) ? JSON.stringify(techStack) : techStack;

    const result = await query(
      `INSERT INTO projects (slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [slug, title, category, shortDescription, fullDescription, image, techStackJson, githubUrl, demoUrl, date, featured, published, context, approach, results, challenges]
    );
    res.json(mapProject(result.rows[0]));
  } catch (err) {
    console.error("Erreur create project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const fields = {
      title: req.body.title,
      slug: req.body.slug,
      category: req.body.category,
      short_description: req.body.shortDescription,
      full_description: req.body.fullDescription,
      image: req.body.image,
      tech_stack: Array.isArray(req.body.techStack) ? JSON.stringify(req.body.techStack) : req.body.techStack,
      github_url: req.body.githubUrl,
      demo_url: req.body.demoUrl,
      date: req.body.date,
      featured: req.body.featured,
      published: req.body.published,
      context: req.body.context,
      approach: req.body.approach,
      results: req.body.results,
      challenges: req.body.challenges,
    };

    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [col, val] of Object.entries(fields)) {
      if (val !== undefined) {
        setClauses.push(`${col}=$${idx}`);
        values.push(val);
        idx++;
      }
    }

    setClauses.push(`updated_at=NOW()`);
    values.push(req.params.id);

    const result = await query(
      `UPDATE projects SET ${setClauses.join(", ")} WHERE id=$${idx} RETURNING *`,
      values
    );
    res.json(mapProject(result.rows[0]));
  } catch (err) {
    console.error("Erreur update project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/archive", async (req, res) => {
  try {
    await query(
      "UPDATE projects SET archived = true, archived_at = NOW(), published = false WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur archive project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/unarchive", async (req, res) => {
  try {
    await query(
      "UPDATE projects SET archived = false, archived_at = NULL, published = true WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur unarchive project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur delete project:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
