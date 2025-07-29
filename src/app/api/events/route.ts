// Файл: src/app/api/events/route.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  // КОРЕКЦИЯТА Е ТУК:
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Добавяме и set/remove, въпреки че може да не потрябват тук,
        // за пълна съвместимост с изискванията на createServerClient.
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Първо, проверяваме дали потребителят е автентикиран
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Взимаме данните, изпратени от фронтенда
  const { control_id, event_id } = await request.json()

  if (!control_id) {
    return new NextResponse(
      JSON.stringify({ error: 'control_id is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Записваме новото събитие в базата данни
  const { error } = await supabase.from('events').insert({
    event_type: 'CONTROL_CLICKED',
    user_id: user.id,
    control_id: control_id,
    details: { 
      message: `User clicked control.`,
      generated_event_id: event_id 
    },
  })

  if (error) {
    console.error('Error inserting event:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to record event' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Ако всичко е наред, връщаме успешен отговор
  return new NextResponse(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}