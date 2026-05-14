import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/library/supabaseClient';
import { getAuthUser } from '@/app/api/library/auth';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const { isAuthenticated, isAdmin } = getAuthUser(request);

    if (!isAuthenticated) {
      logger.warn('Unauthorized access attempt to logs API', {
        source: 'api',
        url: '/api/logs',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdmin) {
      logger.warn('Non-admin access attempt to logs API', {
        source: 'api',
        url: '/api/logs',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');
    const level = url.searchParams.get('level'); // error, warn, info, etc.
    const source = url.searchParams.get('source'); // middleware, api, etc.
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const search = url.searchParams.get('search'); // Search in message
    const userId = parseInt(url.searchParams.get('user_id') ?? '');

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Apply filters
    if (level) {
      query = query.eq('level', level);
    }

    if (source) {
      query = query.eq('source', source);
    }

    if (!Number.isNaN(userId)) {
      query = query.eq('user_id', userId);
    }

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    if (search) {
      query = query.ilike('message', `%${search}%`);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      logger.error(`Database error fetching logs: ${error.message}`, {
        source: 'api',
        url: '/api/logs',
        error: error.message,
      });
      return NextResponse.json(
        { success: false, message: 'Failed to fetch logs' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    logger.info('Admin accessed logs API', {
      source: 'api',
      url: '/api/logs',
      user_id: getAuthUser(request).userId,
      filters: { page, pageSize, level, source, startDate, endDate, search, user_id: !Number.isNaN(userId) ? userId : undefined },
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    logger.error(`Unexpected error in logs API: ${error instanceof Error ? error.message : String(error)}`, {
      source: 'api',
      url: '/api/logs',
    });
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}