import { NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIKey } from '../../../lib/openai';

export async function GET() {
  if (!hasOpenAIKey()) {
    return NextResponse.json({ ok: false, error: 'Missing OPENAI_API_KEY (set .env.local)' }, { status: 400 });
  }

  try {
    const client = getOpenAIClient();
    const resp: any = await client.responses.create({
      model: 'gpt-4o-mini',
      input: 'Say hello in one sentence.',
      max_tokens: 50,
    });

    const text = resp.output_text ?? resp.output?.[0]?.content?.[0]?.text ?? '';
    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message ?? String(err) }, { status: 500 });
  }
}
