// Файл: src/app/admin/users/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
// Промяна 1: Вече НЕ импортираме PageProps
import { Profile } from '@/types'; 
import EditUserPageClient from './EditUserPageClient';

// Дефинираме пълен тип, който Next.js очаква
type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Използваме този нов, по-пълен тип
export default async function EditUserPage({ params }: PageProps) {
  const { id } = params;
  
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