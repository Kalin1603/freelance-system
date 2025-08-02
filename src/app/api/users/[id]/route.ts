// Файл: src/app/api/users/[id]/route.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const targetUserId = params.id
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  // 1. Проверка дали потребителят е вписан
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Взимаме данните за актуализация
  const { role, is_active } = await request.json()
  const dataToUpdate: { role?: string; is_active?: boolean } = {}
  
  if (role) dataToUpdate.role = role
  if (typeof is_active === 'boolean') dataToUpdate.is_active = is_active
  
  // 3. Директно опитваме да актуализираме.
  // RLS в базата данни ще позволи това САМО ако потребителят е ADMIN/POWER_ADMIN.
  const { error } = await supabase
    .from('profiles')
    .update(dataToUpdate)
    .eq('id', targetUserId)

  if (error) {
    console.error('Update error:', error)
    // Грешката от RLS (ако има такава) ще се покаже тук
    return NextResponse.json({ error: error.message || 'Failed to update user profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: targetUserId }, { status: 200 })
}