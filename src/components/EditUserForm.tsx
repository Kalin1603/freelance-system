// Файл: src/components/EditUserForm.tsx
'use client'

import { useState } from 'react'

type Profile = { id: string; username: string | null; role: string; is_active: boolean }
type Control = { id: number; name_bg: string; name_en: string }
type Section = { id: number; name_bg: string; name_en: string; controls: Control[] }
type Region = { id: number; name_bg: string; name_en: string; sections: Section[] }

type EditUserFormProps = {
  profile: Profile
  currentUserRole: string
  allControls: Region[]
  userControlIds: number[]
  onUpdate: (formData: FormData) => Promise<{ error?: string } | void>
}

export default function EditUserForm({ profile, currentUserRole, allControls, userControlIds, onUpdate }: EditUserFormProps) {
  const [role, setRole] = useState(profile.role)
  const [selectedControls, setSelectedControls] = useState<number[]>(userControlIds)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleControlChange = (controlId: number) => {
    setSelectedControls(prev => 
      prev.includes(controlId) 
        ? prev.filter(id => id !== controlId) 
        : [...prev, controlId]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (newPassword && newPassword !== confirmPassword) {
      setError('Паролите не съвпадат!')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.delete('controls')
    selectedControls.forEach(id => formData.append('controls', id.toString()))

    const result = await onUpdate(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Основни данни</h2>
        <div className="space-y-4">
          <input type="hidden" name="id" defaultValue={profile.id} />
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300">Потребителско име</label>
            <input id="username" name="username" type="text" defaultValue={profile.username || ''} readOnly className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent"/>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300">Роля</label>
            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={currentUserRole !== 'POWER_ADMIN'} className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm disabled:opacity-50">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              {currentUserRole === 'POWER_ADMIN' && (
                <option value="POWER_ADMIN">POWER_ADMIN</option>
              )}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Достъп до контроли</h2>
        <div className="space-y-4 max-h-60 overflow-y-auto p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
           {allControls.map(region => (
            <div key={region.id}>
              <h3 className="font-bold">{region.name_bg} / {region.name_en}</h3>
              {region.sections.map(section => (
                <div key={section.id} className="ml-4 mt-2">
                  <h4 className="font-semibold text-sm">{section.name_bg} / {section.name_en}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {section.controls.map(control => (
                      <label key={control.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                        <input type="checkbox" checked={selectedControls.includes(control.id)} onChange={() => handleControlChange(control.id)} className="rounded text-indigo-600"/>
                        <span>{control.name_bg} / {control.name_en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      
      {currentUserRole === 'POWER_ADMIN' && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">Сигурност</h2>
            <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <p className="text-sm text-slate-500">Попълнете полетата, само ако искате да смените паролата.</p>
                <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-slate-300">Нова парола</label>
                    <input id="new_password" name="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-300">Повтори новата парола</label>
                    <input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md dark:bg-slate-800 border-gray-300 dark:border-slate-600 shadow-sm" />
                </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Управление на акаунт</h2>
             <div className="p-4 border border-red-500/50 rounded-lg">
                <h3 className="font-semibold text-red-600 dark:text-red-400">Статус на акаунта</h3>
                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="is_active" defaultChecked={profile.is_active} className="rounded text-indigo-600" />
                        <span>Акаунтът е активен</span>
                    </label>
                </div>
            </div>
          </section>
        </>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Запази Всички Промени</button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}