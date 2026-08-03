import { Router } from "express";
import { query } from "../db.js";

const router = Router();

const getSetting = async (key, fallback) => {
  const res = await query("SELECT value FROM site_settings WHERE key = $1", [key]);
  if (res.rows.length > 0) {
    const parsed = parseInt(res.rows[0].value, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

router.get("/", async (req, res) => {
  try {
    const [yearsExperience, clientsCount, projects, articles] = await Promise.all([
      getSetting("stats_years_experience", 5),
      getSetting("stats_clients_count", 15),
      query("SELECT COUNT(*) FROM projects WHERE published = true"),
      query("SELECT COUNT(*) FROM blog_posts WHERE published = true"),
    ]);

    res.json({
      yearsExperience,
      clientsCount,
      projectsCount: parseInt(projects.rows[0].count, 10),
      articlesCount: parseInt(articles.rows[0].count, 10),
    });
  } catch (err) {
    console.error("Erreur get stats:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
