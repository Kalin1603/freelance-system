'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат!')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { username: username } },
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      alert('Регистрацията успешна! Моля, впишете се.')
    }
    
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-gray-950/50 dark:border dark:border-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Създай акаунт</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Присъедини се към нас бързо и лесно.
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Потребителско име</label>
            <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="твоето_име" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">И-мейл</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Парола</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Повтори паролата</label>
            <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="••••••••" />
          </div>
          
          {error && <p className="text-sm text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>}
          
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-4 py-3 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all">
              {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              <span>{loading ? 'Създаване...' : 'Регистрирай ме'}</span>
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Вече имаш акаунт?{' '}
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            Вход
          </Link>
        </p>
      </div>
    </div>
  )
}