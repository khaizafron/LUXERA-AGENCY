import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { user, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body.password === "string" ? body.password.trim() : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const account = existing[0];
    const isValid = await bcrypt.compare(password, account.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

    await db.insert(sessions).values({
      id: randomUUID(),
      userId: account.id,
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    const response = NextResponse.json({
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        image: account.image,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[local-auth][login]", error);
    return NextResponse.json(
      { error: "Failed to login." },
      { status: 500 },
    );
  }
}
