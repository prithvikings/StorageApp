import { dbPromise } from "./database";

export async function createTables() {
  const db = await dbPromise;

  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )`,
  );
}
