import Parser from "rss-parser";
import { getNextFeedToFetch, markFeedFetched } from "./db/feeds";
import { createPost } from "./db/posts";

const parser = new Parser();

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch.");
    return;
  }

  console.log(`Fetching feed: ${feed.name} (${feed.url})`);

  try {
    const parsedFeed = await parser.parseURL(feed.url);

    for (const item of parsedFeed.items) {
      const title = item.title ?? "(no title)";
      const url = item.link ?? "(no url)";
      const description = item.contentSnippet ?? item.content ?? null;

      let publishedAt: Date | null = null;
      if (item.pubDate) {
        publishedAt = new Date(item.pubDate);
        if (isNaN(publishedAt.getTime())) {
          publishedAt = null; // nieprawidłowy format daty
        }
      }

      await createPost({
        title,
        url,
        description,
        publishedAt,
        feedId: feed.id,
      });
    }
  } catch (err) {
    console.error(`Failed to fetch feed ${feed.url}:`, err);
  }

  await markFeedFetched(feed.id);
}

