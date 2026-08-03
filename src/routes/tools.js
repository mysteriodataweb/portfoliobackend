import { Router } from "express";
import { query } from "../db.js";

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
    console.error("Erreur get tools:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
