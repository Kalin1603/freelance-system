// src/app/forgot-password/page.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/app/auth/actions'; // Импортираме екшъна
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      // Показваме успешното съобщение, което ВИНАГИ се връща
      setMessage(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-gray-950/50 dark:border dark:border-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t.forgotPassword}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.forgotPasswordPrompt || 'Въведете имейла си, за да получите линк за нулиране.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.emailLabel}</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              disabled={loading || !!message} // Деактивираме и след успешно изпращане
              className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-700 py-2.5 px-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition disabled:opacity-50" 
            />
          </div>

          {/* Показваме успешно съобщение */}
          {message && <p className="text-sm text-center text-green-500 dark:text-green-400 font-semibold">{message}</p>}
          {/* Показваме грешка */}
          {error && <p className="text-sm text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>}

          <button 
            type="submit" 
            disabled={loading || !!message} // Деактивираме и след успешно изпращане
            className="w-full flex justify-center items-center px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-500 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.sendResetLink || 'Изпрати линк'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            {t.backToLogin || 'Назад към Вход'}
          </Link>
        </p>
      </div>
    </div>
  );
}