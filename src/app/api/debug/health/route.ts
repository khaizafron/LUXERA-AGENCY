import { NextResponse } from 'next/server';

export function GET() {
  try {
    return NextResponse.json({
      ok: true,
      env: {
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV ?? null,
        nextRuntime: process.env.NEXT_RUNTIME ?? null
      }
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
