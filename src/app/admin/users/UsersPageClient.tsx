// Файл: src/app/admin/users/UsersPageClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import UsersTable from '@/components/UsersTable';
import type { Profile } from '@/types';

type UsersPageClientProps = {
  initialProfiles: Profile[];
  toastMessage?: string;
}

export default function UsersPageClient({ initialProfiles, toastMessage }: UsersPageClientProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        {t.userManagement}
      </h1>
      <UsersTable initialProfiles={initialProfiles} toastMessage={toastMessage} />
    </div>
  );
}