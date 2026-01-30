import { CommandHandler } from "./commands";
import { getCurrentUser } from "./db/queries/users";
import { createFeedFollow } from "./db/queries/feedFollows";
import { db } from "./db";
import { feeds } from "./db/schema";
import { eq } from "drizzle-orm";




export const handlerFollow: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1) throw new Error("URL argument is required");

  const url = args[0];

  const user = await getCurrentUser();
  if (!user) throw new Error("No current user set");

  // find feed by URL
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  if (!feed) throw new Error("Feed not found");

  const follow = await createFeedFollow(user.id, feed.id);

  console.log(`User ${follow.userName} now follows feed ${follow.feedName}`);
};
