const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "roma_antiga.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const admin = await get("SELECT * FROM usuarios WHERE email = ?", ["admin@roma.com"]);
  if (!admin) {
    await run(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      ["Administrador", "admin@roma.com", "123456"],
    );
  }
}

module.exports = { db, initDatabase, run, get };
