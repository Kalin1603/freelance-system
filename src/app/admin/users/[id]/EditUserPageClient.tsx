// Файл: src/app/admin/users/[id]/EditUserPageClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import EditUserForm from '@/components/EditUserForm';
import { Profile } from '@/types';

type EditUserPageClientProps = {
  profile: Profile;
}

export default function EditUserPageClient({ profile }: EditUserPageClientProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
        {t.editUserTitle}: <span className="text-indigo-400">{profile.username}</span>
      </h1>
      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6">
        <EditUserForm profile={profile} />
      </div>
    </div>
  );
}