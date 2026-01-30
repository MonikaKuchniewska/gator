import { UserCommandHandler } from "./userCommandHandler";
import { getCurrentUser } from "./db/queries/users";
import { createFeed } from "./db/feeds";
import { printFeed } from "./print";
import { createFeedFollow } from "./db/queries/feedFollows";


export const handlerAddFeed: UserCommandHandler = async (
    _cmdName,
    user,
    ...args
  ) => {
    const name = args[0];
    const url = args[1];
  

  if (!name || !url) {
    throw new Error("usage: addfeed <name> <url>");
  }


  const feed = await createFeed({
    name,
    url,
    userId: user.id,
  });

  printFeed(feed, user);

  await createFeedFollow(user.id, feed.id);
  console.log(`User ${user.name} now follows feed ${feed.name}`);
};

