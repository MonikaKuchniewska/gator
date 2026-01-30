import { CommandHandler } from "./commands";
import { scrapeFeeds } from "./scrapeFeeds";

export const handlerAgg: CommandHandler = async (_cmdName, ...args) => {
  if (args.length < 1) {
    throw new Error("Usage: agg <time_between_reqs>");
  }

  const durationStr = args[0];

  function parseDuration(str: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = str.match(regex);
    if (!match) throw new Error("Invalid duration string");
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case "ms": return value;
      case "s": return value * 1000;
      case "m": return value * 60 * 1000;
      case "h": return value * 60 * 60 * 1000;
      default: throw new Error("Unknown time unit");
    }
  }

  const timeBetweenRequests = parseDuration(durationStr);
  console.log(`Collecting feeds every ${durationStr}`);

  // start immediately
  scrapeFeeds().catch(err => console.error(err));

  const interval = setInterval(() => {
    scrapeFeeds().catch(err => console.error(err));
  }, timeBetweenRequests);

  // obsługa Ctrl+C
  await new Promise<void>(resolve => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};

