import { Router } from "express";
import { query } from "../../db.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = Router();

// Auto-delete archived messages older than 3 days
const cleanupArchived = async () => {
  try {
    await query(
      "DELETE FROM messages WHERE archived = true AND archived_at < NOW() - INTERVAL '3 days'"
    );
  } catch (err) {
    console.error("Erreur cleanup messages:", err);
  }
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    await cleanupArchived();
    const result = await query("SELECT * FROM messages ORDER BY created_at DESC");
    const messages = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      read: row.read,
      archived: row.archived,
      archivedAt: row.archived_at,
      createdAt: row.created_at,
    }));
    res.json(messages);
  } catch (err) {
    console.error("Erreur get messages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/unread-count", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT COUNT(*) FROM messages WHERE read = false AND archived = false");
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Erreur count messages:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    await query("UPDATE messages SET read = true WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur update message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/archive", authenticateToken, async (req, res) => {
  try {
    await query(
      "UPDATE messages SET archived = true, archived_at = NOW() WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur archive message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/unarchive", authenticateToken, async (req, res) => {
  try {
    await query(
      "UPDATE messages SET archived = false, archived_at = NULL WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur unarchive message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await query("DELETE FROM messages WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur delete message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
