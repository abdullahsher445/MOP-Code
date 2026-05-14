import winston from 'winston';
import { supabase } from '@/library/supabaseClient';

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  meta?: any;
  source?: string;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
  method?: string;
  url?: string;
  status_code?: number;
  response_time?: number;
}

const KNOWN_FIELDS = new Set<string | symbol>([
  'level', 'message', 'source', 'user_id', 'ip_address', 'user_agent',
  'method', 'url', 'status_code', 'response_time',
  // winston internals to exclude
  'timestamp', 'splat', 'service', Symbol.for('level'), Symbol.for('splat'),
]);

class DatabaseTransport extends winston.Transport {
  constructor(opts?: any) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    try {
      const meta: Record<string, unknown> = {};
      for (const key of Object.keys(info)) {
        if (!KNOWN_FIELDS.has(key)) {
          meta[key] = (info as Record<string, unknown>)[key];
        }
      }

      const logEntry: LogEntry = {
        level: info.level,
        message: info.message,
        timestamp: new Date().toISOString(),
        meta,
        source: info.source || 'application',
        user_id: info.user_id,
        ip_address: info.ip_address,
        user_agent: info.user_agent,
        method: info.method,
        url: info.url,
        status_code: info.status_code,
        response_time: info.response_time,
      };

      // Insert log into database
      const { error } = await supabase
        .from('logs')
        .insert([logEntry]);

      if (error) {
        console.error('Failed to insert log into database:', error);
      }
    } catch (error) {
      console.error('Database transport error:', error);
    }

    callback();
  }
}

export default DatabaseTransport;