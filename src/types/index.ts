// Файл: src/types/index.ts
export type Profile = {
  id: string
  created_at: string
  username: string | null
  role: string | null
  is_active: boolean
}
export interface Region {
  id: string;
  name_bg: string;
  name_en?: string | null; // по избор
  created_at: string;
}

export interface Section {
  id: string;
  name_bg: string;
  name_en?: string | null; // по избор
  region_id: string;
  created_at: string;
}

export interface Control {
    id: string;
    name_bg: string;
    name_en?: string | null; // по избор
    section_id: string;
    created_at: string;
}