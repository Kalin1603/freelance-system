// src/app/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext' 
import LanguageSwitcher from '@/components/LanguageSwitcher' 
import { signUpAction } from '@/app/auth/actions'

export default function RegisterPage() {
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Изчистваме старите грешки

    const formData = new FormData(e.currentTarget);
    const result = await signUpAction(formData);

    // Ако екшънът е върнал обект с грешка
    if (result && result.error) {
      setError(result.error);
      setLoading(false); // Отключваме формата и спираме анимацията
    }
    // Ако няма грешка, значи е имало успешно пренасочване и този код не се достига
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-gray-950/50 dark:border dark:border-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t.registerTitle}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.registerPrompt}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.usernameLabel}</label>
            <input id="username" name="username" type="text" required className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="your_username" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.emailLabel}</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.passwordLabel}</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.confirmPasswordLabel}</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition" disabled={loading} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-4 py-3 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all">
              {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              <span>{loading ? t.loadingRegister : t.registerButton}</span>
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          {t.hasAccount}{' '}
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">{t.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}