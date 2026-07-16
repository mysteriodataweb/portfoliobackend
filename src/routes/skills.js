import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM skill_categories ORDER BY sort_order");
    const skills = await query("SELECT * FROM skills ORDER BY sort_order");
    const certs = await query("SELECT * FROM certifications ORDER BY year DESC");

    const categoriesWithSkills = categories.rows.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      sortOrder: cat.sort_order,
      skills: skills.rows
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level,
          categoryId: s.category_id,
          sortOrder: s.sort_order,
        })),
    }));

    res.json({
      skillCategories: categoriesWithSkills,
      certifications: certs.rows.map((c) => ({
        id: c.id,
        name: c.name,
        org: c.org,
        year: c.year,
      })),
    });
  } catch (err) {
    console.error("Erreur get skills:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
