// src/app/admin/users/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Profile, PageProps } from '@/types'; 
import EditUserPageClient from './EditUserPageClient';

export default async function EditUserPage({ params, searchParams }: PageProps<{ id: string }>) {
  const { id } = await params;
  // If you need to use searchParams, you would await it as well:
  // const searchParamsObj = await searchParams || {};
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
      }
    }
  );
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, created_at, username, role, is_active')
    .eq('id', id)
    .single<Profile>();
    
  if (!profile) {
    notFound();
  }
  
  return <EditUserPageClient profile={profile} />;
}