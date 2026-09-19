import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBankEngine } from '../../../../lib/knowledge/engine';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const documentType = searchParams.get('documentType') || undefined;
  const authority = searchParams.get('authority') || undefined;
  const financialYear = searchParams.get('financialYear') || undefined;
  const status = searchParams.get('status') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const result = KnowledgeBankEngine.queryDocuments({
    q,
    category,
    documentType,
    authority,
    financialYear,
    status,
    limit,
    offset,
  });

  return NextResponse.json({
    data: result.documents,
    total: result.total,
    limit,
    offset,
    query: q,
  });
}
