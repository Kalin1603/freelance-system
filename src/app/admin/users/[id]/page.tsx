// Файл: src/app/admin/users/[id]/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

// Тази функция казва на Next.js какви са параметрите на страницата
type EditUserPageProps = {
  params: {
    id: string // id-то ще дойде от URL-а
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

  // Взимаме данните за конкретния профил по неговото ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  // Ако няма такъв профил, показваме страница 404
  if (!profile) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Редакция на потребител: <span className="text-indigo-400">{profile.username}</span>
      </h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
        <form className="space-y-6">
          {/* Поле за Потребителско име (само за четене засега) */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Потребителско име</label>
            <input 
              id="username"
              type="text"
              defaultValue={profile.username || ''}
              readOnly
              className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-0"
            />
          </div>

          {/* Поле за Роля */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium">Роля</label>
            <select 
              id="role"
              defaultValue={profile.role}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

           {/* TODO: Добави секции за контроли, парола и деактивация */}

          <div className="pt-4">
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Запази промените
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}