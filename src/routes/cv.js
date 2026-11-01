import { Router } from "express";
import { query } from "../db.js";
import { translationsReady } from "../translations.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { profile, sections, skills } = await getCVData();
    res.json({ profile, sections, skills });
  } catch (err) {
    console.error("Erreur get CV:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

async function getCVData() {
  await translationsReady;
  const profileResult = await query("SELECT * FROM profile ORDER BY id LIMIT 1");
  const profile = profileResult.rows[0] || {};

  const sectionsResult = await query("SELECT * FROM cv_sections ORDER BY sort_order");
  const itemsResult = await query("SELECT * FROM cv_items ORDER BY sort_order");
  const skillsResult = await query("SELECT sc.name as category, sc.name_en as category_en, s.name, s.level FROM skills s JOIN skill_categories sc ON s.category_id = sc.id ORDER BY sc.sort_order, s.sort_order");

  const sections = sectionsResult.rows.map((section) => ({
    ...section,
    items: itemsResult.rows.filter((item) => item.section_id === section.id),
  }));

  return { profile, sections, skills: skillsResult.rows };
}

// The CV used to be generated here as HTML and PDF. The site now shows it as a page and the PDF is sent on
// request, adapted to each role: links already shared lead to that page.
const SITE_URL = (process.env.FRONTEND_URL || "https://www.kwami.dev").replace(/\/+$/, "");

router.get(["/html", "/pdf"], (req, res) => {
  res.redirect(302, `${SITE_URL}/cv${req.query.lang === "en" ? "?lang=en" : ""}`);
});

export default router;
