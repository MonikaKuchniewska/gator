import { db } from ".";
import { posts, feeds } from "./schema";
import { NewPost, Post } from "./schema";
import { eq, desc } from "drizzle-orm"; // do porównań

export async function createPost(post: NewPost): Promise<Post> {
  const [created] = await db
    .insert(posts)
    .values(post)
    .returning();

  return created;
}

export async function getPostsForUser(userId: string, limit: number = 2): Promise<Post[]> {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .innerJoin(feeds, eq(feeds.id, posts.feedId))
    .where(eq(feeds.userId, userId))
    .orderBy(desc(posts.publishedAt)) // <-- poprawione
    .limit(limit);
}

