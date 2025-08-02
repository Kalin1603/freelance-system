// Файл: src/components/EditUserForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'

type EditUserFormProps = {
  profile: Profile
}

export default function EditUserForm({ profile }: EditUserFormProps) {
  const [role, setRole] = useState(profile.role || 'USER')
  const [isActive, setIsActive] = useState(profile.is_active) // НОВО
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const updateData = {
      role: role,
      is_active: isActive
    }

    const response = await fetch(`/api/users/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    setLoading(false) // Преместваме го тук, за да се изпълни винаги

    if (response.ok) {
      // ПРОМЯНАТА Е ТУК:
      // Вместо refresh(), ще направим push(), което ще презареди данните
      // на страницата със списъка с потребители.
      router.push('/admin/users')
      // Показваме съобщение за успех веднага
      toast.success('Профилът е обновен успешно!')
    } else {
      const errorData = await response.json()
      toast.error(`Грешка: ${errorData.error || 'Неуспешна актуализация'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Потребителско име */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">Потребителско Име</label>
        <input id="username" type="text" defaultValue={profile.username || ''} readOnly className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-0" />
      </div>

      {/* Роля */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium">Роля</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="POWER_ADMIN">POWER_ADMIN</option>
        </select>
      </div>

      {/* НОВО: Статус (Активен/Деактивиран) */}
      <div className="flex items-center">
        <input 
          id="is_active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm">
          Активен акаунт
        </label>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="px-4 py-2 flex items-center bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <span>Запази Промените</span>
        </button>
      </div>
    </form>
  )
}