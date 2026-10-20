import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { authenticateToken, signToken } from "../middleware/auth.js";

const router = Router();

// Only failed attempts count, so a successful login never locks the admin out.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: "Trop de tentatives de connexion, réessayez dans 15 minutes" },
});

// Checked when the username is unknown, so that case takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("unknown-user", 10);

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      return res.status(400).json({ error: "Username et password requis" });
    }

    const result = await query("SELECT id, username, password_hash FROM admin_users WHERE username = $1", [username]);
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    if (!user || !validPassword) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    res.json({ token: signToken(user), username: user.username });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

export default router;
