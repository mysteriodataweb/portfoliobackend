import { Router } from "express";
import PDFDocument from "pdfkit";
import { query } from "../db.js";

const router = Router();

async function getCVData() {
  const profileResult = await query("SELECT * FROM profile ORDER BY id LIMIT 1");
  const profile = profileResult.rows[0] || {};

  const sectionsResult = await query("SELECT * FROM cv_sections ORDER BY sort_order");
  const itemsResult = await query("SELECT * FROM cv_items ORDER BY sort_order");
  const skillsResult = await query("SELECT sc.name as category, s.name, s.level FROM skills s JOIN skill_categories sc ON s.category_id = sc.id ORDER BY sc.sort_order, s.sort_order");

  const sections = sectionsResult.rows.map((section) => ({
    ...section,
    items: itemsResult.rows.filter((item) => item.section_id === section.id),
  }));

  return { profile, sections, skills: skillsResult.rows };
}

router.get("/html", async (req, res) => {
  try {
    const { profile, sections, skills } = await getCVData();

    const skillsByCategory = {};
    skills.forEach((s) => {
      if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
      skillsByCategory[s.category].push(s);
    });

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${profile.full_name || ""}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; background: #fff; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #6366f1; }
    .header h1 { font-size: 32px; color: #6366f1; margin-bottom: 8px; }
    .header .title { font-size: 18px; color: #64748b; margin-bottom: 16px; }
    .contact { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 14px; color: #64748b; }
    .contact a { color: #6366f1; text-decoration: none; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 20px; color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
    .item { margin-bottom: 20px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .item h3 { font-size: 16px; font-weight: 600; }
    .item .date { font-size: 14px; color: #64748b; }
    .item .subtitle { font-size: 14px; color: #6366f1; font-weight: 500; }
    .item p { font-size: 14px; color: #475569; margin-top: 8px; }
    .item ul { margin-top: 8px; padding-left: 20px; }
    .item li { font-size: 14px; color: #475569; margin-bottom: 4px; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .skill-category h3 { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; }
    .skill-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .skill-bar .name { font-size: 13px; width: 120px; }
    .skill-bar .bar { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .skill-bar .fill { height: 100%; background: #6366f1; border-radius: 3px; }
    .skill-bar .level { font-size: 12px; color: #64748b; width: 35px; }
    @media print { .container { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${profile.full_name || ""}</h1>
      <div class="title">${profile.title || ""}</div>
      <div class="contact">
        ${profile.email ? `<span>${profile.email}</span>` : ""}
        ${profile.phone ? `<span>${profile.phone}</span>` : ""}
        ${profile.location ? `<span>${profile.location}</span>` : ""}
        ${profile.github_url ? `<a href="${profile.github_url}">GitHub</a>` : ""}
        ${profile.linkedin_url ? `<a href="${profile.linkedin_url}">LinkedIn</a>` : ""}
      </div>
    </div>

    ${sections.map((section) => `
      <div class="section">
        <h2>${section.title}</h2>
        ${section.items.map((item) => `
          <div class="item">
            <div class="item-header">
              <h3>${item.title}</h3>
              <span class="date">${item.date_start}${item.date_end ? ` - ${item.date_end}` : ""}</span>
            </div>
            ${item.subtitle ? `<div class="subtitle">${item.subtitle}</div>` : ""}
            ${item.description ? `<p>${item.description}</p>` : ""}
            ${item.highlights?.length ? `<ul>${item.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>` : ""}
          </div>
        `).join("")}
      </div>
    `).join("")}

    ${Object.keys(skillsByCategory).length ? `
      <div class="section">
        <h2>Compétences</h2>
        <div class="skills-grid">
          ${Object.entries(skillsByCategory).map(([cat, catSkills]) => `
            <div class="skill-category">
              <h3>${cat}</h3>
              ${catSkills.map((s) => `
                <div class="skill-bar">
                  <span class="name">${s.name}</span>
                  <div class="bar"><div class="fill" style="width:${s.level}%"></div></div>
                  <span class="level">${s.level}%</span>
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("Erreur generate HTML:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/pdf", async (req, res) => {
  try {
    const { profile, sections, skills } = await getCVData();

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="CV-${(profile.full_name || "cv").replace(/\s+/g, "_")}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(24).fillColor("#6366f1").text(profile.full_name || "", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(14).fillColor("#64748b").text(profile.title || "", { align: "center" });
    doc.moveDown(0.3);

    const contact = [profile.email, profile.phone, profile.location].filter(Boolean).join(" | ");
    doc.fontSize(10).fillColor("#64748b").text(contact, { align: "center" });
    doc.moveDown(0.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#6366f1").lineWidth(2).stroke();
    doc.moveDown(0.5);

    // Sections
    sections.forEach((section) => {
      doc.fontSize(16).fillColor("#6366f1").text(section.title);
      doc.moveDown(0.2);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e2e8f0").lineWidth(1).stroke();
      doc.moveDown(0.3);

      section.items.forEach((item) => {
        if (doc.y > 720) doc.addPage();

        doc.fontSize(12).fillColor("#1a1a2e").text(item.title, { continued: true });
        doc.fontSize(10).fillColor("#64748b").text(`    ${item.date_start}${item.date_end ? ` - ${item.date_end}` : ""}`);
        if (item.subtitle) {
          doc.fontSize(10).fillColor("#6366f1").text(item.subtitle);
        }
        if (item.description) {
          doc.fontSize(10).fillColor("#475569").text(item.description);
        }
        if (item.highlights?.length) {
          item.highlights.forEach((h) => {
            doc.fontSize(10).fillColor("#475569").text(`• ${h}`, { indent: 15 });
          });
        }
        doc.moveDown(0.5);
      });
      doc.moveDown(0.3);
    });

    // Skills
    const skillsByCategory = {};
    skills.forEach((s) => {
      if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
      skillsByCategory[s.category].push(s);
    });

    if (Object.keys(skillsByCategory).length) {
      if (doc.y > 600) doc.addPage();
      doc.fontSize(16).fillColor("#6366f1").text("Compétences");
      doc.moveDown(0.2);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e2e8f0").lineWidth(1).stroke();
      doc.moveDown(0.3);

      Object.entries(skillsByCategory).forEach(([cat, catSkills]) => {
        doc.fontSize(11).fillColor("#1a1a2e").text(cat, { underline: true });
        doc.moveDown(0.2);
        catSkills.forEach((s) => {
          doc.fontSize(10).fillColor("#475569").text(`${s.name} — ${s.level}%`, { indent: 15 });
        });
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (err) {
    console.error("Erreur generate PDF:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
