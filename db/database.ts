import * as SQLite from "expo-sqlite";

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync("appdata.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);

  return db;
}

// Every module importing this promise uses the same initialization.
export const dbPromise = initializeDatabase();
