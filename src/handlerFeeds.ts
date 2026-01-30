import { CommandHandler } from "./commands";
import { getAllFeeds } from "./db/feeds";

export const handlerFeeds: CommandHandler = async (cmdName, ...args) => {
  const feeds = await getAllFeeds();

  if (!feeds.length) {
    console.log("No feeds found.");
    return;
  }

  feeds.forEach((f) => {
    console.log(`* ${f.feedName}`);
    console.log(`  URL: ${f.feedUrl}`);
    console.log(`  Added by: ${f.userName}`);
    console.log("-------------");
  });
};
