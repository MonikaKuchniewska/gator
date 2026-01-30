import { db } from "..";
import { users } from "../schema";
import { readConfig } from "../../config";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
  const [user] = await db
    .insert(users)
    .values({ name })
    .returning();

  return user;
}

export async function getUserByName(name: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.name, name));

  return user ?? null;
}

export async function getCurrentUser() {
  const config = readConfig();

  if (!config.currentUserName) {
    return null;
  }

  return getUserByName(config.currentUserName);
}

export async function getUsers() {
  return db.select().from(users);
}

export async function deleteAllUsers() {
  await db.delete(users);
}

  
