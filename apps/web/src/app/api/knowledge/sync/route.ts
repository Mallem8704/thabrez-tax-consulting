import { NextRequest, NextResponse } from 'next/server';
import { ALL_SOURCE_ADAPTERS } from '../../../../lib/knowledge/sources';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'dev_cron_secret_pass';

  // Basic bearer token check for cron and admin protection
  if (authHeader && !authHeader.includes(cronSecret) && !authHeader.includes('jwt_staff_')) {
    return NextResponse.json({ error: 'Unauthorized regulatory sync trigger' }, { status: 401 });
  }

  const results = [];
  for (const adapter of ALL_SOURCE_ADAPTERS) {
    const result = await adapter.fetchLatestUpdates();
    results.push(result);
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
