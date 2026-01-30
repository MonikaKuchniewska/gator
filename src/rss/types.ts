import { User } from "../db/queries/users";
import { CommandHandler } from "../commands";

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
  };
  
  export type RSSFeed = {
    title: string;
    link: string;
    description: string;
    items: RSSItem[];
  };
  
  export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
  ) => Promise<void>;