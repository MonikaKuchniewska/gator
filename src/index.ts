import { registerCommand, runCommand, CommandsRegistry } from "./commands";
import { handlerLogin } from "./login";
import { handlerRegister } from "./register";
import { handlerReset } from "./reset";
import { handlerUsers } from "./handlerUsers";
import { handlerAgg } from "./agg";
import { handlerAddFeed } from "./addFeed";
import { handlerFeeds } from "./handlerFeeds";
import { handlerFollow } from "./handlerFollow";
import { handlerFollowing } from "./handlerFollowing";
import { middlewareLoggedIn } from "./middlewareLoggin";
import { handlerUnfollow } from "./unfollow";
import { handlerBrowse } from "./handlerBrowse";


async function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", handlerFollow);
  registerCommand(registry, "following", handlerFollowing);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed),);
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", handlerBrowse);

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Not enough arguments provided");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;



  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
  }
  
  process.exit(0);
  
}

main();
