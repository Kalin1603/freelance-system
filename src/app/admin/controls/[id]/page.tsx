// Файл: src/app/admin/controls/[id]/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

type EditControlPageProps = {
  params: {
    id: string // id-то на контролата от URL-а
  }
}

export default async function EditControlPage({ params }: EditControlPageProps) {
  const { id } = params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  // Взимаме данните само за тази контрола
  const { data: control } = await supabase
    .from('controls')
    .select('*')
    .eq('id', id)
    .single()

  // Взимаме всички възможни секции, за да направим падащо меню
  const { data: sections } = await supabase
    .from('sections')
    .select('id, name_bg')
    .order('name_bg')

  if (!control) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Редакция на Контрола: <span className="text-indigo-400">{control.name_bg}</span>
      </h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6 max-w-2xl">
        <form className="space-y-6">
          {/* Поле за име (BG) */}
          <div>
            <label htmlFor="name_bg" className="block text-sm font-medium">Име (BG)</label>
            <input 
              id="name_bg"
              type="text"
              name="name_bg"
              defaultValue={control.name_bg}
              className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm"
            />
          </div>

          {/* Поле за име (EN) */}
          <div>
            <label htmlFor="name_en" className="block text-sm font-medium">Име (EN)</label>
            <input 
              id="name_en"
              type="text"
              name="name_en"
              defaultValue={control.name_en}
              className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm"
            />
          </div>

          {/* Поле за избор на Секция */}
          <div>
            <label htmlFor="section_id" className="block text-sm font-medium">Секция</label>
            <select 
              id="section_id"
              name="section_id"
              defaultValue={control.section_id}
              className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm"
            >
              {sections?.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name_bg}
                </option>
              ))}
            </select>
          </div>

          {/* TODO: Добави списък с потребители, които имат достъп */}

          <div className="pt-4">
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
            >
              Запази Промените
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}