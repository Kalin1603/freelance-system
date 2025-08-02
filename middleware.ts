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

  // Ако има потребител, проверяваме дали е активен
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    // АКО ПОТРЕБИТЕЛЯТ НЕ Е АКТИВЕН
    if (profile && !profile.is_active) {
      // Излизаме го от системата
      await supabase.auth.signOut()
      // Пренасочваме го към вход с съобщение за грешка
      const redirectUrl = new URL('/?error=account_deactivated', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  // Логиката за пренасочване остава същата
  if (!user && pathname.startsWith('/dashboard')) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }
  if (user && (pathname === '/' || pathname.startsWith('/register'))) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/', '/register', '/dashboard/:path*'],
}