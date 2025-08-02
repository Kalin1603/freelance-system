// Файл: src/app/admin/users/[id]/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import EditUserForm from '@/components/EditUserForm'

type EditUserPageProps = { params: { id: string } }
type Control = { id: number; name_bg: string; name_en: string }
type Section = { id: number; name_bg: string; name_en: string; controls: Control[] }
type Region = { id: number; name_bg: string; name_en: string; sections: Section[] }

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } })

  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/')

  const { data: profileToEdit } = await supabase.from('profiles').select('*').eq('id', id).single()
  const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
  
  if (!profileToEdit) notFound()

  const { data: allControlsData } = await supabase.from('regions').select('id, name_bg, name_en, sections(id, name_bg, name_en, controls(id, name_bg, name_en))').order('id', { foreignTable: 'sections', ascending: true })
  const { data: userControlsData } = await supabase.from('user_controls').select('control_id').eq('user_id', id)
  
  const allControls: Region[] = allControlsData || []
  const userControlIds = userControlsData?.map(uc => uc.control_id) || []
  const currentUserRole = currentUserProfile?.role || 'USER'

  async function updateUser(formData: FormData): Promise<{ error?: string }> {
    'use server'

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Не сте вписан.' }
    }

    const id = formData.get('id') as string
    const role = formData.get('role') as string
    const isActive = formData.get('is_active') === 'on'
    const controls = formData.getAll('controls').map(c => parseInt(c as string))
    
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'POWER_ADMIN') {
        return { error: 'Нямате права за тази операция.' }
    }

    const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', id).single()
    if (!targetProfile) {
        return { error: 'Потребителят не е намерен.'}
    }

    if (targetProfile.role === 'POWER_ADMIN' && !isActive) {
      return { error: 'Не може да се деактивира Power Admin акаунт.' }
    }

    if (targetProfile.role === 'POWER_ADMIN' && role !== 'POWER_ADMIN') {
      const { count, error: countError } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'POWER_ADMIN')
      if (countError) {
        return { error: 'Грешка при проверка на правата.' }
      }
      if (count !== null && count <= 1) {
        return { error: 'Не може да се премахне последният Power Admin акаунт.' }
      }
    }

    const { error: profileError } = await supabase.from('profiles').update({ role, is_active: isActive }).eq('id', id)
    if (profileError) {
      console.error('Грешка при актуализация на профил:', profileError)
      return { error: 'Възникна грешка при актуализация на профила.' }
    }

    const { error: deleteError } = await supabase.from('user_controls').delete().eq('user_id', id)
    if (deleteError) {
        console.error('Грешка при изтриване на стари права:', deleteError)
        return { error: 'Възникна грешка при актуализация на правата.' }
    }
    if (controls.length > 0) {
        const newPermissions = controls.map(controlId => ({ user_id: id, control_id: controlId }))
        const { error: insertError } = await supabase.from('user_controls').insert(newPermissions)
        if (insertError) {
            console.error('Грешка при добавяне на нови права:', insertError)
            return { error: 'Възникна грешка при запис на новите права.' }
        }
    }

    revalidatePath(`/admin/users/${id}`)
    revalidatePath('/admin/users')
    redirect('/admin/users')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        Редакция на Потребител: <span className="text-indigo-400">{profileToEdit.username}</span>
      </h1>
      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
        <EditUserForm 
          profile={profileToEdit} 
          currentUserRole={currentUserRole}
          allControls={allControls}
          userControlIds={userControlIds}
          onUpdate={updateUser} 
        />
      </div>
    </div>
  )
}