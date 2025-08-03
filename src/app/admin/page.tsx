// Файл: src/app/admin/page.tsx
'use client'; 

import { useLanguage } from '@/context/LanguageContext';

export default function AdminHomePage() {
  const { t } = useLanguage(); 

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        {t.adminDashboard}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {t.welcomeToAdmin}
      </p>
    </div>
  )
}