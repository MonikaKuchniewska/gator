import { setUser } from "./config";
import { CommandHandler } from "./commands";
import { getUserByName } from "./db/queries/users";

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1) {
    throw new Error("login command requires a username");
  }

  const name = args[0];
  const user = await getUserByName(name);

  if (!user) {
    throw new Error("User does not exist");
  }

  setUser(name);
  console.log(`User set to ${name}`);
};
