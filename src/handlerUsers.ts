import { CommandHandler } from "./commands";
import { getUsers } from "./db/queries/users";
import { readConfig } from "./config";

export const handlerUsers: CommandHandler = async () => {
  const config = readConfig(); // żeby wiedzieć, kto jest current
  const allUsers = await getUsers();

  for (const user of allUsers) {
    const isCurrent = user.name === config.currentUserName;
    console.log(`* ${user.name}${isCurrent ? " (current)" : ""}`);
  }
};
