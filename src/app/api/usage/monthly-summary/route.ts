import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { usageLogs, services } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch usage logs for the user and month
    const userUsageLogs = await db.select()
      .from(usageLogs)
      .where(and(
        eq(usageLogs.userId, userId),
        eq(usageLogs.month, month)
      ));

    // Fetch all services
    const allServices = await db.select().from(services);

    // Create a Map of services keyed by id for efficient lookup
    const servicesMap = new Map(allServices.map(s => [s.id, s]));

    // Process usage logs and create summary objects
    const summary = userUsageLogs
      .map(log => {
        const service = servicesMap.get(log.serviceId);
        
        // Skip if service doesn't exist
        if (!service) {
          return null;
        }

        const remainingUsage = Math.max(0, service.monthlyLimit - log.usageCount);
        const percentageUsed = service.monthlyLimit > 0 
          ? Math.round((log.usageCount / service.monthlyLimit) * 100 * 100) / 100
          : 0;

        return {
          serviceId: log.serviceId,
          serviceName: service.name,
          category: service.category,
          monthlyLimit: service.monthlyLimit,
          usageCount: log.usageCount,
          remainingUsage,
          percentageUsed
        };
      })
      .filter(item => item !== null);

    return NextResponse.json(summary, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}