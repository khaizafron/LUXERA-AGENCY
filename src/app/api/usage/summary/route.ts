import { NextRequest, NextResponse } from "next/server";
import { usageLogs, services } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required",
          code: "MISSING_USER_ID",
        },
        { status: 400 }
      );
    }

    const monthParam = searchParams.get("month");
    const month = monthParam || new Date().toISOString().slice(0, 7);

    // 1. Fetch all usage logs for this user + month
    const logs = await db
      .select()
      .from(usageLogs)
      .where(and(eq(usageLogs.userId, userId), eq(usageLogs.month, month)));

    // Convert logs to a map for quick lookup
    const usageMap = new Map(
      logs.map((log) => [log.serviceId, log.usageCount])
    );

    // 2. Fetch all services (we want to return every service!)
    const allServices = await db.select().from(services);

    // 3. Build FULL summary including services with NO usage yet
    const summary = allServices.map((service) => {
      const usageCount = usageMap.get(service.id) ?? 0; // default 0
      const monthlyLimit = service.monthlyLimit ?? 0;

      const remainingUsage = Math.max(0, monthlyLimit - usageCount);
      const percentageUsed =
        monthlyLimit > 0 ? (usageCount / monthlyLimit) * 100 : 0;

      return {
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        monthlyLimit,
        usageCount,
        remainingUsage,
        percentageUsed: Math.round(percentageUsed * 100) / 100,
      };
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("GET usage summary error:", error);
    return NextResponse.json(
      {
        error:
          "Internal server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
