import { Router } from "express";
import { query } from "../../db.js";
import { mapProfile } from "../profile.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM profile ORDER BY id LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }
    res.json(mapProfile(result.rows[0]));
  } catch (err) {
    console.error("Erreur get profile:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/", async (req, res) => {
  try {
    // Only the fields sent are written: the About page sends name, title, bio and photo, and must not wipe the links.
    const fields = {
      full_name: req.body.fullName,
      title: req.body.title,
      bio: req.body.bio,
      photo: req.body.photo,
      email: req.body.email,
      github_url: req.body.github,
      linkedin_url: req.body.linkedin,
      twitter_url: req.body.twitter,
    };
    const entries = Object.entries(fields).filter(([, val]) => val !== undefined);
    if (entries.length === 0) {
      return res.status(400).json({ error: "Aucune modification fournie" });
    }
    const columns = entries.map(([col]) => col);
    const values = entries.map(([, val]) => val);

    const existing = await query("SELECT id FROM profile ORDER BY id LIMIT 1");

    if (existing.rows.length === 0) {
      const result = await query(
        `INSERT INTO profile (${columns.join(", ")}) VALUES (${columns.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`,
        values
      );
      return res.json(mapProfile(result.rows[0]));
    }

    const result = await query(
      `UPDATE profile SET ${columns.map((col, i) => `${col}=$${i + 1}`).join(", ")}, updated_at=NOW()
       WHERE id=$${values.length + 1} RETURNING *`,
      [...values, existing.rows[0].id]
    );

    res.json(mapProfile(result.rows[0]));
  } catch (err) {
    console.error("Erreur update profile:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
