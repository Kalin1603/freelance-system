// src/components/EventsTable.tsx

'use client';

import { AppEvent } from "@/types";

// ====================================================================
// НОВО: "Преводач" за типовете събития
// Взима 'CONTROL_CLICKED' и връща 'Натискане на Контрола'
// ====================================================================
function translateEventType(eventType: AppEvent['event_type'] | string): string {
    switch (eventType) {
        case 'CONTROL_CLICKED':
            return 'Натискане на Контрола';
        case 'SIGN_IN':
            return 'Вписване';
        case 'SIGN_UP':
            return 'Регистрация';
        case 'SIGN_OUT':
            return 'Изход';
        case 'PASSWORD_CHANGE':
            return 'Смяна на Парола';
        // Добави другите типове, когато започнеш да ги записваш
        default:
            // Ако типът е непознат или вече е на български, показваме го както е
            return eventType;
    }
}

// ====================================================================
// НОВО: "Форматър" за детайлите
// Взима суровия JSON и го прави четим
// ====================================================================
function formatEventDetails(event: AppEvent): string {
    const details = event.details;

    if (details === null || details === undefined) {
        return 'Няма детайли';
    }

    // Специална логика за различните типове събития
    if (typeof details === 'object') {
        switch (event.event_type) {
            case 'CONTROL_CLICKED':
                // Извличаме ID-то на събитието от JSON-а
                const eventId = details.generated_event_id || 'N/A';
                return `Потребителят натисна контрола. ID на събитието: ${eventId}`;
            // Тук може да добавиш други случаи, напр. за промяна на потребител
            // case 'USER_UPDATED':
            //    return `Потребител '${details.username}' беше променен.`;
            default:
                // За всички други обекти, показваме ги като форматиран JSON
                return JSON.stringify(details, null, 2);
        }
    }

    // Ако детайлите са просто текст, връщаме го
    return String(details);
}

// Помощна функция за цветни значки
function getEventTypeBadge(eventType: AppEvent['event_type'] | string) {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
  switch (eventType) {
    case 'Вписване': case 'Регистрация': case 'Създаване':
      return `bg-green-500/20 text-green-400 ${baseClasses}`;
    case 'Промяна': case 'Смяна на Парола':
      return `bg-yellow-500/20 text-yellow-400 ${baseClasses}`;
    case 'Изход':
      return `bg-red-500/20 text-red-400 ${baseClasses}`;
    case 'Натискане на Контрола': // Добавяме и новия преведен тип
    case 'CONTROL_CLICKED':
        return `bg-blue-500/20 text-blue-400 ${baseClasses}`;
    case 'Влизане в Административни функции':
      return `bg-purple-500/20 text-purple-400 ${baseClasses}`;
    default:
      return `bg-gray-600/50 text-gray-300 ${baseClasses}`;
  }
}

type EventsTableProps = {
  events: AppEvent[];
};

export default function EventsTable({ events }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-800 rounded-lg shadow">
        <h3 className="mt-2 text-sm font-medium text-white">Няма събития</h3>
        <p className="mt-1 text-sm text-gray-400">Все още не са регистрирани събития в системата.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Кой (Потребител)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Какво (Тип събитие)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Детайли</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата и час</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {events.map((event) => {
            // "Превеждаме" типа на събитието преди да го покажем
            const translatedType = translateEventType(event.event_type);
            return (
              <tr key={event.id} className="hover:bg-gray-900/40 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white">{event.profiles?.username}</div>
                  <div className="text-xs text-gray-400">{!event.profiles?.username ? `User ID: ${event.user_id.substring(0, 12)}...` : ''}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={getEventTypeBadge(translatedType)}>
                    {translatedType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-pre-wrap max-w-sm break-words">
                  {/* Използваме нашия нов "форматър" за детайлите */}
                  {formatEventDetails(event)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div>{new Date(event.created_at).toLocaleDateString('bg-BG')}</div>
                  <div className="text-xs text-gray-500">{new Date(event.created_at).toLocaleTimeString('bg-BG')}</div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}