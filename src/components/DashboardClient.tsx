// Файл: src/components/DashboardClient.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'
import ControlButton from '@/components/ControlButton'
import LogoutButton from '@/components/LogoutButton'
import BackButton from '@/components/BackButton'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Lightbulb, Clapperboard, Coffee } from 'lucide-react'
import { Settings } from 'lucide-react' 
import Link from 'next/link'

// НОВО: Актуализирани типове, които отразяват структурата на базата данни
type Control = { id: number; name_bg: string; name_en: string }
type Section = { id: number; name_bg: string; name_en: string; controls: Control[] }
type Region = { id: number; name_bg: string; name_en: string; sections: Section[] }

type DashboardClientProps = {
  regions: Region[]
  username: string
  userRole: string
}

export default function DashboardClient({ regions, username, userRole }: DashboardClientProps) {
  const { language, t } = useLanguage()

  const getSectionIcon = (sectionName: string) => {
    // Вече подаваме преведеното име, така че проверката е по-проста
    switch (sectionName.toLowerCase()) {
      case 'осветление':
      case 'lighting':
        return <Lightbulb className="w-5 h-5 mr-3 text-gray-500" />
      case 'развлечения':
      case 'entertainment':
        return <Clapperboard className="w-5 h-5 mr-3 text-gray-500" />
      case 'уреди':
      case 'appliances':
        return <Coffee className="w-5 h-5 mr-3 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-600">FreelanceSystem</h1>

        {/* НОВО: Добавяме бутон за администрация, ако ролята е ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="mt-8">
            <Link href="/admin" className="flex items-center w-full p-3 rounded-lg text-left text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-semibold">Админ Панел</span>
            </Link>
          </div>
        )}

        <nav className="mt-4 flex-grow">
          <h2 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-4">{t.navigation}</h2>
          <ul className="space-y-4">
            {regions.map(region => (
              <li key={region.id}>
                {/* ПРЕВОД: */}
                <span className="font-bold text-slate-900 dark:text-slate-50">
                  {language === 'bg' ? region.name_bg : region.name_en}
                </span>
                <ul className="mt-2 space-y-2 pl-4">
                  {region.sections.map(section => (
                    <li key={section.id}>
                       {/* ПРЕВОД: */}
                      <a href={`#section-${section.id}`} className="flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {getSectionIcon(language === 'bg' ? section.name_bg : section.name_en)}
                        {language === 'bg' ? section.name_bg : section.name_en}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate" title={username}>{username}</p>
                <LanguageSwitcher />
            </div>
             <div className="flex items-center justify-between">
                <BackButton />
                <LogoutButton logoutText={t.logout} />
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8" style={{ scrollBehavior: 'smooth' }}>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
            {t.yourControls}
        </h2>
        {regions.length > 0 ? (
          <div className="space-y-12">
            {regions.map(region => (
              <div key={region.id}>
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    {/* ПРЕВОД: */}
                    {t.region}: {language === 'bg' ? region.name_bg : region.name_en}
                </h3>
                {region.sections.map(section => (
                  <section key={section.id} id={`section-${section.id}`} className="ml-0 md:ml-4 mb-12">
                     {/* ПРЕВОД: */}
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                      {t.section}: {language === 'bg' ? section.name_bg : section.name_en}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {section.controls.map(control => (
                        // ПРЕВОД: Подаваме на ControlButton само името за текущия език
                        <ControlButton 
                          key={control.id} 
                          control={{
                            id: control.id,
                            name: language === 'bg' ? control.name_bg : control.name_en
                          }}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold">{t.noControls.split('.')[0]}</h2>
            <p className="mt-2 text-slate-500">{t.noControls.split('.')[1]}</p>
          </div>
        )}
      </main>
    </div>
  )
}