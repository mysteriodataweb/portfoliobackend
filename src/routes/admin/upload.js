import { Router } from "express";
import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const BUCKET = "images";

let _supabase;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return _supabase;
}

const memoryUpload = multer({
  storage: multer.memoryStorage(),
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

router.post("/image", memoryUpload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier uploade" });
  }

  try {
    const supabase = getSupabase();
    const ext = path.extname(req.file.originalname);
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    const filePath = "projects/" + filename;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erreur upload Supabase:", uploadError);
      return res.status(500).json({ error: "Erreur lors de l'upload" });
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    res.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("Erreur upload:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
