import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.id, Number(id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Internal server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { planId, status, endsAt } = body;

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Validate planId
    if (planId !== undefined) {
      const parsed = Number(planId);
      if (isNaN(parsed)) {
        return NextResponse.json(
          { error: "Invalid plan ID", code: "INVALID_PLAN_ID" },
          { status: 400 }
        );
      }
      updates.planId = parsed;
    }

    // Validate status
    if (status !== undefined) {
      if (!["active", "cancelled", "expired"].includes(status)) {
        return NextResponse.json(
          {
            error: "Status must be one of: active, cancelled, expired",
            code: "INVALID_STATUS",
          },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    // Validate endsAt
    if (endsAt !== undefined) {
      updates.endsAt = endsAt;
    }

    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { error: "No valid fields to update", code: "NO_UPDATES" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(userSubscriptions)
      .set(updates)
      .where(eq(userSubscriptions.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Internal server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(userSubscriptions)
      .where(eq(userSubscriptions.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, deleted: deleted[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
