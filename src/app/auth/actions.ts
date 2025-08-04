// src/app/auth/actions.ts
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logEvent } from '@/lib/events';

// Server Action за РЕГИСТРАЦИЯ
export async function signUpAction(formData: FormData): Promise<{ error: string | null }> {
  const cookieStore = await cookies(); // Промяна: премахнато е 'await', cookies() е синхронна
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

  // Взимаме базовия URL от променливите на средата
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { username },
      // Това казва на Supabase да изпрати имейл и да не логва потребителя веднага
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error || !data.user) {
    console.error('Sign up error:', error);
    return { error: error?.message || 'Грешка при регистрация.' };
  }

  // Записваме събитието, но само ако потребителят е създаден успешно
  if(data.user) {
      await logEvent({
        supabase,
        eventType: 'Регистрация',
        userId: data.user.id,
        details: `Нов потребител се регистрира: ${email}`,
      });
  }
  
  // Съобщение, за да е по-ясно за потребителя
  const successMessage = 'Регистрацията е успешна! Изпратихме Ви линк за потвърждение. Моля, проверете пощата си.';
  redirect(`/?message=${encodeURIComponent(successMessage)}`);
}

// Server Action за ИЗХОД, който добавяме в края на файла
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
    
    if (error && error.message.includes('Email not confirmed')) {
      return { error: 'loginErrorEmailNotConfirmed' };
    }
    
    // Връщаме общата грешка за всички други случаи
    return { error: 'loginErrorInvalidCredentials' };
  }

  // КЛЮЧОВАТА ПРОВЕРКА ЗА АКТИВЕН СТАТУС
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', data.user.id)
    .single();

  if (!profile || !profile.is_active) {
    // Деактивираният потребител е влязъл в Supabase, но не е активен в таблицата profiles
    // Унищожаваме току-що създадената сесия
    await supabase.auth.signOut();
    // Връщаме грешка, която да се покаже във формата за вход
    return { error: 'loginErrorAccountDeactivated' };
  }

  await logEvent({
    supabase,
    eventType: 'Вписване',
    userId: data.user.id,
    details: `Потребител се вписа: ${email}`,
  });
  
  redirect('/dashboard');
}

// НОВ Server Action за забравена парола
export async function forgotPasswordAction(formData: FormData): Promise<{ error: string | null; message: string | null; }> {
  const email = String(formData.get('email'));
  
  // ВАЖНО: Вече използваме createServerClient, както е редно в server action
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
      } 
    }
  );

  // Взимаме базовия URL от променливите на средата
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Този URL трябва да сочи към страницата, където потребителят ще въведе новата си парола
    redirectTo: `${baseUrl}/reset-password`,
  });

  if (error) {
    console.error('Forgot password error:', error);
    // Връщаме по-общо съобщение за грешка, за да не разкриваме детайли
    return { error: 'Възникна грешка при изпращането на имейла.', message: null };
  }

  // От съображения за сигурност, ВИНАГИ връщаме успешно съобщение
  return { error: null, message: 'Ако съществува акаунт с този имейл, ще получите инструкции за смяна на паролата.' };
}

// Server Action за обновяване на потребителски профил
export async function updateUserProfileAction(formData: FormData): Promise<{ error: string | null; success: boolean }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
    } 
  });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { error: 'Authentication required.', success: false };
  }
  
  const username = String(formData.get('username'));
  const oldPassword = String(formData.get('oldPassword'));
  const newPassword = String(formData.get('newPassword'));

  // 1. Ако потребителят иска да смени паролата си
  if (newPassword) {
    if (!oldPassword) {
      return { error: 'Трябва да въведете старата си парола, за да зададете нова.', success: false };
    }
    if (newPassword.length < 6) {
      return { error: 'Новата парола трябва да е поне 6 символа.', success: false };
    }

    // Проверяваме дали старата парола е вярна, преди да позволим промяна.
    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
    if (reauthError) {
      return { error: 'Грешна стара парола.', success: false };
    }

    // Ако старата парола е вярна, обновяваме с новата
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) {
      return { error: passwordError.message, success: false };
    }
  }

  // 2. Обновяваме потребителското име (независимо от паролата)
  if (username && user.user_metadata?.username !== username) {
      if (!username.trim()) {
        return { error: 'Потребителското име не може да бъде празно.', success: false };
      }
      const { error: profileError } = await supabase.from('profiles').update({ username: username.trim() }).eq('id', user.id);
      if (profileError) { return { error: profileError.message, success: false }; }

      const { error: userMetaError } = await supabase.auth.updateUser({ data: { username: username.trim() } });
      if (userMetaError) { return { error: userMetaError.message, success: false }; }
  }

  await logEvent({ supabase, eventType: 'Промяна', userId: user.id, details: 'Потребителят обнови профила си.' });
  return { error: null, success: true };
}