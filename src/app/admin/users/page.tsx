// Файл: src/app/admin/users/page.tsx

import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import UsersTable from '@/components/UsersTable'
import type { Profile } from '@/types'

// ПРОМЯНАТА Е ТУК
async function getProfiles(supabase: SupabaseClient) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Грешка при извличане на потребители:", error)
    return []
  }
  return profiles
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const profiles: Profile[] = await getProfiles(supabase)
  const toastMessage = cookieStore.get('toastMessage')?.value

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Управление на Потребители
      </h1>
      <UsersTable initialProfiles={profiles} toastMessage={toastMessage} />
    </div>
  )
}