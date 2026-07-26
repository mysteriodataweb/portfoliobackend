import pg from "pg";
import "dotenv/config";

function sanitizeConnectionString(url) {
  if (!url) return url;
  const schemeEnd = url.indexOf("://");
  if (schemeEnd === -1) return url;
  const scheme = url.slice(0, schemeEnd + 3);
  const rest = url.slice(schemeEnd + 3);
  const lastAt = rest.lastIndexOf("@");
  if (lastAt === -1) return url;
  const userInfo = rest.slice(0, lastAt);
  const hostPart = rest.slice(lastAt + 1);
  const colonIdx = userInfo.indexOf(":");
  if (colonIdx === -1) return url;
  const user = userInfo.slice(0, colonIdx);
  const pass = userInfo.slice(colonIdx + 1);
  const encodedPass = encodeURIComponent(pass);
  return `${scheme}${user}:${encodedPass}@${hostPart}`;
}

const connectionString = process.env.DATABASE_URL
  ? sanitizeConnectionString(process.env.DATABASE_URL)
  : null;

const pool = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "portfolio",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
    });

pool.on("error", (err) => {
  console.error("Erreur de connexion PostgreSQL:", err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
