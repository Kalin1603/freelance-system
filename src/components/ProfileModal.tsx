// src/components/ProfileModal.tsx
'use client'

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, Mail, Key, KeyRound, Loader2 } from 'lucide-react';
import { updateUserProfileAction } from '@/app/auth/actions';
import toast from 'react-hot-toast';

type ProfileModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: { email: string; username: string; };
};

export default function ProfileModal({ isOpen, setIsOpen, user }: ProfileModalProps) {
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
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100">
                  Редакция на профил
                </Dialog.Title>
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X size={20} />
                </button>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Имейл поле */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={user.email} disabled className="w-full rounded-md border-gray-300 bg-gray-100 dark:border-slate-700 dark:bg-slate-700/50 py-2.5 pl-10 pr-4 shadow-sm cursor-not-allowed" />
                  </div>
                  {/* Потребителско име поле */}
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="username" name="username" type="text" defaultValue={user.username} required className="w-full rounded-md border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 py-2.5 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  
                  <hr className="dark:border-slate-600/50"/>
                  
                  {/* Полета за парола */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">Промяна на парола (опционално)</p>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="oldPassword" name="oldPassword" type="password" placeholder="Стара парола" className="w-full rounded-md dark:bg-slate-700 py-2.5 pl-10 pr-4" />
                  </div>
                   <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="newPassword" name="newPassword" type="password" placeholder="Нова парола" className="w-full rounded-md dark:bg-slate-700 py-2.5 pl-10 pr-4" />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="inline-flex justify-center items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60">
                      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      {loading ? 'Запазване...' : 'Запази промените'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}