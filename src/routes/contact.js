import { Router } from "express";
import { query } from "../db.js";
import { sendContactEmail } from "../services/email.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Les champs nom, email et message sont requis" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  try {
    await query(
      "INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject || null, message]
    );

    try {
      await sendContactEmail({ name, email, subject, message });
      console.log("Email de notification envoyé à fredbiam9@gmail.com");
    } catch (emailErr) {
      console.error("Erreur envoi email:", emailErr);
    }

    res.json({
      success: true,
      message: "Message envoyé avec succès ! Je vous répondrai rapidement.",
    });
  } catch (err) {
    console.error("Erreur enregistrement message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
