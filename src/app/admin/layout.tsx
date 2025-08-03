// src/app/admin/layout.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr' // Добавяме и CookieOptions
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar';
import { logEvent } from '@/lib/events'; // Импортираме нашия "пощальон"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies() // Променяме името, за да не се бърка с 'cookies' от опциите
  
  // КОРЕКЦИЯ: Трябва да подадем пълната конфигурация за бисквитки,
  // за да може logEvent да работи с валиден Supabase клиент.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  // --- ЗАПИС НА СЪБИТИЕ "Влизане в админ панела" ---
  // Това ще се изпълни само веднъж при зареждане на лейаута
  await logEvent({
    supabase,
    eventType: 'Влизане в Административни функции',
    userId: user.id,
    details: 'Admin panel accessed.'
  });

  // Тази проверка за ролята остава, тя е перфектна
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN' && profile?.role !== 'POWER_ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}