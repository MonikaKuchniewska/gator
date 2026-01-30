Blogator CLI

Blogator is a command-line RSS feed manager and aggregator built in TypeScript using Drizzle ORM
 and PostgreSQL. It allows users to register, add feeds, follow/unfollow feeds, scrape RSS posts, and browse posts—all from the terminal.

Features

User registration and login

Add new RSS feeds

Follow and unfollow feeds

Fetch and aggregate RSS posts

Browse latest posts per user

Continuous feed scraping loop with configurable intervals

Fully TypeScript-based CLI with Drizzle ORM

Prerequisites

Before running the CLI, make sure you have the following installed:

Node.js
 (v20+ recommended)

npm

PostgreSQL
 (running instance)

Optional: git for version control

Setup

Clone the repository

git clone <your-repo-url>
cd blogator


Install dependencies

npm install


Set up the database

Create a PostgreSQL database (e.g., blogator) and make note of the connection string.

Configure the database connection

Create a drizzle.config.ts file in the project root with your database configuration. Example:

import { pgTable, drizzle } from "drizzle-orm/pg-core";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/blogator",
});

export const db = drizzle(pool);


Run migrations

Generate migrations for schema changes:

npm run generate


Then apply them:

npm run migrate

CLI Usage

All commands are run via:

npm run start <command> [args]

Available Commands
Command	Description	Arguments
register <username>	Registers a new user	username
login <username>	Sets the current user for the session	username
addfeed <name> <url>	Adds a new feed and automatically follows it	feed name, feed URL
feeds	Lists all feeds in the database	none
follow <url>	Follow a feed by URL	feed URL
unfollow <url>	Unfollow a feed by URL	feed URL
following	Lists all feeds the current user is following	none
agg <duration>	Start continuous feed aggregation	time between requests (e.g., 1m, 30s)
browse [limit]	Display the latest posts for the current user	limit (optional, default: 2)
users	List all registered users	none
reset	Reset the database (dangerous!)	none
Example Workflow
# Reset the database
npm run start reset

# Register users
npm run start register alice
npm run start register bob

# Log in as Alice
npm run start login alice

# Add feeds
npm run start addfeed "TechCrunch" "https://techcrunch.com/feed/"
npm run start addfeed "Hacker News RSS" "https://news.ycombinator.com/rss"

# List all feeds
npm run start feeds

# Follow/Unfollow feeds
npm run start follow "https://news.ycombinator.com/rss"
npm run start unfollow "https://techcrunch.com/feed/"

# Check followed feeds
npm run start following

# Aggregate RSS posts continuously every 1 minute
npm run start agg 1m

# Browse latest posts
npm run start browse 5

Development Notes

Logged-in middleware ensures commands requiring a user are only executed if a user is logged in.

Drizzle ORM is used for all database interactions. Tables include:

users

feeds

feed_follows

posts

The CLI is fully asynchronous and TypeScript-typed.

RSS parsing uses rss-parser
.

Notes / Warnings

Be careful when running reset—it deletes all data!

The aggregator (agg) runs in a continuous loop. Press Ctrl+C to stop it safely.

Avoid setting very short intervals to prevent overloading RSS servers.
