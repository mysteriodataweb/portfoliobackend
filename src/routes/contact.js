import { Router } from "express";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { sendContactEmail } from "../services/email.js";
import { readLang } from "../translations.js";

// Added after the first release: the column is created on start so the deployment needs no manual migration.
const sourceColumnReady = query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS source VARCHAR(200)").catch((err) => {
  console.error("Erreur ajout colonne messages.source:", err);
});

const router = Router();

// The form sends the language of the page, and the visitor reads the answer in it.
const MESSAGES = {
  fr: {
    tooMany: "Trop de messages envoyés, réessayez dans une heure",
    success: "Message envoyé avec succès ! Je vous répondrai rapidement.",
    required: "Les champs nom, email et message sont requis",
    tooLong: (field, max) => `Le champ ${field} est trop long (${max} caractères maximum)`,
    fields: { name: "nom", email: "email", subject: "sujet", message: "message" },
    invalidEmail: "Adresse email invalide",
    server: "Erreur serveur",
  },
  en: {
    tooMany: "Too many messages sent, please try again in an hour",
    success: "Message sent! I'll get back to you soon.",
    required: "Name, email and message are required",
    tooLong: (field, max) => `The ${field} field is too long (${max} characters maximum)`,
    fields: { name: "name", email: "email", subject: "subject", message: "message" },
    invalidEmail: "Invalid email address",
    server: "Server error",
  },
};

const messagesFor = (req) => MESSAGES[readLang(req.body?.lang)];

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: (req) => ({ error: messagesFor(req).tooMany }),
});

const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 };

const readField = (value) => (typeof value === "string" ? value.trim() : "");

router.post("/", contactLimiter, async (req, res) => {
  const t = messagesFor(req);
  const success = { success: true, message: t.success };

  // "website" is a field hidden from people: only bots fill it in. They get the usual answer so they don't adapt.
  if (req.body.website) {
    return res.json(success);
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
    return res.status(400).json({ error: t.required });
  }

  const tooLong = Object.keys(MAX_LENGTHS).find((field) => fields[field].length > MAX_LENGTHS[field]);
  if (tooLong) {
    return res.status(400).json({ error: t.tooLong(t.fields[tooLong], MAX_LENGTHS[tooLong]) });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: t.invalidEmail });
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

    res.json(success);
  } catch (err) {
    console.error("Erreur enregistrement message:", err);
    res.status(500).json({ error: t.server });
  }
});

export default router;
