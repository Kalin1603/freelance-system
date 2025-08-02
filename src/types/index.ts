// Файл: src/types/index.ts
export type Profile = {
  id: string
  created_at: string
  username: string | null
  role: string | null
  is_active: boolean
}