// Трябва да кажем на Next.js, че това е компонент, който ще се изпълнява в браузъра
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase' // Нашият клиент, който създадохме
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault() // Спираме презареждането на страницата при изпращане на формата
    setError(null) // Изчистваме стари грешки

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат!')
      return
    }

    // Използваме готовата функция на Supabase за регистрация
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Тук добавяме допълнителни данни за потребителя, като потребителско име
        data: {
          username: username,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      // Ако регистрацията е успешна, препращаме потребителя към страницата за вход
      router.push('/')
      alert('Регистрацията успешна! Моля, впишете се.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Създаване на Акаунт</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Потребителско Име</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">И-мейл</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Парола</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Повтори Паролата</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Регистрирай Ме
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Назад към Вход
          </Link>
        </div>
      </div>
    </div>
  )
}