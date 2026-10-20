const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

// Keeps only http(s) links, so a stored "javascript:" URL never becomes a clickable href.
export const safeUrl = (value) => (/^https?:\/\//i.test(value || "") ? escapeHtml(value) : "");
