import { Router } from "express";
import { query } from "../../db.js";

const router = Router();

router.get("/sections", async (req, res) => {
  try {
    const sections = await query("SELECT * FROM cv_sections ORDER BY sort_order");
    const items = await query("SELECT * FROM cv_items ORDER BY sort_order");
    const sectionsWithItems = sections.rows.map((s) => ({
      ...s, items: items.rows.filter((i) => i.section_id === s.id),
    }));
    res.json(sectionsWithItems);
  } catch (err) {
    console.error("Erreur get sections:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/sections", async (req, res) => {
  try {
    const { title, type, sort_order } = req.body;
    const result = await query(
      "INSERT INTO cv_sections (title, type, sort_order) VALUES ($1,$2,$3) RETURNING *",
      [title, type || "custom", sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur create section:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/sections/:id", async (req, res) => {
  try {
    const { title, type, sort_order } = req.body;
    const result = await query(
      "UPDATE cv_sections SET title=$1, type=$2, sort_order=$3 WHERE id=$4 RETURNING *",
      [title, type, sort_order, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Section non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update section:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/sections/:id", async (req, res) => {
  try {
    await query("DELETE FROM cv_items WHERE section_id = $1", [req.params.id]);
    const result = await query("DELETE FROM cv_sections WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Section non trouvée" });
    res.json({ message: "Section supprimée" });
  } catch (err) {
    console.error("Erreur delete section:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const { section_id, title, subtitle, date_start, date_end, description, highlights, sort_order } = req.body;
    const result = await query(
      `INSERT INTO cv_items (section_id, title, subtitle, date_start, date_end, description, highlights, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [section_id, title, subtitle || "", date_start || "", date_end || "", description || "",
        JSON.stringify(highlights || []), sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur create item:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const { section_id, title, subtitle, date_start, date_end, description, highlights, sort_order } = req.body;
    const result = await query(
      `UPDATE cv_items SET section_id=$1, title=$2, subtitle=$3, date_start=$4, date_end=$5, description=$6, highlights=$7, sort_order=$8
       WHERE id=$9 RETURNING *`,
      [section_id, title, subtitle, date_start, date_end, description, JSON.stringify(highlights || []), sort_order, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Élément non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update item:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM cv_items WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Élément non trouvé" });
    res.json({ message: "Élément supprimé" });
  } catch (err) {
    console.error("Erreur delete item:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
