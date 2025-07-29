// Файл: src/context/LanguageContext.tsx
'use client'

import { createContext, useState, useContext, ReactNode } from 'react'

// Дефинираме преводите
const translations = {
  bg: {
    // Вече съществуващи
    welcome: 'Добре дошъл',
    yourControls: 'Вашите Контроли',
    noControls: 'Нямате достъп до контроли. Свържете се с администратор.',
    region: 'Регион',
    section: 'Секция',
    logout: 'Изход',
    // НОВИ преводи
    navigation: 'Навигация',
    back: 'Назад',
    // Преводи за Login/Register страниците
    loginTitle: 'Вход в системата',
    loginWelcome: 'Добре дошъл!',
    loginPrompt: 'Впишете се, за да продължите.',
    emailLabel: 'И-мейл',
    passwordLabel: 'Парола',
    forgotPassword: 'Забравена парола?',
    loginButton: 'Вписване',
    loadingLogin: 'Вписване...',
    noAccount: 'Нямаш акаунт?',
    registerLink: 'Регистрирай се',
    registerTitle: 'Създаване на акаунт',
    registerPrompt: 'Присъедини се към нас бързо и лесно.',
    usernameLabel: 'Потребителско име',
    confirmPasswordLabel: 'Повтори паролата',
    registerButton: 'Регистрирай ме',
    loadingRegister: 'Създаване...',
    hasAccount: 'Вече имаш акаунт?',
    loginLink: 'Вход',
  },
  en: {
    // Вече съществуващи
    welcome: 'Welcome',
    yourControls: 'Your Controls',
    noControls: 'You have no access to controls. Please contact an administrator.',
    region: 'Region',
    section: 'Section',
    logout: 'Logout',
    // НОВИ преводи
    navigation: 'Navigation',
    back: 'Back',
    // Преводи за Login/Register страниците
    loginTitle: 'System Login',
    loginWelcome: 'Welcome!',
    loginPrompt: 'Sign in to continue.',
    emailLabel: 'E-mail',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Sign In',
    loadingLogin: 'Signing In...',
    noAccount: "Don't have an account?",
    registerLink: 'Sign Up',
    registerTitle: 'Create Account',
    registerPrompt: 'Join us quickly and easily.',
    usernameLabel: 'Username',
    confirmPasswordLabel: 'Confirm Password',
    registerButton: 'Sign Me Up',
    loadingRegister: 'Creating...',
    hasAccount: 'Already have an account?',
    loginLink: 'Login',
  }
}

type Language = 'bg' | 'en'
type Translations = typeof translations.bg

// Дефинираме какво ще съдържа нашият контекст
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

// Създаваме самия контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Създаваме "Provider" - компонент, който ще обвие нашето приложение
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('bg')
  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Създаваме си наш собствен "hook", за да използваме контекста лесно
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}