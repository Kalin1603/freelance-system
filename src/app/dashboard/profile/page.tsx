// src/app/dashboard/profile/page.tsx

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClientForm from './ProfileClientForm';
import BackButton from '@/components/BackButton';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    } 
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile for edit:", error);
  }

  const currentUser = {
    email: user.email!,
    username: profile?.username || user.email || '', // Fallback, ако няма username
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-slate-800 dark:text-slate-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Моят Профил</h1>
        <BackButton />
      </div>
      <div className="max-w-2xl bg-white dark:bg-slate-800/50 rounded-lg shadow-lg p-6 sm:p-8">
        <ProfileClientForm user={currentUser} />
      </div>
    </div>
  );
}