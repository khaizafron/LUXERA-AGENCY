import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sessions, user } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getSessionRecord(token: string) {
  const records = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
    .from(sessions)
    .innerJoin(user, eq(user.id, sessions.userId))
    .where(eq(sessions.token, token))
    .limit(1);

  return records[0];
}

export async function GET() {
  try {
    // FIXED: cookies() must be awaited in Next.js 15
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const record = await getSessionRecord(token);

    if (!record) {
      cookieStore.delete("auth_token");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (new Date(record.expiresAt) < new Date()) {
      await db.delete(sessions).where(eq(sessions.id, record.sessionId));
      cookieStore.delete("auth_token");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: record.user }, { status: 200 });
  } catch (error) {
    console.error("[local-auth][session][GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch session." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[local-auth][session][DELETE]", error);
    return NextResponse.json(
      { error: "Failed to sign out." },
      { status: 500 }
    );
  }
}
