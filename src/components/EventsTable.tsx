/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EventsTable.tsx

'use client';

import { AppEvent } from "@/types";

// Помощна функция, която "предпазва" от грешката.
// Тя проверява дали 'details' е обект и ако е, го превръща в текст.
function formatDetails(details: any): string {
  // Ако няма детайли, връщаме 'Няма'
  if (details === null || details === undefined) {
    return 'Няма';
  }
  
  // АКО Е ОБЕКТ, превръщаме го в четим текстов JSON.
  // Това е ключовата част, която решава проблема.
  if (typeof details === 'object') {
    return JSON.stringify(details, null, 2); // 'null, 2' го прави по-красив за четене
  }
  
  // Ако е обикновен текст или число, просто го връщаме.
  return String(details);
}

type EventsTableProps = {
  events: AppEvent[];
};

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-700 text-xs text-gray-400 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">Кой (Потребител)</th>
            <th scope="col" className="px-6 py-3">Какво (Тип събитие)</th>
            <th scope="col" className="px-6 py-3">Детайли</th>
            <th scope="col" className="px-6 py-3">Дата и час</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-600">
              <td className="px-6 py-4 font-medium">
                {event.profiles?.username || `User ID: ${event.user_id.substring(0, 8)}...`}
              </td>
              <td className="px-6 py-4">{event.event_type}</td>
              <td className="px-6 py-4 whitespace-pre-wrap">
                {formatDetails(event.details)}
              </td>
              <td className="px-6 py-4">
                {new Date(event.created_at).toLocaleString('bg-BG', {
                  dateStyle: 'short',
                  timeStyle: 'medium',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}