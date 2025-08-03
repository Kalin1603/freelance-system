// src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
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

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // --- НОВА ЛОГИКА ЗА ЗАЩИТА НА АДМИН ПАНЕЛА ---
  if (pathname.startsWith('/admin')) {
    // Ако няма потребител, пренасочваме към началната страница
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Ако има потребител, проверяваме ролята му
    const { data: profile } = await supabase
      .from('profiles')
      .select('role') // Взимаме ролята
      .eq('id', user.id)
      .single();

    // Ако профилът не съществува или ролята не е 'admin', пренасочваме
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url)); // Връщаме го в дашборда
    }
  }
  // --- КРАЙ НА НОВАТА ЛОГИКА ---


  // Ако има потребител, проверяваме дали е активен
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (profile && !profile.is_active) {
      await supabase.auth.signOut()
      const redirectUrl = new URL('/?error=account_deactivated', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  // Логиката за пренасочване остава същата
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }
  if (user && (pathname === '/' || pathname.startsWith('/register'))) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

// Обновяваме config, за да включим и админ пътищата
export const config = {
  matcher: ['/', '/register', '/dashboard/:path*', '/admin/:path*'],
}