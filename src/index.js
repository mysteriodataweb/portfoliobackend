import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import projectsRouter from "./routes/projects.js";
import blogRouter from "./routes/blog.js";
import skillsRouter from "./routes/skills.js";
import toolsRouter from "./routes/tools.js";
import statsRouter from "./routes/stats.js";
import contactRouter from "./routes/contact.js";
import profileRouter from "./routes/profile.js";
import cvRouter from "./routes/cv.js";
import authRouter from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";
import adminProjectsRouter from "./routes/admin/projects.js";
import adminBlogRouter from "./routes/admin/blog.js";
import adminSkillsRouter from "./routes/admin/skills.js";
import adminToolsRouter from "./routes/admin/tools.js";
import adminStatsRouter from "./routes/admin/stats.js";
import adminProfileRouter from "./routes/admin/profile.js";
import adminCvRouter from "./routes/admin/cv.js";
import adminUploadRouter from "./routes/admin/upload.js";
import adminMessagesRouter from "./routes/admin/messages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (Render, Vercel, etc.)
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(morgan("dev"));

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, "");
      const isAllowed = allowedOrigins.some(
        (o) => o.replace(/\/+$/, "") === normalized
      );
      callback(null, isAllowed);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Trop de requêtes, réessayez dans 15 minutes" },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Public routes
app.use("/api/projects", projectsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/profile", profileRouter);
app.use("/api/cv", cvRouter);
app.use("/api/auth", authRouter);

// Admin routes (protected)
app.use("/api/admin/projects", authenticateToken, adminProjectsRouter);
app.use("/api/admin/blog", authenticateToken, adminBlogRouter);
app.use("/api/admin/skills", authenticateToken, adminSkillsRouter);
app.use("/api/admin/tools", authenticateToken, adminToolsRouter);
app.use("/api/admin/stats", authenticateToken, adminStatsRouter);
app.use("/api/admin/profile", authenticateToken, adminProfileRouter);
app.use("/api/admin/cv", authenticateToken, adminCvRouter);
app.use("/api/admin/upload", authenticateToken, adminUploadRouter);
app.use("/api/admin/messages", authenticateToken, adminMessagesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  if (err.message && err.message.includes("Seuls les fichiers")) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📋 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🔑 DATABASE_URL: ${process.env.DATABASE_URL ? "DEFINIE" : "NON DEFINIE"}`);
  console.log(`🌐 FRONTEND_URL: ${process.env.FRONTEND_URL || "non defini"}`);
});
