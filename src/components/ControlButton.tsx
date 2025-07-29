'use client'

import { useState } from 'react'

// Приемаме данните за контролата като "props"
type ControlProps = {
  control: {
    id: number
    name: string
  }
}

export default function ControlButton({ control }: ControlProps) {
  // Състояние за всеки индивидуален бутон
  const [isActive, setIsActive] = useState(false)
  const [eventId, setEventId] = useState<number | null>(null)

  const handleClick = () => {
    // Ако бутонът вече е активен, не правим нищо
    if (isActive) return

    const newEventId = Math.floor(100000 + Math.random() * 900000)
    
    // Активираме бутона
    setIsActive(true)
    setEventId(newEventId)

    // TODO: Тук ще се изпраща Webhook/API повикването в бъдеще
    console.log(`Webhook/API Call: User clicked control "${control.name}" (ID: ${control.id}). Event ID: ${newEventId}`)

    // Задаваме таймер за деактивиране след 5 секунди
    setTimeout(() => {
      setIsActive(false)
      setEventId(null)
    }, 5000)
  }

  return (
    <button
      onClick={handleClick}
      // Динамично сменяме класовете според състоянието 'isActive'
      className={`
        p-4 rounded-xl shadow-md text-center font-semibold 
        w-full h-24 flex flex-col justify-center items-center 
        transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-indigo-400/50' 
          : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-50'
        }
      `}
    >
      <span className="text-sm">{control.name}</span>
      {/* Показваме Event ID само когато е активно */}
      {eventId && (
        <span className="text-xs font-mono mt-1 opacity-80">
          #{eventId}
        </span>
      )}
    </button>
  )
}