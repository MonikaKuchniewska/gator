import { CommandHandler } from "./commands";
import { getCurrentUser } from "./db/queries/users";
import { getPostsForUser } from "./db/posts";

export const handlerBrowse: CommandHandler = async (_cmdName, ...args) => {
  const user = await getCurrentUser();
  if (!user) {
    console.log("No current user logged in");
    return;
  }

  const limit = args[0] ? parseInt(args[0], 10) : 2;
  const posts = await getPostsForUser(user.id, limit);

  if (!posts.length) {
    console.log("No posts available yet.");
    return;
  }

  posts.forEach(p => {
    console.log(`- [${p.title}](${p.url})`);
    if (p.description) console.log(`  ${p.description}`);
    if (p.publishedAt) console.log(`  Published at: ${p.publishedAt}`);
    console.log("---");
  });
};
