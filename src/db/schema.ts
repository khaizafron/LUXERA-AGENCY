import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

/* ---------------------- USERS TABLE ------------------------------- */
export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "string" }),
    image: text("image"),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_unique").on(table.email),
  })
);

/* ---------------------- CONTACT FORM TABLE ---------------------- */
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

/* ---------------------- SUBSCRIPTION PLANS ---------------------- */
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  features: jsonb("features").notNull(), // store JSON structure properly (not string)
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

/* ---------------------- SERVICES TABLE --------------------------- */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  monthlyLimit: integer("monthly_limit").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

/* ---------------------- USER SUBSCRIPTIONS ----------------------- */
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),

  planId: integer("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id),

  status: varchar("status", { length: 50 }).notNull(),

  startedAt: timestamp("started_at", { mode: "string" }).defaultNow().notNull(),
  endsAt: timestamp("ends_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

/* ---------------------- USAGE LOGS ------------------------------- */
export const usageLogs = pgTable("usage_logs", {
  id: serial("id").primaryKey(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),

  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),

  usageCount: integer("usage_count").notNull(),

  month: varchar("month", { length: 20 }).notNull(),

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

/* ---------------------- SESSIONS TABLE --------------------------- */
export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),

    token: varchar("token", { length: 255 }).notNull(),

    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("sessions_token_unique").on(table.token),
  })
);
