// Файл: src/components/LanguageSwitcher.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const buttonStyle = "px-3 py-1 text-sm font-medium rounded-md transition-colors"
  const activeStyle = "bg-indigo-600 text-white"
  const inactiveStyle = "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"

  return (
    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
      <button 
        onClick={() => setLanguage('bg')}
        className={`${buttonStyle} ${language === 'bg' ? activeStyle : inactiveStyle}`}
      >
        BG
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className={`${buttonStyle} ${language === 'en' ? activeStyle : inactiveStyle}`}
      >
        EN
      </button>
    </div>
  )
}