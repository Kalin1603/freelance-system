/* eslint-disable @typescript-eslint/no-explicit-any */
// Файл: src/app/admin/users/[id]/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import EditUserForm from '@/components/EditUserForm'
import { Profile } from '@/types' // НОВО: Импортираме централизирания тип

type EditUserPageProps = {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  // НОВО: Извличаме ВСИЧКИ полета, които са в типа Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, created_at, username, role, is_active')
    .eq('id', id)
    .single() as { data: Profile | null; error: any }

  if (!profile) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Редакция на Потребител: <span className="text-indigo-400">{profile.username}</span>
      </h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
        <EditUserForm profile={profile} />
      </div>
    </div>
  )
}