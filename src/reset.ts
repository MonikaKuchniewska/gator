import { CommandHandler } from "./commands";
import { deleteAllUsers } from "./db/queries/users";

export const handlerReset: CommandHandler = async () => {
  await deleteAllUsers();
  console.log("Database reset successfully");
};
