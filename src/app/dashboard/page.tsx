// src/app/dashboard/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

// Типовете си остават същите
type Control = { id: number; name_bg: string; name_en: string | null }
type Section = { id: number; name_bg: string; name_en: string | null; controls: Control[] }
type Region = { id: number; name_bg: string; name_en: string | null; sections: Section[] }

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const userRole = profileData?.role || 'USER';
  const username = user.user_metadata?.username || user.email;

  // 1. Проверяваме дали изобщо има дефинирани права в user_controls
  const { count: permissionsCount } = await supabase
    .from('user_controls')
    .select('*', { count: 'exact', head: true });

  let regionsQuery = supabase.from('regions').select(`
      id, name_bg, name_en,
      sections (
        id, name_bg, name_en,
        controls ( id, name_bg, name_en )
      )
    `);

  // 2. АКО има дефинирани права, прилагаме стриктния филтър
  if (permissionsCount && permissionsCount > 0) {
    regionsQuery = supabase.from('regions').select(`
      id, name_bg, name_en,
      sections (
        id, name_bg, name_en,
        controls!inner (
          id, name_bg, name_en,
          user_controls!inner(user_id)
        )
      )
    `).eq('sections.controls.user_controls.user_id', user.id);
  }

  // 3. Изпълняваме финалната заявка
  const { data: regionsData, error } = await regionsQuery
    .not('sections', 'is', null)
    .not('sections.controls', 'is', null);


  if (error) {
    console.error('Грешка при извличане на данните за дашборда:', error);
  }

  const regions: Region[] = regionsData || [];

  return <DashboardClient regions={regions} username={username!} email={user.email!} userRole={userRole} />
}