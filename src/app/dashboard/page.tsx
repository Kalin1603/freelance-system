// Файл: src/app/dashboard/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient' // Импортираме нашия нов клиентски компонент

// Типовете си остават тук
type Control = { id: number; name_bg: string; name_en: string }
type Section = { id: number; name_bg: string; name_en: string; controls: Control[] }
type Region = { id: number; name_bg: string; name_en: string; sections: Section[] }

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: regionsData, error } = await supabase
    .from('regions')
    .select(`
  id,
  name_bg,
  name_en,
  sections (
    id,
    name_bg,
    name_en,
    controls (
      id,
      name_bg,
      name_en,
      user_controls!inner(user_id)
    )
  )
`)
    .eq('sections.controls.user_controls.user_id', user.id)
    .not('sections', 'is', null)
    .not('sections.controls', 'is', null)

  if (error) console.error('Грешка при извличане на данните:', error)

  const regions: Region[] = regionsData || []
  const username = user.user_metadata?.username || user.email

  // Просто извикваме клиентския компонент и му подаваме данните
  return <DashboardClient regions={regions} username={username} />
}