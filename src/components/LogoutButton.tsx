// src/components/LogoutButton.tsx
'use client'

import { useTransition } from 'react';
import { signOutAction } from '@/app/auth/actions'; // Импортираме нашия нов server action
import { LogOut } from 'lucide-react'; // Добавяме иконка за по-добър дизайн

type LogoutButtonProps = {
  logoutText: string
}

export default function LogoutButton({ logoutText }: LogoutButtonProps) {
  // useTransition ни дава isPending, за да знаем кога екшънът работи
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      // Извикваме сървърния екшън
      signOutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending} // Деактивираме бутона, докато екшънът се изпълнява
      className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {/* Показваме иконка и различен текст при зареждане */}
      {isPending ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}
      <span>{isPending ? 'Излизане...' : logoutText}</span>
    </button>
  );
}