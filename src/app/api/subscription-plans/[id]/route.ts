import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptionPlans } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query plan by ID
    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, parseInt(id)))
      .limit(1);

    // Return 404 if plan not found
    if (plan.length === 0) {
      return NextResponse.json(
        {
          error: 'Subscription plan not found',
          code: 'PLAN_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Parse JSON features field
    const parsedPlan = {
      ...plan[0],
      features: typeof plan[0].features === 'string' ? JSON.parse(plan[0].features) : plan[0].features
    };

    return NextResponse.json(parsedPlan, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
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

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, price, features } = body;

    // Validate at least one field is provided for update
    if (!name && !price && !features) {
      return NextResponse.json(
        {
          error: 'At least one field (name, price, features) must be provided for update',
          code: 'NO_UPDATE_FIELDS',
        },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates: {
      name?: string;
      price?: number;
      features?: string[];
    } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          {
            error: 'Name must be a non-empty string',
            code: 'INVALID_NAME',
          },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return NextResponse.json(
          {
            error: 'Price must be a non-negative number',
            code: 'INVALID_PRICE',
          },
          { status: 400 }
        );
      }
      updates.price = price;
    }

    if (features !== undefined) {
      if (!Array.isArray(features) || features.length === 0) {
        return NextResponse.json(
          {
            error: 'Features must be a non-empty array of strings',
            code: 'INVALID_FEATURES',
          },
          { status: 400 }
        );
      }
      // Validate all features are strings
      if (!features.every((feature) => typeof feature === 'string')) {
        return NextResponse.json(
          {
            error: 'All features must be strings',
            code: 'INVALID_FEATURES',
          },
          { status: 400 }
        );
      }
      updates.features = features;
    }

    // Update the plan
    const updated = await db
      .update(subscriptionPlans)
      .set(updates)
      .where(eq(subscriptionPlans.id, parseInt(id)))
      .returning();

    // Return 404 if plan not found
    if (updated.length === 0) {
      return NextResponse.json(
        {
          error: 'Subscription plan not found',
          code: 'PLAN_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
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

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Delete the plan
    const deleted = await db
      .delete(subscriptionPlans)
      .where(eq(subscriptionPlans.id, parseInt(id)))
      .returning();

    // Return 404 if plan not found
    if (deleted.length === 0) {
      return NextResponse.json(
        {
          error: 'Subscription plan not found',
          code: 'PLAN_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Subscription plan deleted successfully',
        plan: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}