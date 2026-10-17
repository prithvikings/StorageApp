import { dbPromise } from "./database";

// Define the structure of a user record.
export type User = {
  id: number;
  name: string;
  email: string;
};

// Insert a new user into the database.
export async function insertUser(name: string, email: string) {
  const db = await dbPromise;

  return db.runAsync(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    name,
    email,
  );
}

// Retrieve all users.
export async function getUsers(): Promise<User[]> {
  const db = await dbPromise;

  return db.getAllAsync<User>(
    "SELECT id, name, email FROM users ORDER BY id DESC",
  );
}

// Retrieve one user by ID.
export async function getUserById(id: number): Promise<User | null> {
  const db = await dbPromise;

  return db.getFirstAsync<User>(
    "SELECT id, name, email FROM users WHERE id = ?",
    id,
  );
}

// Delete a user by ID.
export async function deleteUserById(id: number) {
  const db = await dbPromise;

  return db.runAsync("DELETE FROM users WHERE id = ?", id);
}

// Update a user's name by ID.
export async function updateUserById(id: number, name: string) {
  const db = await dbPromise;

  return db.runAsync("UPDATE users SET name = ? WHERE id = ?", name, id);
}
