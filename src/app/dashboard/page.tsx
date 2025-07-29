// Файл: src/app/dashboard/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const cookieStore = await cookies()

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

  // Тази защита е ключова. Ако няма потребител, връщаме към входа.
  if (!user) {
    redirect('/')
  }

  const username = user.user_metadata?.username || user.email

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
          Добре дошъл, <span className="text-indigo-600 dark:text-indigo-400">{username}!</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Това е твоето главно табло.
        </p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}