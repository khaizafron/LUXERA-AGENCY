import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptionPlans } from '@/db/schema';
import { like } from 'drizzle-orm';
import { ensureBaseDataSeeded } from '@/lib/ensure-base-data';

export async function GET(request: NextRequest) {
  try {
    await ensureBaseDataSeeded();

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(subscriptionPlans);

    if (search) {
      query = query.where(like(subscriptionPlans.name, `%${search}%`));
    }

    const results = await query.limit(limit).offset(offset);

    // ensure features is parsed JSON
    const parsedResults = results.map((plan) => ({
      ...plan,
      features:
        typeof plan.features === 'string'
          ? JSON.parse(plan.features)
          : plan.features,
    }));

    return NextResponse.json(parsedResults, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, features } = body;

    // VALIDATION
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Invalid price', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features must be an array', code: 'INVALID_FEATURES' },
        { status: 400 }
      );
    }

    if (features.length === 0) {
      return NextResponse.json(
        { error: 'Features cannot be empty', code: 'EMPTY_FEATURES' },
        { status: 400 }
      );
    }

    if (!features.every((f) => typeof f === 'string')) {
      return NextResponse.json(
        { error: 'All features must be strings', code: 'INVALID_FEATURES' },
        { status: 400 }
      );
    }

    // CREATE
    const newPlan = await db
      .insert(subscriptionPlans)
      .values({
        name: name.trim(),
        price,
        features,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newPlan[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
