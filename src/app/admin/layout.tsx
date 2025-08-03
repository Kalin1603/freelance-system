// Файл: src/app/admin/layout.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'; // ✅ ИМПОРТИРАМЕ НОВИЯ КОМПОНЕНТ

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
    redirect('/')
  }

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
      {/* ✅ ИЗПОЛЗВАМЕ ПРЕВОДИМИЯ КЛИЕНТСКИ КОМПОНЕНТ */}
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}