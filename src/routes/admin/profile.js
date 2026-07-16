import { Router } from "express";
import { query } from "../../db.js";

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

router.put("/", async (req, res) => {
  try {
    const {
      fullName, title, bio, photo, email, github, linkedin, twitter
    } = req.body;

    const existing = await query("SELECT id FROM profile LIMIT 1");

    if (existing.rows.length === 0) {
      const result = await query(
        `INSERT INTO profile (full_name, title, bio, photo, email, github, linkedin, twitter)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [fullName, title, bio, photo, email, github, linkedin, twitter]
      );
      return res.json(result.rows[0]);
    }

    const result = await query(
      `UPDATE profile SET
        full_name=$1, title=$2, bio=$3, photo=$4, email=$5,
        github=$6, linkedin=$7, twitter=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [fullName, title, bio, photo, email, github, linkedin, twitter, existing.rows[0].id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur update profile:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
