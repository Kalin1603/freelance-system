// Файл: src/components/UsersTable.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Profile } from '@/app/admin/users/page'
import { deleteCookie } from 'cookies-next'

type UsersTableProps = {
  initialProfiles: Profile[]
  toastMessage?: string
}

export default function UsersTable({ initialProfiles, toastMessage }: UsersTableProps) {
  useEffect(() => {
    if (toastMessage) {
      toast.success(toastMessage)
      deleteCookie('toastMessage', { path: '/' })
    }
  }, [toastMessage])

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="p-4">Потребителско име</th>
            <th className="p-4">Роля</th>
            <th className="p-4">Статус</th>
            <th className="p-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {initialProfiles.map((profile) => (
            <tr key={profile.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
              <td className="p-4 font-medium">{profile.username || 'Няма'}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  profile.role === 'POWER_ADMIN' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                  profile.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 
                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                }`}>
                  {profile.role}
                </span>
              </td>
              <td className="p-4">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    profile.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                 }`}>
                    {profile.is_active ? 'Активен' : 'Деактивиран'}
                 </span>
              </td>
              <td className="p-4">
                <Link href={`/admin/users/${profile.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Промени
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}