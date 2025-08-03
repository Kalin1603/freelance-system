// Файл: src/app/admin/users/[id]/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Profile } from '@/types';
import EditUserPageClient from './EditUserPageClient'; 

type EditUserPageProps = { params: { id: string } };

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, created_at, username, role, is_active')
    .eq('id', id)
    .single() as { data: Profile | null };

  if (!profile) {
    notFound();
  }

  // РЕНДИРАМЕ КЛИЕНТСКИЯ КОМПОНЕНТ С ДАННИТЕ
  return <EditUserPageClient profile={profile} />;
}