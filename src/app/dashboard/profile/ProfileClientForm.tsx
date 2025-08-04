// src/app/dashboard/profile/ProfileClientForm.tsx
'use client'

import { useState } from 'react';
import { updateUserProfileAction } from '@/app/auth/actions';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type UserProfile = {
  email: string;
  username: string;
}

export default function ProfileClientForm({ user }: { user: UserProfile }) {
  const [username, setUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfileAction(formData);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success('Профилът е обновен успешно!');
      setNewPassword(''); // Изчистваме полето за парола
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">И-мейл (не може да се променя)</label>
        <input 
          id="email" 
          type="email" 
          value={user.email} 
          disabled 
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 dark:border-slate-700 dark:bg-slate-700/50 py-2.5 px-4 shadow-sm cursor-not-allowed" 
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Потребителско име</label>
        <input 
          id="username" 
          name="username" 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          disabled={loading} 
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
        />
      </div>
      <hr className="border-slate-200 dark:border-slate-600/50" />
      <div className="space-y-1">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Нова парола</label>
        <p className="text-xs text-gray-500 dark:text-gray-400">Оставете празно, ако не желаете промяна.</p>
        <input 
          id="newPassword" 
          name="newPassword" 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          disabled={loading} 
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
        />
      </div>
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
          {loading ? 'Запазване...' : 'Запази промените'}
        </button>
      </div>
    </form>
  );
}