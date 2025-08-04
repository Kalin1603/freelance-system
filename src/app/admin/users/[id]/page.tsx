// src/app/admin/users/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Добавяме CookieOptions
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Profile } from '@/types';
import EditUserPageClient from './EditUserPageClient'; 

// Това е правилният начин да се дефинират проповете за динамична,
// асинхронна страница в Next.js App Router
type PageProps = { 
  params: { id: string } 
};

export default async function EditUserPage({ params }: PageProps) {
  const { id } = params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      // Добавяме пълната конфигурация, за да е консистентно
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
      }
    }
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, created_at, username, role, is_active')
    .eq('id', id)
    .single<Profile>(); // Използваме <Profile> за по-добро типизиране

  if (!profile) {
    notFound();
  }

  // Твоята логика си остава същата, защото е перфектна
  return <EditUserPageClient profile={profile} />;
}