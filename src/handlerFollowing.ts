import { CommandHandler } from "./commands";
import { getCurrentUser } from "./db/queries/users";
import { getFeedFollowsForUser } from "./db/queries/feedFollows";

export const handlerFollowing: CommandHandler = async (cmdName, ...args) => {
  const user = await getCurrentUser();
  if (!user) {
    console.log("No current user set");
    return;
  }

  const follows = await getFeedFollowsForUser(user.id);

  if (!follows.length) {
    console.log("No feeds followed yet.");
    return;
  }

  follows.forEach(f => console.log(`* ${f.feedName}`));
};
