// Файл: src/app/dashboard/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import ControlButton from '@/components/ControlButton'
import { Lightbulb, Clapperboard, Coffee } from 'lucide-react'

// Типовете
type Control = { id: number; name: string }
type Section = { id: number; name: string; controls: Control[] }
type Region = { id: number; name: string; sections: Section[] }

// Помощна функция за икони
const getSectionIcon = (sectionName: string) => {
  switch (sectionName.toLowerCase()) {
    case 'осветление':
      return <Lightbulb className="w-5 h-5 mr-3 text-gray-500" />
    case 'развлечения':
      return <Clapperboard className="w-5 h-5 mr-3 text-gray-500" />
    case 'уреди':
      return <Coffee className="w-5 h-5 mr-3 text-gray-500" />
    default:
      return null
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()

  // КОРЕКЦИЯТА Е ПРИЛОЖЕНА ТУК:
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Заявката за данни
  const { data: regionsData, error } = await supabase
    .from('regions')
    .select(`id, name, sections (id, name, controls (id, name, user_controls!inner(user_id)))`)
    .eq('sections.controls.user_controls.user_id', user.id)
    .not('sections', 'is', null)
    .not('sections.controls', 'is', null)

  if (error) console.error('Грешка при извличане на данните:', error)

  const regions: Region[] = regionsData || []
  const username = user.user_metadata?.username || user.email

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* ЛЯВ SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-600">Добре дошли</h1>
        <nav className="mt-10 flex-grow">
          <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-4">Навигация</h2>
          <ul className="space-y-4">
            {regions.map(region => (
              <li key={region.id}>
                <span className="font-bold text-slate-900 dark:text-slate-50">{region.name}</span>
                <ul className="mt-2 space-y-2 pl-4">
                  {region.sections.map(section => (
                    <li key={section.id}>
                      <a href={`#section-${section.id}`} className="flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {getSectionIcon(section.name)}
                        {section.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{username}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* ДЯСНА ЧАСТ СЪС СЪДЪРЖАНИЕТО */}
      <main className="flex-1 overflow-y-auto p-8" style={{ scrollBehavior: 'smooth' }}>
        {regions.length > 0 ? (
          <div className="space-y-12">
            {regions.map(region => (
              <div key={region.id}>
                {region.sections.map(section => (
                  <section key={section.id} id={`section-${section.id}`} className="mb-12">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                      {section.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {section.controls.map(control => (
                        <ControlButton key={control.id} control={control} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold">Няма Контроли</h2>
            <p className="mt-2 text-slate-500">Все още нямате достъп до контроли. Свържете се с администратор.</p>
          </div>
        )}
      </main>
    </div>
  )
}