import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    // FORCE absolute path — guaranteed to work on Windows
    url: "file:C:/Users/Dell/LUXERA_AGENCY/luxera.db",
  },
});
