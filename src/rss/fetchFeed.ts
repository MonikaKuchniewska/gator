import { XMLParser } from "fast-xml-parser";
import { RSSFeed, RSSItem } from "./types";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  // 1️⃣ Fetch
  const res = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status}`);
  }

  const xml = await res.text();

  // 2️⃣ Parse XML
  const parser = new XMLParser();
  const parsed = parser.parse(xml);

  // 3️⃣ Extract channel
  const channel = parsed?.rss?.channel;
  if (!channel) {
    throw new Error("Invalid RSS feed: missing channel");
  }

  // 4️⃣ Metadata
  const { title, link, description } = channel;
  if (
    typeof title !== "string" ||
    typeof link !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Invalid RSS feed metadata");
  }

  // 5️⃣ Items
  let rawItems: any[] = [];

  if (channel.item) {
    rawItems = Array.isArray(channel.item)
      ? channel.item
      : [channel.item];
  }

  const items: RSSItem[] = [];

  for (const item of rawItems) {
    if (
      typeof item.title !== "string" ||
      typeof item.link !== "string" ||
      typeof item.description !== "string" ||
      typeof item.pubDate !== "string"
    ) {
      continue; // skip invalid item
    }

    items.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  // 6️⃣ Assemble result
  return {
    title,
    link,
    description,
    items,
  };
}
