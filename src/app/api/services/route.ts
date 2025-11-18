import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { like, or, eq, and } from 'drizzle-orm';
import { ensureBaseDataSeeded } from '@/lib/ensure-base-data';

export async function GET(request: NextRequest) {
  try {
    await ensureBaseDataSeeded();

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = db.select().from(services);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(services.name, `%${search}%`),
          like(services.category, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(services.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { name, description, category, icon, monthlyLimit } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and cannot be empty', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and cannot be empty', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (
      monthlyLimit === undefined ||
      monthlyLimit === null ||
      typeof monthlyLimit !== 'number' ||
      monthlyLimit <= 0
    ) {
      return NextResponse.json(
        {
          error: 'Monthly limit is required and must be > 0',
          code: 'INVALID_MONTHLY_LIMIT',
        },
        { status: 400 }
      );
    }

    const newService = await db
      .insert(services)
      .values({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        icon: icon ? icon.trim() : null,
        monthlyLimit,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newService[0], { status: 201 });
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
