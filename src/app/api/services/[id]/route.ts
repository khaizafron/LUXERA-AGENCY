import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query service by ID
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, parseInt(id)))
      .limit(1);

    if (service.length === 0) {
      return NextResponse.json(
        {
          error: 'Service not found',
          code: 'SERVICE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(service[0], { status: 200 });
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

    // Validate ID
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
    const { name, description, category, icon, monthlyLimit } = body;

    // Validate monthlyLimit if provided
    if (monthlyLimit !== undefined) {
      if (typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
        return NextResponse.json(
          {
            error: 'Monthly limit must be a positive number',
            code: 'INVALID_MONTHLY_LIMIT',
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
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

    if (description !== undefined) {
      if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return NextResponse.json(
          {
            error: 'Description must be a non-empty string',
            code: 'INVALID_DESCRIPTION',
          },
          { status: 400 }
        );
      }
      updates.description = description.trim();
    }

    if (category !== undefined) {
      if (!category || typeof category !== 'string' || category.trim().length === 0) {
        return NextResponse.json(
          {
            error: 'Category must be a non-empty string',
            code: 'INVALID_CATEGORY',
          },
          { status: 400 }
        );
      }
      updates.category = category.trim();
    }

    if (icon !== undefined) {
      if (icon !== null && typeof icon !== 'string') {
        return NextResponse.json(
          {
            error: 'Icon must be a string or null',
            code: 'INVALID_ICON',
          },
          { status: 400 }
        );
      }
      updates.icon = icon ? icon.trim() : icon;
    }

    if (monthlyLimit !== undefined) {
      updates.monthlyLimit = monthlyLimit;
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: 'No valid fields provided for update',
          code: 'NO_UPDATES',
        },
        { status: 400 }
      );
    }

    // Update service
    const updated = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          error: 'Service not found',
          code: 'SERVICE_NOT_FOUND',
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Delete service
    const deleted = await db
      .delete(services)
      .where(eq(services.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          error: 'Service not found',
          code: 'SERVICE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Service deleted successfully',
        service: deleted[0],
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