// Файл: src/components/EditUserForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'
import { useLanguage } from '@/context/LanguageContext' 

type EditUserFormProps = {
  profile: Profile
}

export default function EditUserForm({ profile }: EditUserFormProps) {
  const { t } = useLanguage(); 
  const [role, setRole] = useState(profile.role || 'USER');
  const [isActive, setIsActive] = useState(profile.is_active);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updateData = { role: role, is_active: isActive };
    
    const response = await fetch(`/api/users/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    
    setLoading(false);
    
    if (response.ok) {
      // Използваме преведения текст за съобщението
      toast.success(t.userUpdatedSuccess);
      router.push('/admin/users');
      router.refresh(); // Опреснява данните на предишната страница
    } else {
      const errorData = await response.json();
      // Използваме преведения текст за грешката
      toast.error(`${t.userUpdatedError}: ${errorData.error || 'Unknown error'}`);
    }
  };

  return (
    // Обединено в една форма за по-коректна семантика
    <form onSubmit={handleSubmit} className="divide-y divide-slate-200 dark:divide-slate-700">
      {/* Секция за Роля */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-lg">{t.role}</h3>
          <p className="text-sm text-slate-500">{t.roleDescription}</p>
        </div>
        <div className="md:col-span-2">
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} className="block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="POWER_ADMIN">POWER_ADMIN</option>
          </select>
        </div>
      </div>

      {/* Секция за Статус */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
         <div className="md:col-span-1">
          <h3 className="font-semibold text-lg">{t.accountStatus}</h3>
          <p className="text-sm text-slate-500">{t.accountStatusDescription}</p>
        </div>
        <div className="md:col-span-2">
          <div className={`p-4 rounded-lg flex items-center justify-between ${isActive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className={`font-medium ${isActive ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {/* ПРЕВЕДЕНО */}
              {isActive ? t.accountIsActive : t.accountIsDeactivated}
            </p>
            <button
              type="button" // Важно: този бутон не трябва да изпраща формата
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm ${isActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {isActive ? t.deactivate : t.activate}
            </button>
          </div>
        </div>
      </div>
      
      {/* Бутон за Запазване */}
      <div className="pt-8 flex justify-end">
        <button 
          type="submit" // Този бутон изпраща формата
          disabled={loading}
          className="px-6 py-3 flex items-center bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
        >
          {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
          <span>{t.saveChanges}</span>
        </button>
      </div>
    </form>
  )
}