// Файл: src/app/admin/controls/[id]/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

// Дефинираме типовете данни, които ще използваме в страницата
// Добавяме и name_en към Section за правилна работа на превода
type Control = { id: number; name_bg: string; name_en: string; section_id: number }
type Section = { id: number; name_bg: string; name_en: string }
type Profile = { id: string; username: string | null }

export default function EditControlPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Създаваме състояния (states) за всички данни, които ще управляваме
  const [control, setControl] = useState<Control | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect се изпълнява веднъж, когато страницата се зареди,
  // за да изтеглим всичката необходима информация от базата данни.
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Изпълняваме всички заявки паралелно за по-бързо зареждане
      const [controlRes, sectionsRes, usersRes, permissionsRes] = await Promise.all([
        supabase.from('controls').select('*').eq('id', id).single(),
        // Искаме и name_en от секциите, за да работи преводът
        supabase.from('sections').select('id, name_bg, name_en').order('name_bg'),
        supabase.from('profiles').select('id, username').order('username'),
        supabase.from('user_controls').select('user_id').eq('control_id', id)
      ]);
      
      setControl(controlRes.data);
      setSections(sectionsRes.data || []);
      setAllUsers(usersRes.data || []);
      setSelectedUserIds(permissionsRes.data?.map(p => p.user_id) || []);
      setLoading(false);
    }
    if (id) {
        fetchData();
    }
  }, [id, supabase]);

  // Тази функция управлява добавянето/премахването на потребители от списъка с избрани
  const handleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Тази функция се изпълнява, когато се натисне бутона "Запази Промените"
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      name_bg: formData.get('name_bg'),
      name_en: formData.get('name_en'),
      section_id: formData.get('section_id'),
      user_ids: selectedUserIds,
    };

    const response = await fetch(`/api/controls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      toast.success(t.controlUpdatedSuccess); 
      router.push('/admin/controls');
      router.refresh(); // Опреснява данните на предишната страница
    } else {
      toast.error(t.controlUpdatedError); 
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-slate-500" />
      </div>
    );
  }
  
  if (!control) {
    return <div>Контролата не е намерена.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        {t.editControlTitle}: <span className="text-indigo-400">{language === 'en' ? control.name_en || control.name_bg : control.name_bg}</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Секция за Основна информация */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{t.mainInfo}</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label htmlFor="name_bg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.nameBG}</label>
              <input 
                id="name_bg" 
                type="text" 
                name="name_bg" 
                defaultValue={control.name_bg} 
                required 
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="name_en" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.nameEN}</label>
              <input 
                id="name_en" 
                type="text" 
                name="name_en" 
                defaultValue={control.name_en || ''} 
                required 
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="section_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.section}</label>
              <select 
                id="section_id" 
                name="section_id" 
                defaultValue={control.section_id} 
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {language === 'en' ? section.name_en || section.name_bg : section.name_bg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Секция за Управление на достъп */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{t.accessManagement}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t.accessManagementDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-2 p-2 rounded-md bg-slate-100 dark:bg-slate-700">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleUserSelection(user.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`user-${user.id}`} className="font-medium text-sm text-slate-800 dark:text-slate-200">{user.username}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-3 flex items-center bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}