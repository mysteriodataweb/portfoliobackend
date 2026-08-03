import { Router } from "express";
import { query } from "../../db.js";

const mapTool = (row) => ({
  id: row.id,
  name: row.name,
  image: row.image,
  sortOrder: row.sort_order,
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM tools ORDER BY sort_order, name");
    res.json(result.rows.map(mapTool));
  } catch (err) {
    console.error("Erreur get tools admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, image, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Le nom est requis" });
    }
    const result = await query(
      "INSERT INTO tools (name, image, sort_order) VALUES ($1,$2,$3) RETURNING *",
      [name, image, sort_order || 0]
    );
    res.status(201).json(mapTool(result.rows[0]));
  } catch (err) {
    console.error("Erreur create tool:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const fields = {
      name: req.body.name,
      image: req.body.image,
      sort_order: req.body.sort_order,
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

    if (setClauses.length === 0) {
      return res.status(400).json({ error: "Aucune modification fournie" });
    }

    values.push(req.params.id);

    const result = await query(
      `UPDATE tools SET ${setClauses.join(", ")} WHERE id=$${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Outil non trouvé" });
    }
    res.json(mapTool(result.rows[0]));
  } catch (err) {
    console.error("Erreur update tool:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM tools WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Outil non trouvé" });
    }
    res.json({ message: "Outil supprimé" });
  } catch (err) {
    console.error("Erreur delete tool:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
