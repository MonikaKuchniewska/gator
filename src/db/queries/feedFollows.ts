import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";

export type FeedFollow = typeof feedFollows.$inferSelect;

export async function createFeedFollow(userId: string, feedId: string) {
  // insert record
  const [newFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  // select to include names
  const [followWithNames] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .where(eq(feedFollows.id, newFollow.id));

  return followWithNames;
}

export async function getFeedFollowsForUser(userId: string) {
    return db
      .select({
        feedName: feeds.name,
        feedUrl: feeds.url,
        userName: users.name,
      })
      .from(feedFollows)
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .where(eq(feedFollows.userId, userId));
  }

  export async function deleteFeedFollow(userId: string, feedUrl: string) {
    // znajdź feed po URL
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
    if (!feed) return false;
  
    // znajdź powiązanie feed follow
    const [follow] = await db
      .select()
      .from(feedFollows)
      .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id)));
  
    if (!follow) return false;
  
    // usuń powiązanie
    await db
      .delete(feedFollows)
      .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id)));
  
    return true;
  }
  
