import pg from "pg";
import "dotenv/config";

function parseDatabaseUrl(url) {
  const schemeEnd = url.indexOf("://");
  const afterScheme = url.slice(schemeEnd + 3);
  const lastAt = afterScheme.lastIndexOf("@");
  const userInfo = afterScheme.slice(0, lastAt);
  const hostPortDb = afterScheme.slice(lastAt + 1);
  const colonIdx = userInfo.indexOf(":");
  const user = userInfo.slice(0, colonIdx);
  const password = decodeURIComponent(userInfo.slice(colonIdx + 1));
  const slashIdx = hostPortDb.indexOf("/");
  const hostPort = slashIdx === -1 ? hostPortDb : hostPortDb.slice(0, slashIdx);
  const database = slashIdx === -1 ? "" : hostPortDb.slice(slashIdx + 1).split("?")[0];
  const [host, port] = hostPort.split(":");
  return { host, port: parseInt(port || "5432"), user, password, database };
}

let pool;

if (process.env.DATABASE_URL) {
  try {
    const cfg = parseDatabaseUrl(process.env.DATABASE_URL);
    pool = new pg.Pool({
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
      ssl: { rejectUnauthorized: false },
    });
    console.log(`DB connectee sur ${cfg.host}:${cfg.port}/${cfg.database}`);
  } catch (e) {
    console.error("Erreur parsing DATABASE_URL:", e.message);
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  }
} else {
  pool = new pg.Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "portfolio",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
  });
}

pool.on("error", (err) => {
  console.error("Erreur de connexion PostgreSQL:", err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
