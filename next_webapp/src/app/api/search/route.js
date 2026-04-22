import { NextResponse } from 'next/server';
import { supabase } from '@/library/supabaseClient';
import { errorResponse } from '@/app/api/library/errorResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? null;
    const title = searchParams.get('title') ?? null;
    const category = searchParams.get('category') ?? null;
    const tag = searchParams.get('tag') ?? null;

    let results;

    if (q) {
      const [{ data: byTitle, error: titleError }, { data: byDesc, error: descError }] =
        await Promise.all([
          supabase.from('usecases').select('*').ilike('title', `%${q}%`),
          supabase.from('usecases').select('*').ilike('description', `%${q}%`),
        ]);

      if (titleError) throw titleError;
      if (descError) throw descError;

      const seen = new Set();
      results = [...(byTitle ?? []), ...(byDesc ?? [])].filter(({ id }) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      // TODO: category filter
      // TODO: tag filter
    } else if (title) {
      const { data, error } = await supabase.from('usecases').select('*').ilike('title', `%${title}%`);
      if (error) throw error;
      results = data ?? [];
    } else {
      const { data, error } = await supabase.from('usecases').select('*');
      if (error) throw error;
      results = data ?? [];
    }

    return NextResponse.json(
      { success: true, data: { results, total: results.length, filters: { q, title, category, tag } } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/search] unexpected error:', error);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
