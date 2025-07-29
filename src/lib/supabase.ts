import { createClient } from '@supabase/supabase-js'

// Взимаме променливите от .env.local файла
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Създаваме и експортираме клиента, за да го ползваме в цялото приложение
export const supabase = createClient(supabaseUrl, supabaseAnonKey)