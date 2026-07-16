import { Router } from "express";
import { query } from "../db.js";

const mapPost = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  category: row.category,
  tags: row.tags,
  image: row.image,
  date: row.date,
  readTime: row.read_time,
  content: row.content,
  published: row.published,
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = "SELECT * FROM blog_posts WHERE published = true";
    const params = [];
    if (category && category !== "Tous") {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`;
    }
    sql += " ORDER BY date DESC";
    const result = await query(sql, params);
    res.json(result.rows.map(mapPost));
  } catch (err) {
    console.error("Erreur get blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const result = await query("SELECT * FROM blog_posts WHERE slug = $1", [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    res.json(mapPost(result.rows[0]));
  } catch (err) {
    console.error("Erreur get blog post:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
