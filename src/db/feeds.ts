import { db } from ".";
import { feeds } from "./schema";
import { NewFeed } from "./schema";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(feed: NewFeed) {
  const [created] = await db
    .insert(feeds)
    .values(feed)
    .returning();

  return created;
}

export async function getAllFeeds() {
    return db
      .select({
        feedName: feeds.name,
        feedUrl: feeds.url,
        userName: users.name,
      })
      .from(feeds)
      .leftJoin(users, eq(users.id, feeds.userId));
}

export async function markFeedFetched(feedId: string) {
    const now = new Date();
    await db
      .update(feeds)
      .set({
        lastFetchedAt: now,
        updatedAt: now,
      })
      .where(feeds.id.eq(feedId));
}

export async function getNextFeedToFetch() {
    const [feed] = await db
      .select()
      .from(feeds)
      .orderBy(sql`last_fetched_at NULLS FIRST`) // NULLS FIRST pobiera te, które nigdy nie były fetchowane
      .limit(1);
  
    return feed;
}