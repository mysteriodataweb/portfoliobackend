import { Router } from "express";
import { query } from "../../db.js";

const router = Router();

router.put("/", async (req, res) => {
  try {
    const { yearsExperience, clientsCount } = req.body;
    const updates = [
      ["stats_years_experience", yearsExperience],
      ["stats_clients_count", clientsCount],
    ];

    for (const [key, value] of updates) {
      if (value !== undefined) {
        await query(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
          [key, String(value)]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur update stats:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
