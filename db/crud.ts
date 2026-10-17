import { dbPromise } from "./database";

export async function insertUser(name: string, email: string) {
  const db = await dbPromise;
  return db.runAsync(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    name,
    email,
  );
}

export async function getUsers() {
  const db = await dbPromise;
  return db.getAllAsync(`SELECT * FROM users`);
}

export async function getUserById(id: number) {
  const db = await dbPromise;
  return db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, id);
}

export async function deleteUserById(id: number) {
  const db = await dbPromise;
  return db.runAsync(`DELETE FROM users WHERE id = ?`, id);
}

export async function updateUserById(id: number, name: string) {
  const db = await dbPromise;
  return db.runAsync(`UPDATE users SET name = ?, WHERE id = ?`, name, id);
}
