// src/components/ControlButton.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext'; // Увери се, че пътят до твоя контекст е правилен

// Дефинираме проповете, които компонентът ще получава
type ControlButtonProps = {
  id: number;
  name_bg: string;
  name_en: string | null; // name_en може и да липсва
};

export default function ControlButton({ id, name_bg, name_en }: ControlButtonProps) {
  // Взимаме езика от контекста
  const { language } = useLanguage();

  // Състоянието за всеки индивидуален бутон
  const [isActive, setIsActive] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // Предотвратяваме двойно кликане, докато заявката тече
    if (isLoading || isActive) return;

    setIsLoading(true);

    try {
      // Използваме стандартизирания API endpoint
      const response = await fetch('/api/log-control-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ controlId: id }), // Подаваме само ID-то на контролата
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record event');
      }

      const result = await response.json();

      // Успешна заявка - активираме бутона и показваме ID-то
      setEventId(result.generated_event_id);
      setIsActive(true);

      // Таймер за връщане в нормално състояние
      setTimeout(() => {
        setIsActive(false);
        setEventId(null);
      }, 5000);

    } catch (error) {
      console.error('Error during control click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Избираме кое име да покажем според езика. Ако name_en липсва, показваме name_bg.
  const displayName = (language === 'en' && name_en) ? name_en : name_bg;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      // Използваме твоите стилове, те са страхотни
      className={`
        p-4 rounded-xl shadow-md text-center font-semibold 
        w-full h-24 flex flex-col justify-center items-center 
        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-indigo-400/50' // Стил при активно състояние
          : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-50' // Стандартен стил
        }
        ${isLoading ? 'cursor-wait opacity-70' : ''}
      `}
    >
      <span className="text-sm">{displayName}</span>
      {eventId && (
        <span className="text-xs font-mono mt-1 opacity-80">
          #{eventId}
        </span>
      )}
       {isLoading && !eventId && (
        <span className="text-xs font-mono mt-1 animate-pulse">
          Изпращане...
        </span>
      )}
    </button>
  );
}