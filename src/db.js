import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "portfolio",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

pool.on("error", (err) => {
  console.error("Erreur de connexion PostgreSQL:", err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
