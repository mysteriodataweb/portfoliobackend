import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM profile ORDER BY id LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }
    const row = result.rows[0];
    res.json({
      id: row.id,
      fullName: row.full_name,
      title: row.title,
      bio: row.bio,
      photo: row.photo,
      email: row.email,
      github: row.github,
      linkedin: row.linkedin,
      twitter: row.twitter,
    });
  } catch (err) {
    console.error("Erreur get profile:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
