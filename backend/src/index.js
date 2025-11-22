require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const corsMiddleware = require("./middlewares/cors");

const linksRouter = require('./routes/links');
const db = require('./db/db');
const app = express();

app.use(corsMiddleware);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use(linksRouter);


app.get("/healthz", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    node_version: process.version,
    memory: process.memoryUsage(),
    platform: process.platform,
    cpu_arch: process.arch,
  });
});

app.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const q = `
    UPDATE links
    SET click_count = click_count + 1, last_clicked = now()
    WHERE code = $1
    RETURNING original_url
    `;
    const { rows } = await db.query(q, [code]);
    
    if (rows.length === 0) {
      return res.status(404).send('Not found');
    }
    
    return res.redirect(302, rows[0].original_url);
  } catch (err) {
    console.error('Redirect error', err);
    return res.status(500).send('Server error');
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
