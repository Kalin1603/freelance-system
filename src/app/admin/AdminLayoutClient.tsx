// src/app/admin/AdminLayoutClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trello, PlusCircle, BarChart2, ArrowLeft, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Ефект, който скрива менюто на малки екрани при първо зареждане
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const navItems = [
    { href: '/admin/users', icon: Users, label: t.users },
    { href: '/admin/controls', icon: Trello, label: t.controls },
    { href: '/admin/create', icon: PlusCircle, label: t.create },
    { href: '/admin/events', icon: BarChart2, label: t.eventsList },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
        <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{t.adminPanel}</h1>
        </div>
        <nav className="flex-grow p-4">
            <ul className="space-y-2">
            {navItems.map(item => (
                <li key={item.href}>
                <Link href={item.href} className={`flex items-center p-3 rounded-lg transition-colors ${pathname.startsWith(item.href) ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                    <item.icon className="w-5 h-5 mr-3 shrink-0" />
                    <span>{item.label}</span>
                </Link>
                </li>
            ))}
            </ul>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
            <Link href="/dashboard" className="flex items-center justify-center w-full p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToDashboard}
            </Link>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-64 h-full shadow-2xl z-40"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ paddingLeft: isSidebarOpen ? '16rem' : '0rem' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative"
        >
          <header className="sticky top-0 flex items-center h-16 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-30">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Menu className="w-6 h-6" />
              </button>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </motion.div>
    </div>
  );
}