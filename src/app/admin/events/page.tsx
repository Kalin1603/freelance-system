// src/app/admin/events/page.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppEvent } from '@/types';
import EventsTable from '@/components/EventsTable';
import BackButton from '@/components/BackButton';

export default async function EventsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/'); 
  }

  // 1. Извличаме всички събития
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    // Връщаме празен масив при грешка
    return <EventsTable events={[]} />;
  }
  
  // 2. Събираме всички уникални user_id-та от събитията
  const userIds = [...new Set(eventsData.map(event => event.user_id))];

  // 3. Извличаме всички профили, които съвпадат с тези ID-та
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  // 4. Създаваме "карта" на профилите за бърз достъп (id -> username)
  const profilesMap = new Map(
    profilesData?.map(profile => [profile.id, profile]) || []
  );

  // 5. Комбинираме данните: добавяме обекта 'profiles' към всяко събитие
  const events: AppEvent[] = eventsData.map(event => ({
    ...event,
    profiles: profilesMap.get(event.user_id) || null,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Списък със събития</h1>
        <BackButton />
      </div>
      
      {/* Подаваме финално комбинираните данни */}
      <EventsTable events={events} />
    </div>
  );
}