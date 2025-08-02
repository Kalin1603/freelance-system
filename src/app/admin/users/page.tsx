// Файл: src/app/admin/users/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  // Взимаме всички профили от нашата таблица
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*') // Взимаме всички колони

  if (error) {
    console.error("Грешка при извличане на потребители:", error)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Управление на Потребители</h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4">Потребителско име</th>
              <th className="p-4">Роля</th>
              <th className="p-4">ID</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <td className="p-4 font-medium">{profile.username}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.role === 'ADMIN' 
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                    }`}>
                        {profile.role}
                    </span>
                </td>
                <td className="p-4 text-sm text-slate-500 font-mono">{profile.id}</td>
                <td className="p-4">
                  <button className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Променѝ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}