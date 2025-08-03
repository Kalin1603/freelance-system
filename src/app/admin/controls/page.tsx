/* eslint-disable @typescript-eslint/no-explicit-any */
// Файл: src/app/admin/controls/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ControlsListPage from './ControlsListPage'; // ✅ ИМПОРТ

type ControlData = { id: number; name_bg: string; name_en: string; sections: any };

export default async function AdminControlsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data } = await supabase
    .from('controls')
    .select(`id, name_bg, name_en, sections ( name_bg, name_en, regions ( name_bg, name_en ) )`)
    .order('id', { ascending: true });

  const controlsData: ControlData[] = (data || []) as any[];

  // ✅ РЕНДИРАМЕ КЛИЕНТСКИЯ КОМПОНЕНТ С ДАННИТЕ
  return <ControlsListPage controls={controlsData} />;
}