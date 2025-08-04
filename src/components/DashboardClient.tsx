// src/components/DashboardClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/context/LanguageContext";
import ControlButton from "@/components/ControlButton";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Lightbulb, Clapperboard, Coffee, Settings, Menu, User } from "lucide-react";
import Link from "next/link";
import ProfileModal from './ProfileModal';

// Типове
type Control = { id: number; name_bg: string; name_en?: string | null };
type Section = { id: number; name_bg: string; name_en?: string | null; controls: Control[] };
type Region = { id: number; name_bg: string; name_en?: string | null; sections: Section[] };

type DashboardClientProps = {
  regions: Region[];
  username: string;
  email: string;
  userRole: string;
};

export default function DashboardClient(props: DashboardClientProps) {
  const { regions, username, email, userRole } = props;
  const { language, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const getSectionIcon = (sectionName: string) => {
    const props = { className: "w-5 h-5 mr-3 text-slate-500 shrink-0" };
    switch ((sectionName || '').toLowerCase()) {
      case "осветление": case "lighting": return <Lightbulb {...props} />;
      case "развлечения": case "entertainment": return <Clapperboard {...props} />;
      case "уреди": case "appliances": return <Coffee {...props} />;
      default: return null;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">FreelanceSystem</h1>
      </div>
      <nav className="flex-grow p-4 overflow-y-auto">
        {(userRole === "ADMIN" || userRole === "POWER_ADMIN") && (
            <Link href="/admin" className="flex items-center w-full p-3 mb-4 rounded-lg text-left text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-semibold">{t.adminPanel}</span>
            </Link>
        )}
        <h2 className="px-3 mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t.navigation}</h2>
        <ul className="space-y-1">
          {regions.map((region) => (
            <li key={region.id} className="mt-2">
              <span className="px-3 text-sm font-bold text-slate-900 dark:text-slate-50">{language === "en" ? region.name_en || region.name_bg : region.name_bg}</span>
              <ul className="mt-1">
                {region.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#section-${section.id}`} className="flex items-center p-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      {getSectionIcon(language === "en" ? section.name_en || section.name_bg : section.name_bg)}
                      {language === "en" ? section.name_en || section.name_bg : section.name_bg}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
          <button onClick={() => setProfileModalOpen(true)} className="flex items-center w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <User className="w-5 h-5 mr-2 shrink-0 text-slate-500"/>
              <span className="font-medium truncate text-slate-800 dark:text-slate-200">{username}</span>
          </button>
          <div className="mt-2"><LogoutButton logoutText={t.logout} /></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        
        {/* Фиксиран Language Switcher */}
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
              <h2 className="text-lg font-bold text-center w-full lg:text-left lg:w-auto text-slate-800 dark:text-slate-200 ml-2">
                {t.yourControls}
              </h2>
          </header>

          <main className="p-4 sm:p-6 lg:p-8" style={{ scrollBehavior: 'smooth' }}>
            {regions.length > 0 ? (
                <div className="space-y-12">
                  {regions.map((region) => (
                    <div key={region.id}>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                        {t.region}: {language === "en" ? region.name_en || region.name_bg : region.name_bg}
                      </h3>
                      {region.sections.map((section) => (
                        <section key={section.id} id={`section-${section.id}`} className="mb-12">
                          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                            {t.section}: {language === "en" ? section.name_en || section.name_bg : section.name_bg}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {section.controls.map((control) => (
                              <ControlButton key={control.id} id={control.id} name_bg={control.name_bg} name_en={control.name_en || null} />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center mt-20">
                  <h2 className="text-2xl font-bold">{t.noControls.split(".")[0]}</h2>
                  <p className="mt-2 text-slate-500">{t.noControls.split(".")[1]}</p>
                </div>
            )}
          </main>
        </motion.div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        setIsOpen={setProfileModalOpen}
        user={{ email: email, username: username }}
      />
    </>
  );
}