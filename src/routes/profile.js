import { Router } from "express";
import { query } from "../db.js";

export const mapProfile = (row) => ({
  id: row.id,
  fullName: row.full_name,
  title: row.title,
  bio: row.bio,
  photo: row.photo,
  email: row.email,
  github: row.github_url,
  linkedin: row.linkedin_url,
  twitter: row.twitter_url,
});

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

export default router;
