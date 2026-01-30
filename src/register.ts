import { CommandHandler } from "./commands";
import { createUser, getUserByName } from "./db/queries/users";
import { setUser } from "./config";

export const handlerRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1) {
    throw new Error("register command requires a username");
  }

  const name = args[0];

  const existing = await getUserByName(name);
  if (existing) {
    throw new Error("User already exists");
  }

  const user = await createUser(name);

  setUser(name);
  console.log("User created");
  console.log(user); 
};
