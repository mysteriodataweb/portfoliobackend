import { Router } from "express";
import { query } from "../../db.js";

const mapBlog = (row) => ({
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
  archived: row.archived,
  archivedAt: row.archived_at,
});

const router = Router();

// Auto-delete archived blog posts older than 3 days
const cleanupArchived = async () => {
  try {
    await query(
      "DELETE FROM blog_posts WHERE archived = true AND archived_at < NOW() - INTERVAL '3 days'"
    );
  } catch (err) {
    console.error("Erreur cleanup blog:", err);
  }
};

router.get("/", async (req, res) => {
  try {
    await cleanupArchived();
    const result = await query("SELECT * FROM blog_posts ORDER BY date DESC");
    res.json(result.rows.map(mapBlog));
  } catch (err) {
    console.error("Erreur get blog admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { slug, title, excerpt, category, tags, image, date, readTime, content, published } = req.body;
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;
    const result = await query(
      `INSERT INTO blog_posts (slug, title, excerpt, category, tags, image, date, read_time, content, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [slug, title, excerpt, category, tagsJson, image, date, readTime, content, published ?? true]
    );
    res.json(mapBlog(result.rows[0]));
  } catch (err) {
    console.error("Erreur create blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const fields = {
      slug: req.body.slug,
      title: req.body.title,
      excerpt: req.body.excerpt,
      category: req.body.category,
      tags: Array.isArray(req.body.tags) ? JSON.stringify(req.body.tags) : req.body.tags,
      image: req.body.image,
      date: req.body.date,
      read_time: req.body.readTime,
      content: req.body.content,
      published: req.body.published,
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
      `UPDATE blog_posts SET ${setClauses.join(", ")} WHERE id=$${idx} RETURNING *`,
      values
    );
    res.json(mapBlog(result.rows[0]));
  } catch (err) {
    console.error("Erreur update blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/archive", async (req, res) => {
  try {
    await query(
      "UPDATE blog_posts SET archived = true, archived_at = NOW(), published = false WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur archive blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/unarchive", async (req, res) => {
  try {
    await query(
      "UPDATE blog_posts SET archived = false, archived_at = NULL, published = true WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur unarchive blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await query("DELETE FROM blog_posts WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur delete blog:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
