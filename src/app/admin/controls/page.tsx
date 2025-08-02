/* eslint-disable @typescript-eslint/no-explicit-any */
// Файл: src/app/admin/controls/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

// Оставяме типа по-прост, за да не влиза TS runtime guard-a в конфликт
type ControlData = {
  id: number
  name_bg: string
  name_en: string
  // може да е масив, единичен обект или null
  sections: any
}

export default async function AdminControlsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { data: controls, error } = await supabase
    .from('controls')
    .select(`
      id,
      name_bg,
      name_en,
      sections (
        name_bg,
        regions (
          name_bg
        )
      )
    `)
    .order('id', { ascending: true })

  if (error) {
    console.error("Грешка при извличане на контроли:", error)
  }

  // Cast-ваме, за да избегнем TS runtime грешки
  const controlsData: ControlData[] = (controls || []) as any[]

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Управление на Контроли
      </h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4">Име на Контрола (BG)</th>
              <th className="p-4">Име на Контрола (EN)</th>
              <th className="p-4">Секции</th>
              <th className="p-4">Региони</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {controlsData.map((control) => {
              // 1) Превръщаме sections в масив, дори ако е единичен обект
              const sectionsList = control.sections
                ? Array.isArray(control.sections)
                  ? control.sections
                  : [control.sections]
                : []

              // 2) Имената на всички секции
              const sectionNames = sectionsList.length > 0
                ? sectionsList.map((sec: any) => sec.name_bg).join(', ')
                : 'Няма секции'

              // 3) Събираме регионите от всяка секция в един масив
              const regionsList = sectionsList.reduce((acc: any[], sec: any) => {
                if (!sec.regions) return acc
                const regs = Array.isArray(sec.regions)
                  ? sec.regions
                  : [sec.regions]
                return acc.concat(regs)
              }, [])

              // 4) Името на регионите
              const regionNames = regionsList.length > 0
                ? regionsList.map((r) => r.name_bg).join(', ')
                : 'Няма региони'

              return (
                <tr
                  key={control.id}
                  className="border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <td className="p-4 font-medium">{control.name_bg}</td>
                  <td className="p-4 font-medium">{control.name_en}</td>

                  <td className="p-4">{sectionNames}</td>
                  <td className="p-4">{regionNames}</td>

                  <td className="p-4">
                    <Link
                      href={`/admin/controls/${control.id}`}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Променѝ
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
