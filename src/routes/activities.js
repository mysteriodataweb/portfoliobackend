import { Router } from "express";
import { query } from "../db.js";

// The table is created on first start so deploying this route needs no manual migration.
export const activitiesReady = query(`
  CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    activity_date DATE,
    description TEXT,
    media_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`).catch((err) => {
  console.error("Erreur creation table activities:", err);
});

export const ACTIVITY_COLUMNS =
  "id, title, category, to_char(activity_date, 'YYYY-MM-DD') AS activity_date, description, media_url";

export const mapActivity = (row) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  date: row.activity_date,
  description: row.description,
  mediaUrl: row.media_url,
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    await activitiesReady;
    const result = await query(
      `SELECT ${ACTIVITY_COLUMNS} FROM activities ORDER BY activities.activity_date DESC NULLS LAST, id DESC`
    );
    res.json(result.rows.map(mapActivity));
  } catch (err) {
    console.error("Erreur get activities:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
