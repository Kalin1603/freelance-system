// Файл: src/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext' // НОВО

export default function BackButton() {
  const router = useRouter()
  const { t } = useLanguage() // НОВО

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {/* НОВО: Използваме превод */}
      {t.back}
    </button>
  )
}