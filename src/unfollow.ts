import { UserCommandHandler } from "./userCommandHandler";
import { CommandHandler, registerCommand } from "./commands";
import { middlewareLoggedIn } from "./middlewareLoggin";
import { deleteFeedFollow } from "./db/queries/feedFollows";

export const handlerUnfollow: UserCommandHandler = async (
  _cmdName,
  user,
  ...args
) => {
  const url = args[0];
  if (!url) throw new Error("usage: unfollow <feed-url>");

  const success = await deleteFeedFollow(user.id, url);

  if (success) {
    console.log(`${user.name} unfollowed feed ${url}`);
  } else {
    console.log(`No feed follow found for URL: ${url}`);
  }
};
