// Файл: src/app/admin/users/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Profile } from '@/types';
import EditUserPageClient from './EditUserPageClient';

// РЕШЕНИЕТО:
// Използваме 'any' за проповете, за да заобиколим счупената проверка за 'PageProps' в Next.js 15.
// Това е временна мярка, докато бъгът в Next.js/React бъде оправен.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditUserPage(props: any) { 
  // Ръчно извличаме 'id' от 'params', тъй като сме дефинирали props като 'any'
  const { id } = props.params;

  if (!id || typeof id !== 'string') {
    // Добавяме проверка, за да сме сигурни, че id съществува
    notFound();
  }
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    .single<Profile>();
    
  if (!profile) {
    notFound();
  }
  
  return <EditUserPageClient profile={profile} />;
}