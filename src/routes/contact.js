import { Router } from "express";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { sendContactEmail } from "../services/email.js";

// Added after the first release: the column is created on start so the deployment needs no manual migration.
const sourceColumnReady = query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS source VARCHAR(200)").catch((err) => {
  console.error("Erreur ajout colonne messages.source:", err);
});

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Trop de messages envoyés, réessayez dans une heure" },
});

const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 };
const FIELD_LABELS = { name: "nom", email: "email", subject: "sujet", message: "message" };
const SUCCESS = {
  success: true,
  message: "Message envoyé avec succès ! Je vous répondrai rapidement.",
};

const readField = (value) => (typeof value === "string" ? value.trim() : "");

router.post("/", contactLimiter, async (req, res) => {
  // "website" is a field hidden from people: only bots fill it in. They get the usual answer so they don't adapt.
  if (req.body.website) {
    return res.json(SUCCESS);
  }

  const fields = {
    name: readField(req.body.name),
    email: readField(req.body.email),
    subject: readField(req.body.subject),
    message: readField(req.body.message),
  };
  const { name, email, subject, message } = fields;
  // How the visitor first found the site, recorded by the frontend ("LinkedIn, arrivé sur /projets").
  const source = readField(req.body.source).slice(0, 200) || null;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Les champs nom, email et message sont requis" });
  }

  const tooLong = Object.keys(MAX_LENGTHS).find((field) => fields[field].length > MAX_LENGTHS[field]);
  if (tooLong) {
    return res.status(400).json({
      error: `Le champ ${FIELD_LABELS[tooLong]} est trop long (${MAX_LENGTHS[tooLong]} caractères maximum)`,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  try {
    await sourceColumnReady;
    await query(
      "INSERT INTO messages (name, email, subject, message, source) VALUES ($1, $2, $3, $4, $5)",
      [name, email, subject || null, message, source]
    );

    try {
      await sendContactEmail({ name, email, subject, message, source });
      console.log("Email de notification envoyé à fredbiam9@gmail.com");
    } catch (emailErr) {
      console.error("Erreur envoi email:", emailErr);
    }

    res.json(SUCCESS);
  } catch (err) {
    console.error("Erreur enregistrement message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
