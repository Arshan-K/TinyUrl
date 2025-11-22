const express = require('express');
const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const router = express.Router();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function normalizeUrl(raw) {
  if (!raw) return null;
  try {
    return new URL(raw).toString();
  } catch {
    try {
      return new URL("https://" + raw).toString();
    } catch {
      return null;
    }
  }
}

function generateCode(len = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

router.post('/api/links', async (req, res) => {
  const { url: rawUrl, code: rawCode } = req.body || {};
  const url = normalizeUrl(rawUrl);

  if (!url) return res.status(400).json({ error: 'Invalid URL' });

  const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
  if (!urlPattern.test(rawUrl))
    return res.status(400).json({ error: "Invalid URL Format" });

  let code = rawCode?.trim();
  if (code) {
    if (!/^[A-Za-z0-9_-]{3,64}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid custom code' });
    }

    const exists = await db.query('SELECT 1 FROM links WHERE code=$1', [code]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Code already exists" });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      code = generateCode(7);
      const exists = await db.query('SELECT 1 FROM links WHERE code=$1 LIMIT 1', [code]);
      if (exists.rows.length === 0) break;
      code = null;
    }
    if (!code) code = generateCode(10);
  }

  try {
    const id = uuidv4();
    const q = `
      INSERT INTO links(id, code, original_url)
      VALUES ($1, $2, $3)
      RETURNING id, code, original_url, click_count, created_at, last_clicked
    `;
    const { rows } = await db.query(q, [id, code, url]);
    const row = rows[0];
    row.shortUrl = `${BASE_URL}/${row.code}`;

    return res.status(201).json(row);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: "Code already exists" });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/links', async (req, res) => {
  try {
    const q = `
      SELECT id, code, original_url, click_count, created_at, last_clicked
      FROM links
      ORDER BY created_at DESC
    `;
    const { rows } = await db.query(q);

    const output = rows.map(r => ({
      ...r,
      shortUrl: `${BASE_URL}/${r.code}`
    }));

    return res.json(output);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/api/links/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await db.query('DELETE FROM links WHERE id=$1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/links/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const q = `
      SELECT id, code, original_url, click_count, created_at, last_clicked
      FROM links
      WHERE id = $1::uuid
      LIMIT 1
    `;

    const { rows } = await db.query(q, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    const row = rows[0];
    row.shortUrl = `${process.env.BASE_URL}/${row.code}`;

    return res.json(row);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
