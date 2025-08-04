/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// src/types/index.ts

export type AppEvent = {
  id: number;
  created_at: string;
  // РАЗШИРЯВАМЕ ТИПА, за да включва и суровите данни от базата
  event_type: 'Регистрация' | 'Смяна на Парола' | 'Вписване' | 'Изход' | 'Натискане на Контрола' | 'Влизане в Административни функции' | 'Промяна' | 'Създаване' | 'Зареждане на Списък Събития' | 'CONTROL_CLICKED' | string; // добавяме и | string за гъвкавост
  
  // РАЗШИРЯВАМЕ ТИПА, за да може 'details' да бъде и обект
  details: Record<string, any> | string | null;

  additional_info: Record<string, any> | null;
  user_id: string;
  profiles: {
    username: string;
  } | null;
};

export type PageProps<T extends Record<string, string> = {}> = {
  // params вече е Promise, който се резолва до обект с твоите параметри
  params: Promise<T>; 
  searchParams?: { [key: string]: string | string[] | undefined };
};