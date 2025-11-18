import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { user, userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body.password === "string" ? body.password.trim() : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      emailVerified: null,
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    // Create user
    await db.insert(user).values(newUser);

    // 🔥 AUTO-ADD DEFAULT FREE SUBSCRIPTION
    await db.insert(userSubscriptions).values({
      userId: newUser.id,
      planId: 1, // Free plan ID
      status: "active",
      startedAt: now,
      endsAt: null,
      createdAt: now,
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[local-auth][register]", error);
    return NextResponse.json(
      { error: "Failed to register user." },
      { status: 500 }
    );
  }
}
