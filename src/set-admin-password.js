import bcrypt from "bcryptjs";
import pool from "./db.js";
import "dotenv/config";

// Creates the admin account, or replaces its password. Read from .env so the password never lands in shell history.
async function setAdminPassword() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    console.error("ADMIN_PASSWORD manquant ou trop court (12 caractères minimum). Ajoutez-le dans .env.");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, passwordHash]
    );
    console.log(`Mot de passe de "${username}" enregistré. Retirez ADMIN_PASSWORD de .env.`);
  } catch (err) {
    console.error("Erreur:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setAdminPassword();
