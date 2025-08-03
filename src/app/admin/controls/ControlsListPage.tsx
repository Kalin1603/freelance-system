/* eslint-disable @typescript-eslint/no-explicit-any */
// Файл: src/app/admin/controls/ControlsListPage.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type ControlData = { id: number; name_bg: string; name_en: string; sections: any };

export default function ControlsListPage({ controls }: { controls: ControlData[] }) {
  const { t, language } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        {t.controlManagement}
      </h1>
      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4">{t.controlNameBG}</th>
              <th className="p-4">{t.controlNameEN}</th>
              <th className="p-4">{t.sections}</th>
              <th className="p-4">{t.regions}</th>
              <th className="p-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((control) => {
              const sectionsList = control.sections ? (Array.isArray(control.sections) ? control.sections : [control.sections]) : [];
              const sectionNames = sectionsList.length > 0 ? sectionsList.map((sec: any) => language === 'en' ? sec.name_en || sec.name_bg : sec.name_bg).join(', ') : t.noSections;
              const regionsList = sectionsList.reduce((acc: any[], sec: any) => {
                if (!sec.regions) return acc;
                const regs = Array.isArray(sec.regions) ? sec.regions : [sec.regions];
                return acc.concat(regs);
              }, []);
              const regionNames = regionsList.length > 0 ? regionsList.map((r: any) => language === 'en' ? r.name_en || r.name_bg : r.name_bg).join(', ') : t.noRegions;

              return (
                <tr key={control.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <td className="p-4 font-medium">{control.name_bg}</td>
                  <td className="p-4 font-medium">{control.name_en}</td>
                  <td className="p-4">{sectionNames}</td>
                  <td className="p-4">{regionNames}</td>
                  <td className="p-4">
                    <Link href={`/admin/controls/${control.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      {t.editLink}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}