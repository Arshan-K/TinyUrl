import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql = fs.readFileSync("migrations/create_links.sql", "utf-8");

  try {
    console.log("Running migration...");
    await pool.query(sql);
    console.log("Migration completed.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

run();
