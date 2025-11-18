// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";

/* -------------------------------
 * ENV VARIABLES (REQUIRED)
 * ------------------------------- */
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET!;
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET!;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? "5", 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000", 10);
const RECAPTCHA_SCORE_THRESHOLD = parseFloat(
  process.env.RECAPTCHA_SCORE_THRESHOLD ?? "0.5"
);

if (!RECAPTCHA_SECRET || !APPS_SCRIPT_URL || !APPS_SCRIPT_SECRET) {
  console.warn(
    "❌ MISSING ENV VARS — RECAPTCHA_SECRET, APPS_SCRIPT_URL, APPS_SCRIPT_SECRET"
  );
}

/* -------------------------------
 * VALIDATION SCHEMA
 * ------------------------------- */
const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  company: z.string().max(100).optional().or(z.literal("")),
  message: z.string().min(1).max(5000),
  recaptchaToken: z.string().min(10),
});

/* -------------------------------
 * RATE LIMITER
 * ------------------------------- */
const RATE_MAP = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const arr = RATE_MAP.get(ip) ?? [];
  const filtered = arr.filter((t) => t > windowStart);

  filtered.push(now);
  RATE_MAP.set(ip, filtered);

  return filtered.length > RATE_LIMIT_MAX;
}

/* -------------------------------
 * SANITIZATION
 * ------------------------------- */
function sanitize(str: string) {
  return str
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/* -------------------------------
 * VERIFY RECAPTCHA (SERVER)
 * ------------------------------- */
async function verifyRecaptcha(token: string, remoteip: string) {
  const body = new URLSearchParams();
  body.append("secret", RECAPTCHA_SECRET);
  body.append("response", token);
  body.append("remoteip", remoteip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body,
  });

  if (!res.ok) return null;

  return res.json().catch(() => null);
}

/* -------------------------------
 * MAIN POST HANDLER
 * ------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // RATE LIMIT
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    // 🔥 PARSE JSON
    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, company, message, recaptchaToken } = parsed.data;

    // 🔥 VERIFY RECAPTCHA
    const rec = await verifyRecaptcha(recaptchaToken, ip);

    if (!rec || rec.success !== true) {
      return NextResponse.json(
        { ok: false, error: "captcha_failed" },
        { status: 403 }
      );
    }

    if (typeof rec.score === "number" && rec.score < RECAPTCHA_SCORE_THRESHOLD) {
      return NextResponse.json(
        { ok: false, error: "captcha_low_score", score: rec.score },
        { status: 403 }
      );
    }

    // 🔥 SANITIZE FINAL DATA PAYLOAD
    const sanitized = {
      name: sanitize(name),
      email: sanitize(email),
      company: sanitize(company ?? ""),
      message: sanitize(message),
      timestamp: new Date().toISOString(),
      ip,
      userAgent: req.headers.get("user-agent") ?? "",
      recaptcha_score: rec.score ?? null,
    };

    const payload = JSON.stringify(sanitized);

    // 🔥 HMAC SIGNATURE
    const hmac = crypto
      .createHmac("sha256", APPS_SCRIPT_SECRET)
      .update(payload)
      .digest("hex");

    // 🔥 SEND TO APPS SCRIPT
    const forwardRes = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-luxera-signature": hmac,
      },
      body: payload,
    });

    const text = await forwardRes.text();

    if (!forwardRes.ok) {
      console.error("❌ Apps Script Error:", forwardRes.status, text);
      return NextResponse.json(
        { ok: false, error: "upstream_failed", detail: text },
        { status: 502 }
      );
    }

    console.log("✅ Apps Script Success:", text);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Contact API Error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error", details: err?.message },
      { status: 500 }
    );
  }
}
