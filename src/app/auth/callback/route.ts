// src/app/auth/callback/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // `next` се използва при потвърждение на имейл, за да знаем къде да върнем потребителя
  const next = searchParams.get('next') || '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
      }
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // Проверяваме дали типът на сесията е за нулиране на парола
    const { data: { session } } = await supabase.auth.getSession();

    if (!error) {
      // Ако е за нулиране на парола, пренасочваме към нашата специална страница
      if (session?.user?.recovery_sent_at) {
         return NextResponse.redirect(`${origin}/reset-password`);
      }
      // В противен случай (напр. потвърждение на имейл)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Пренасочваме към грешка, ако няма код
  return NextResponse.redirect(`${origin}/?error=invalid_auth_code`);
}