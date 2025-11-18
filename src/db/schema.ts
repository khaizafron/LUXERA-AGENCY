import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* ---------------------- USERS TABLE ------------------------------- */
export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: text("email_verified"),
    image: text("image"),
    passwordHash: text("password_hash").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_unique").on(table.email),
  }),
);

/* ---------------------- CONTACT FORM TABLE ---------------------- */
export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

/* ---------------------- SUBSCRIPTION PLANS ---------------------- */
export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  features: text("features").notNull(), // store JSON string
  createdAt: text("created_at").notNull(),
});

/* ---------------------- SERVICES TABLE --------------------------- */
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  monthlyLimit: integer("monthly_limit").notNull(),
  createdAt: text("created_at").notNull(),
});

/* ---------------------- USER SUBSCRIPTIONS ----------------------- */
export const userSubscriptions = sqliteTable("user_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  status: text("status").notNull(),
  startedAt: text("started_at").notNull(),
  endsAt: text("ends_at"),
  createdAt: text("created_at").notNull(),
});

/* ---------------------- USAGE LOGS ------------------------------- */
export const usageLogs = sqliteTable("usage_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  serviceId: integer("service_id").notNull(),
  usageCount: integer("usage_count").notNull(),
  month: text("month").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    token: text("token").notNull(),
    createdAt: text("created_at").notNull(),
    expiresAt: text("expires_at").notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("sessions_token_unique").on(table.token),
  }),
);
