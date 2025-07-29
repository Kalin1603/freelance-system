// Файл: src/components/LogoutButton.tsx

'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

// НОВО: Дефинираме props
type LogoutButtonProps = {
  logoutText: string
}

export default function LogoutButton({ logoutText }: LogoutButtonProps) {
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
    >
      {/* НОВО: Използваме текста от props */}
      {logoutText}
    </button>
  )
}