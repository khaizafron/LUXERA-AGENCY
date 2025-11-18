import path from "node:path";
import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type DbInstance = BetterSQLite3Database<typeof schema>;

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb: DbInstance | undefined;
}

const defaultDbPath = path.resolve(process.cwd(), "luxera.db");
const databaseUrl = process.env.DATABASE_URL ?? `file:${defaultDbPath}`;
const sqlitePath = databaseUrl.replace(/^file:/i, "");

function createDrizzleDb(): DbInstance {
  const sqlite = new Database(sqlitePath);
  return drizzle(sqlite, { schema });
}

export const db: DbInstance =
  globalThis.__drizzleDb ?? createDrizzleDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.__drizzleDb = db;
}
