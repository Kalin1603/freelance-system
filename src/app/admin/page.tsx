import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminHomePageClient from './AdminHomePageClient'; // Ще създадем този компонент след малко

// Тази страница вече е Server Component, който извлича данни
export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    }
  });

  // Извличаме няколко неща едновременно
  const [
    { count: userCount },
    { count: controlCount },
    { data: latestEvents },
    { data: latestUsers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('controls').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*, profiles(username)').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const stats = {
    users: userCount ?? 0,
    controls: controlCount ?? 0,
  };

  return (
    <AdminHomePageClient 
      stats={stats} 
      latestEvents={latestEvents || []} 
      latestUsers={latestUsers || []} 
    />
  );
}