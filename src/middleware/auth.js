import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

// Without a strong secret anyone could sign their own admin token, so the server refuses to start.
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET manquant ou trop court (32 caractères minimum). Générez-en un avec : openssl rand -hex 32"
  );
}

export const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "12h",
  });

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token d'authentification requis" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};
