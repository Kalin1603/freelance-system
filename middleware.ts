// Файл: middleware.ts

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Взимаме потребителя
  const { data: { user } } = await supabase.auth.getUser()

  // ВРЪЩАМЕ ЛОГИКАТА ЗА ПРЕНАСОЧВАНЕ ТУК
  const { pathname } = request.nextUrl

  // Ако потребителят НЕ е вписан и се опитва да достъпи защитена страница
  if (!user && pathname.startsWith('/dashboard')) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // Ако потребителят Е вписан и се опитва да достъпи страницата за вход/регистрация
  if (user && (pathname === '/' || pathname.startsWith('/register'))) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  // Ако няма причина за пренасочване, просто връщаме отговора
  return response
}

// Връщаме стария, по-прост matcher, който е по-подходящ за тази логика
export const config = {
  matcher: ['/', '/register', '/dashboard/:path*'],
}