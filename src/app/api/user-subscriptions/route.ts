import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userSubscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required", code: "MISSING_USER_ID" },
        { status: 400 }
      );
    }

    // Build conditions
    let whereCondition = eq(userSubscriptions.userId, userId);

    if (status) {
      whereCondition = and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, status)
      );
    }

    const results = await db
      .select()
      .from(userSubscriptions)
      .where(whereCondition)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      {
        error:
          "Internal server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, status, startedAt, endsAt } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required", code: "MISSING_USER_ID" },
        { status: 400 }
      );
    }

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required", code: "MISSING_PLAN_ID" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required", code: "MISSING_STATUS" },
        { status: 400 }
      );
    }

    if (!["active", "cancelled", "expired"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value", code: "INVALID_STATUS" },
        { status: 400 }
      );
    }

    if (!startedAt) {
      return NextResponse.json(
        { error: "Started date is required", code: "MISSING_STARTED_AT" },
        { status: 400 }
      );
    }

    const newSubscription = await db
      .insert(userSubscriptions)
      .values({
        userId,
        planId: Number(planId),
        status,
        startedAt,
        endsAt: endsAt || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // ← VERY IMPORTANT
      })
      .returning();

    return NextResponse.json(newSubscription[0], { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      {
        error:
          "Internal server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
