/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/log-control-click/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  // Създаваме сървърен Supabase клиент
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value } });
  
  try {
    // 1. Проверяваме дали потребителят е автентикиран
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2. Взимаме ID-то на контролата от тялото на заявката
    const { controlId } = await request.json();
    if (!controlId) {
      return NextResponse.json({ error: 'Control ID is required' }, { status: 400 });
    }

    // 3. Генерираме ID за събитието
    const generatedEventId = Math.floor(100000 + Math.random() * 900000);

    // 4. Записваме събитието в базата данни
    const { error: insertError } = await supabase
        .from('events')
        .insert({
            event_type: 'CONTROL_CLICKED', // Винаги записваме суровия тип
            user_id: user.id,
            details: {
                message: "User clicked control.",
                control_id: controlId,
                generated_event_id: generatedEventId
            }
        });

    if (insertError) {
        throw insertError; // Хвърляме грешка, за да бъде уловена от catch блока
    }

    // 5. Връщаме успешен отговор с ID-то на събитието
    return NextResponse.json({ success: true, generated_event_id: generatedEventId });

  } catch (error: any) {
    console.error('API Error in log-control-click:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}