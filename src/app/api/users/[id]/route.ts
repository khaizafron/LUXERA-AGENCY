import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// NEXT.JS APP ROUTER PARAMS FIXED (NO PROMISE!)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        { error: "Valid ID is required", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        { error: "Valid ID is required", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, image } = body;

    if (name === undefined && image === undefined) {
      return NextResponse.json(
        {
          error: "At least one field (name or image) must be provided",
          code: "NO_UPDATE_FIELDS",
        },
        { status: 400 }
      );
    }

    const updates: {
      name?: string;
      image?: string | null;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json(
          { error: "Invalid name", code: "INVALID_NAME" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (image !== undefined) {
      if (image !== null && typeof image !== "string") {
        return NextResponse.json(
          { error: "Invalid image field", code: "INVALID_IMAGE" },
          { status: 400 }
        );
      }
      updates.image = image === null ? null : image.trim();
    }

    const updated = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // IMPORTANT: Return updated user for session refresh
    return NextResponse.json(
      { success: true, user: updated[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
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
