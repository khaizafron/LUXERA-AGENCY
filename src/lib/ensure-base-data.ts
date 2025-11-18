import { db } from "@/db";
import { services, subscriptionPlans } from "@/db/schema";
import {
  buildServiceSeedRows,
  buildSubscriptionPlanSeedRows,
} from "@/db/seed-data";

let seedPromise: Promise<void> | null = null;

export function ensureBaseDataSeeded() {
  if (!seedPromise) {
    seedPromise = seedDefaults();
  }

  return seedPromise;
}

async function seedDefaults() {
  try {
    const existingService = await db
      .select({ id: services.id })
      .from(services)
      .limit(1);

    if (existingService.length === 0) {
      await db.insert(services).values(buildServiceSeedRows());
    }

    const existingPlan = await db
      .select({ id: subscriptionPlans.id })
      .from(subscriptionPlans)
      .limit(1);

    if (existingPlan.length === 0) {
      await db.insert(subscriptionPlans).values(
        buildSubscriptionPlanSeedRows(),
      );
    }
  } catch (error) {
    console.error("[ensureBaseDataSeeded] Failed to seed defaults", error);
  }
}
