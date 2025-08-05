// Файл: src/app/admin/users/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Profile } from '@/types';
import EditUserPageClient from './EditUserPageClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditUserPage(props: any) { 
  const { id } = props.params;

  if (!id || typeof id !== 'string') {
    notFound();
  }
  
  // 'await' е необходим тук, ти беше прав.
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // КОРЕКЦИЯТА Е ТУК: Добавяме try...catch блокове
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Грешката се игнорира, защото сме в Server Component,
            // който не може да променя бисквитки. Middleware ще се погрижи за това.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Грешката се игнорира по същата причина.
          }
        },
      },
    }
  );
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, created_at, username, role, is_active')
    .eq('id', id)
    .single<Profile>();
    
  if (!profile) {
    notFound();
  }
  
  return <EditUserPageClient profile={profile} />;
}