import { dbPromise } from "./database";

export async function createTables() {
  const db = await dbPromise;

  // Create the users table if it doesn't already exist.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);
}
