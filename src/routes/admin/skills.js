import { Router } from "express";
import { query } from "../../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM skill_categories ORDER BY sort_order");
    const skills = await query("SELECT * FROM skills ORDER BY sort_order");
    const certifications = await query("SELECT * FROM certifications ORDER BY year DESC");

    const categoriesWithSkills = categories.rows.map((cat) => ({
      ...cat,
      skills: skills.rows.filter((s) => s.category_id === cat.id),
    }));

    res.json({ categories: categoriesWithSkills, certifications: certifications.rows });
  } catch (err) {
    console.error("Erreur get skills:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, icon, color, sort_order } = req.body;
    const result = await query(
      "INSERT INTO skill_categories (name, icon, color, sort_order) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, icon, color, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur create category:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { name, icon, color, sort_order } = req.body;
    const result = await query(
      "UPDATE skill_categories SET name=$1, icon=$2, color=$3, sort_order=$4 WHERE id=$5 RETURNING *",
      [name, icon, color, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update category:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM skill_categories WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    console.error("Erreur delete category:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category_id, name, level, sort_order } = req.body;
    const result = await query(
      "INSERT INTO skills (category_id, name, level, sort_order) VALUES ($1,$2,$3,$4) RETURNING *",
      [category_id, name, level || 0, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur create skill:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { category_id, name, level, sort_order } = req.body;
    const result = await query(
      "UPDATE skills SET category_id=$1, name=$2, level=$3, sort_order=$4 WHERE id=$5 RETURNING *",
      [category_id, name, level || 0, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Compétence non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update skill:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM skills WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Compétence non trouvée" });
    }
    res.json({ message: "Compétence supprimée" });
  } catch (err) {
    console.error("Erreur delete skill:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/certifications", async (req, res) => {
  try {
    const { name, org, year } = req.body;
    const result = await query(
      "INSERT INTO certifications (name, org, year) VALUES ($1,$2,$3) RETURNING *",
      [name, org, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur create certification:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/certifications/:id", async (req, res) => {
  try {
    const { name, org, year } = req.body;
    const result = await query(
      "UPDATE certifications SET name=$1, org=$2, year=$3 WHERE id=$4 RETURNING *",
      [name, org, year, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Certification non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update certification:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/certifications/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM certifications WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Certification non trouvée" });
    }
    res.json({ message: "Certification supprimée" });
  } catch (err) {
    console.error("Erreur delete certification:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
