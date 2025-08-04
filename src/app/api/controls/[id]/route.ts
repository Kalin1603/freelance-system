// Файл: src/app/api/controls/[id]/route.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const controlId = context.params.id;
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  // Проверяваме дали потребителят е администратор
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'ADMIN' && profile?.role !== 'POWER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Взимаме данните от фронтенда
  const { name_bg, name_en, section_id, user_ids } = await request.json()

  if (!name_bg || !name_en || !section_id) {
    return NextResponse.json({ error: 'Имената и секцията са задължителни' }, { status: 400 })
  }

  // 1. Актуализираме основната информация за контролата
  const { error: updateError } = await supabase
    .from('controls')
    .update({ name_bg, name_en, section_id })
    .eq('id', controlId)

  if (updateError) {
    return NextResponse.json({ error: 'Грешка при актуализация на контролата' }, { status: 500 })
  }

  // 2. Актуализираме правата за достъп
  // Първо изтриваме всички стари права за тази контрола
  await supabase.from('user_controls').delete().eq('control_id', controlId)

  // След това, ако има избрани потребители, добавяме новите права
  if (user_ids && user_ids.length > 0) {
    const rowsToInsert = user_ids.map((userId: string) => ({
      control_id: controlId,
      user_id: userId
    }))
    const { error: permissionsError } = await supabase.from('user_controls').insert(rowsToInsert)
    if (permissionsError) {
      return NextResponse.json({ error: 'Грешка при актуализация на правата' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}