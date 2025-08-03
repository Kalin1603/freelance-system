// Файл: src/app/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trello, PlusCircle, BarChart2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinkClasses = "flex items-center p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";
  const activeLinkClasses = "bg-indigo-100 dark:bg-slate-700 font-semibold text-indigo-600 dark:text-indigo-300";

  const navItems = [
    { href: '/admin/users', icon: Users, label: t.users },
    { href: '/admin/controls', icon: Trello, label: t.controls },
    { href: '/admin/create', icon: PlusCircle, label: t.create },
    { href: '/admin/events', icon: BarChart2, label: t.eventsList },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-indigo-600">{t.adminPanel}</h1>
      <nav className="mt-10">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={`${navLinkClasses} ${pathname.startsWith(item.href) ? activeLinkClasses : ''}`}>
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <Link href="/dashboard" className="flex items-center justify-center text-sm text-indigo-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
        </Link>
      </div>
    </aside>
  );
}