// src/app/admin/events/page.tsx

import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AppEvent } from '@/types';
import EventsTable from '@/components/EventsTable';
import EventsTableSkeleton from '@/components/EventsTableSkeleton'; // НОВО: Импортираме скелета

// НОВО: Компонентът за извличане и показване на данни е отделен
async function EventsList() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    return <div className="text-red-500">Грешка при зареждане на събитията.</div>;
  }
  
  const userIds = [...new Set(eventsData.map(event => event.user_id))];

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds);

  if (profilesError) console.error("Error fetching profiles:", profilesError);

  const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);

  const events: AppEvent[] = eventsData.map(event => ({
    ...event,
    profiles: profilesMap.get(event.user_id) || null,
  }));

  return <EventsTable events={events} />;
}


export default function EventsPage() {
  return (
    // ПРОМЯНА: Основен контейнер с повече 'padding'
    <div className="p-4 sm:p-6 lg:p-8"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Списък със събития</h1>
      </div>

      {/* НОВО: Suspense граница за показване на скелета при зареждане */}
      <Suspense fallback={<EventsTableSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
}