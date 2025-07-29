// Файл: src/app/page.tsx

'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    
    if (error) {
      setError('Грешен и-мейл или парола.')
      // Важно: Спираме зареждането при грешка
      setLoading(false) 
    } else {
      // Връщаме router.push(). Middleware вече ще се погрижи за всичко.
      // Няма нужда от setLoading(false) тук, защото страницата ще се смени.
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-gray-950/50 dark:border dark:border-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Добре дошли!</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Впишете се, за да продължите.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">И-мейл</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Парола</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>}
          <div className="flex items-center justify-end text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">Забравена Парола?</a>
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all">
              {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              <span>{loading ? 'Вписване...' : 'Вписване'}</span>
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Нямаш акаунт?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">Регистрирай се</Link>
        </p>
      </div>
    </div>
  )
}