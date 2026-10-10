import { Router } from "express";
import { query } from "../../db.js";
import { activitiesReady, ACTIVITY_COLUMNS, mapActivity } from "../activities.js";

const isHttpUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const readBody = (body) => ({
  title: typeof body.title === "string" ? body.title.trim() : "",
  category: body.category?.trim() || null,
  date: /^\d{4}-\d{2}-\d{2}$/.test(body.date || "") ? body.date : null,
  description: body.description?.trim() || null,
  mediaUrl: typeof body.mediaUrl === "string" ? body.mediaUrl.trim() : "",
});

const validate = ({ title, mediaUrl }) => {
  if (!title) return "Le titre est requis";
  if (!isHttpUrl(mediaUrl)) return "Le lien doit commencer par http:// ou https://";
  return null;
};

const router = Router();

router.post("/", async (req, res) => {
  try {
    const activity = readBody(req.body);
    const error = validate(activity);
    if (error) return res.status(400).json({ error });

    await activitiesReady;
    const result = await query(
      `INSERT INTO activities (title, category, activity_date, description, media_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING ${ACTIVITY_COLUMNS}`,
      [activity.title, activity.category, activity.date, activity.description, activity.mediaUrl]
    );
    res.status(201).json(mapActivity(result.rows[0]));
  } catch (err) {
    console.error("Erreur create activity:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const activity = readBody(req.body);
    const error = validate(activity);
    if (error) return res.status(400).json({ error });

    await activitiesReady;
    const result = await query(
      `UPDATE activities SET title=$1, category=$2, activity_date=$3, description=$4, media_url=$5
       WHERE id=$6 RETURNING ${ACTIVITY_COLUMNS}`,
      [activity.title, activity.category, activity.date, activity.description, activity.mediaUrl, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Activité non trouvée" });
    }
    res.json(mapActivity(result.rows[0]));
  } catch (err) {
    console.error("Erreur update activity:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await activitiesReady;
    const result = await query("DELETE FROM activities WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Activité non trouvée" });
    }
    res.json({ message: "Activité supprimée" });
  } catch (err) {
    console.error("Erreur delete activity:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
