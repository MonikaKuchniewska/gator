import { User } from "./db/queries/users";

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
  ) => Promise<void>;