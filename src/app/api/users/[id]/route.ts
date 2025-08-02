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

  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // === ПРОВЕРКА НА ПРАВАТА НА АДМИНИСТРАТОРА ===
  const { data: currentAdminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single()
  
  const currentAdminRole = currentAdminProfile?.role

  // Само ADMIN и POWER_ADMIN могат да продължат
  if (currentAdminRole !== 'ADMIN' && currentAdminRole !== 'POWER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // === ВЗИМАНЕ НА ДАННИТЕ ЗА АКТУАЛИЗАЦИЯ ===
  const { role: newRole, is_active: newStatus } = await request.json()
  const dataToUpdate: { role?: string; is_active?: boolean } = {}
  
  if (newRole) dataToUpdate.role = newRole
  if (typeof newStatus === 'boolean') dataToUpdate.is_active = newStatus

  // === ВЗИМАНЕ НА ПРОФИЛА, КОЙТО ЩЕ БЪДЕ ПРОМЕНЯН ===
  const { data: targetUserProfile, error: targetUserError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', targetUserId)
    .single()

  if (targetUserError) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  // ===============================================
  // ===        БИЗНЕС ЛОГИКА И ЗАЩИТА           ===
  // ===============================================
  
  // ПРОВЕРКА 1: Проверяваме дали това е последният POWER_ADMIN
  if (targetUserProfile.role === 'POWER_ADMIN') {
    // Проверката се прави, само ако се опитваме да променим ролята ИЛИ да деактивираме
    if (newRole !== 'POWER_ADMIN' || (typeof newStatus === 'boolean' && !newStatus)) {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }) // head:true е по-бързо, взима само броя
        .eq('role', 'POWER_ADMIN')
      
      if (count === 1) {
        return NextResponse.json({ error: "Cannot remove or deactivate the last Power Admin." }, { status: 403 });
      }
    }
  }

  // ПРОВЕРКА 2: Само POWER_ADMIN може да променя други POWER_ADMIN-и (но не и да ги деактивира)
  if (targetUserProfile.role === 'POWER_ADMIN') {
    if (currentAdminRole !== 'POWER_ADMIN') {
      return NextResponse.json({ error: "Only Power Admins can modify other Power Admins." }, { status: 403 });
    }
    if (typeof newStatus === 'boolean' && !newStatus) {
      return NextResponse.json({ error: "Power Admins cannot be deactivated." }, { status: 403 });
    }
  }

  // ПРОВЕРКА 3: Само POWER_ADMIN може да дава/взима POWER_ADMIN роля
  if (newRole === 'POWER_ADMIN' && currentAdminRole !== 'POWER_ADMIN') {
    return NextResponse.json({ error: "Only Power Admins can assign Power Admin role." }, { status: 403 });
  }

  // ПРОВЕРКА 4: Само POWER_ADMIN може да активира/деактивира ADMIN
  if (targetUserProfile.role === 'ADMIN' && typeof newStatus === 'boolean' && currentAdminRole !== 'POWER_ADMIN') {
    return NextResponse.json({ error: "Only Power Admins can change the status of an Admin." }, { status: 403 });
  }

  // === АКТУАЛИЗАЦИЯ В БАЗАТА ДАННИ ===
  const { error } = await supabase
    .from('profiles')
    .update(dataToUpdate)
    .eq('id', targetUserId)

  if (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: targetUserId }, { status: 200 })
}