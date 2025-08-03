// src/app/auth/actions.ts
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logEvent } from '@/lib/events';

// Server Action за РЕГИСТРАЦИЯ
export async function signUpAction(formData: FormData): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    } 
  });

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const confirmPassword = String(formData.get('confirmPassword'));
  const username = String(formData.get('username'));

  if (password.length < 6) {
    return { error: 'Паролата трябва да е поне 6 символа.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Паролите не съвпадат!' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error || !data.user) {
    console.error('Sign up error:', error);
    return { error: error?.message || 'Грешка при регистрация.' };
  }

  await logEvent({
    supabase,
    eventType: 'Регистрация',
    userId: data.user.id,
    details: `Нов потребител се регистрира: ${email}`,
  });
  
  const successMessage = 'Регистрацията е успешна! Моля, впишете се.';
  redirect(`/?message=${encodeURIComponent(successMessage)}`);
}


// Server Action за ВПИСВАНЕ - също връща резултат при грешка
export async function signInAction(formData: FormData): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    } 
  });
  
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    console.error('Sign in error:', error);
    return { error: 'Грешен и-мейл или парола.' };
  }

  await logEvent({
    supabase,
    eventType: 'Вписване',
    userId: data.user.id,
    details: `Потребител се вписа: ${email}`,
  });
  
  redirect('/dashboard');
}

// ====================================================================
// НОВ Server Action за ИЗХОД, който добавяме в края на файла
// ====================================================================
export async function signOutAction() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    } 
  });

  // Взимаме потребителя ПРЕДИ да го изкараме от системата
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // --- ЗАПИС НА СЪБИТИЕ "Изход" ---
    await logEvent({
      supabase,
      eventType: 'Изход',
      userId: user.id,
      details: `Потребител излезе: ${user.email}`
    });
  }

  // Изкарваме потребителя от системата
  await supabase.auth.signOut();
  
  // Пренасочваме към началната страница
  redirect('/');
}