import { getCurrentUser } from "./db/queries/users";
import { CommandHandler } from "./commands";
import type { UserCommandHandler } from "./userCommandHandler"; // importuj typ z kroku 1

export const middlewareLoggedIn = (handler: UserCommandHandler): CommandHandler => {
    return async (cmdName: string, ...args: string[]) => {
      const user = await getCurrentUser();
      if (!user) {
        console.log("No user logged in");
        return;
      }
  
      // ✅ Wywołanie UserCommandHandler z zalogowanym userem
      await handler(cmdName, user, ...args);
    };
  };
