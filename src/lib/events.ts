/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/events.ts
import type { SupabaseClient } from '@supabase/supabase-js';

type LogEventArgs = {
  supabase: SupabaseClient;
  eventType: string;
  userId: string;
  details?: Record<string, any> | string;
};

export async function logEvent({ supabase, eventType, userId, details }: LogEventArgs) {
  try {
    const { error } = await supabase.from('events').insert({
      event_type: eventType,
      user_id: userId,
      details: details || null,
    });
    if (error) throw error;
  } catch (error) {
    console.error(`Failed to log event "${eventType}":`, error);
  }
}