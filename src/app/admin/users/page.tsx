// Файл: src/app/admin/users/page.tsx
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Profile } from '@/types';
import UsersPageClient from './UsersPageClient'; 

async function getProfiles(supabase: SupabaseClient): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Грешка при извличане на потребители:", error);
    return [];
  }
  return data || [];
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const profiles = await getProfiles(supabase);
  const toastMessage = cookieStore.get('toastMessage')?.value;

  // РЕНДИРАМЕ КЛИЕНТСКИЯ КОМПОНЕНТ С ДАННИТЕ
  return <UsersPageClient initialProfiles={profiles} toastMessage={toastMessage} />;
}