// Файл: src/app/admin/layout.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Trello, PlusCircle, BarChart2 } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/') // Ако не е вписан, връщаме към вход
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Двойна защита: ако потребителят не е ADMIN, го връщаме към главното табло
  if (profile?.role !== 'ADMIN' && profile?.role !== 'POWER_ADMIN') {
  redirect('/dashboard')
}

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      {/* Админ навигация (Sidebar) */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
        <nav className="mt-10">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/users" className="flex items-center p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Users className="w-5 h-5 mr-3" />
                <span>Потребители</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/controls" className="flex items-center p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Trello className="w-5 h-5 mr-3" />
                <span>Контроли</span>
              </Link>
            </li>
             <li>
              <Link href="/admin/create" className="flex items-center p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <PlusCircle className="w-5 h-5 mr-3" />
                <span>Създай</span>
              </Link>
            </li>
             <li>
              <Link href="/admin/events" className="flex items-center p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <BarChart2 className="w-5 h-5 mr-3" />
                <span>Списък Събития</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
            <Link href="/dashboard" className="text-sm text-center block text-indigo-600 hover:underline">
                Назад към Таблото
            </Link>
        </div>
      </aside>

      {/* Съдържание на админ страниците */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}