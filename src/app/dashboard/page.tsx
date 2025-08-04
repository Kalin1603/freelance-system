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
  const cookieStore = await cookies() // Промених името за по-добра четимост
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profileData, error: profileError } = await supabase
    .from('profiles') // Използваме profiles, за да извлечем ролята на потребителя
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Грешка при извличане на профила на потребителя:', profileError)
  }

  const userRole = profileData?.role || 'USER'

  // Извличаме ВСИЧКИ контроли
  const { data: regionsData, error } = await supabase
    .from('regions') // Използваме regions, за да извлечем всички региони
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
          name_en
        )
      )
    `)
    // Тези два реда са добра практика, за да не получаваш празни региони/секции
    .not('sections', 'is', null) 
    .not('sections.controls', 'is', null);


  if (error) {
    console.error('Грешка при извличане на данните:', error)
  }

  const regions: Region[] = regionsData || []
  const username = user.user_metadata?.username || user.email

  // Подаваме данните на твоя клиентски компонент, който остава НЕПРОМЕНЕН
  return <DashboardClient regions={regions} username={username} userRole={userRole} />
}