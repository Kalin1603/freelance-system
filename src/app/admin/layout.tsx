// src/app/admin/layout.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logEvent } from '@/lib/events';
import AdminLayoutClient from './AdminLayoutClient'; // Импортираме новия клиентски компонент

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }

  // Записваме събитието само веднъж при достъп до админ панела
  await logEvent({
    supabase,
    eventType: 'Влизане в Административни функции',
    userId: user.id,
    details: 'Admin panel accessed.'
  });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN' && profile?.role !== 'POWER_ADMIN') {
    redirect('/dashboard');
  }

  // Просто извикваме клиентския компонент и му подаваме 'children'
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}