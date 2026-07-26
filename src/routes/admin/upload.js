import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const imageStorage = multer.diskStorage({
  destination: path.join(__dirname, "../../../uploads/images"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const cvStorage = multer.diskStorage({
  destination: path.join(__dirname, "../../../uploads/cv"),
  filename: (req, file, cb) => {
    cb(null, "cv" + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images (jpeg, jpg, png, gif, webp) sont acceptees"));
    }
  },
});

const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont acceptes"));
    }
  },
});

function getBaseUrl(req) {
  return process.env.BACKEND_URL || (req.protocol + "://" + req.get("host"));
}

router.post("/image", imageUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier uploade" });
  }
  var base = getBaseUrl(req);
  res.json({ url: base + "/uploads/images/" + req.file.filename });
});

router.post("/cv", cvUpload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier uploade" });
  }
  try {
    var base = getBaseUrl(req);
    var cvUrl = base + "/uploads/cv/" + req.file.filename;
    await query(
      "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2",
      ["cv_path", cvUrl]
    );
    res.json({ url: cvUrl });
  } catch (err) {
    console.error("Erreur upload cv:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
