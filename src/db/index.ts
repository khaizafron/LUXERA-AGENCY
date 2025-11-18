import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Set it in Railway environment variables.");
}

// Create Neon HTTP client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle database instance
export const db = drizzle(sql, {
  schema,
});
