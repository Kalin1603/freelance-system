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
    control: 'Контрола',
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
    createTitle: 'Създаване на нов елемент',
    createSubtitle: 'Изберете тип на елемента и попълнете данните по-долу.',
    createChooseType: 'Избери какво да създадеш:',
    createSelectRegion: 'Избери регион',
    createSelectSection: 'Избери секция',
    createSelectPlaceholder: '-- Моля, изберете --',
    createItemNameLabel: 'Име',
    createItemNamePlaceholder: 'Въведете име на', 
    createButton: 'Създай',
    creatingButton: 'Създаване...',
    createSuccess: 'Елементът е създаден успешно!',
    createError: 'Грешка при създаването',
    nameRequiredError: 'Името е задължително.',
    selectionRequiredError: 'Трябва да направите избор.',
    adminPanel: 'Админ Панел',
    adminDashboard: 'Администраторско табло',
    welcomeToAdmin: 'Добре дошли в административния панел. Моля, изберете опция от менюто вляво, за да продължите.',
    users: 'Потребители',
    controls: 'Контроли',
    create: 'Създай',
    eventsList: 'Списък Събития',
    backToDashboard: 'Назад към Таблото',
    // ПРЕВОДИ ЗА СТРАНИЦА "КОНТРОЛИ"
    controlManagement: 'Управление на Контроли',
    controlNameBG: 'Име на Контрола (BG)',
    controlNameEN: 'Име на Контрола (EN)',
    sections: 'Секции',
    regions: 'Региони',
    noSections: 'Няма секции',
    noRegions: 'Няма региони',
    // ПРЕВОДИ ЗА СТРАНИЦА "РЕДАКЦИЯ НА КОНТРОЛА"
    editControlTitle: 'Редакция на контрола',
    mainInfo: 'Основна информация',
    nameBG: 'Име (BG)',
    nameEN: 'Име (EN)',
    accessManagement: 'Управление на достъп',
    accessManagementDesc: 'Изберете кои потребители да имат достъп до тази контрола.',
    controlUpdatedSuccess: 'Контролата е обновена успешно!',
    controlUpdatedError: 'Грешка при обновяване.',
    // ДОБАВЕНИ/АКТУАЛИЗИРАНИ ПРЕВОДИ ЗА ПОТРЕБИТЕЛИ
    userManagement: 'Управление на Потребители',
    editUserTitle: 'Редакция на потребител',
    username: 'Потребителско име',
    role: 'Роля',
    status: 'Статус',
    actions: 'Действия',
    active: 'Активен',
    deactivated: 'Деактивиран',
    editLink: 'Промени',
    roleDescription: 'Променете нивото на достъп на потребителя.',
    accountStatus: 'Статус на акаунта',
    accountStatusDescription: 'Деактивираните акаунти не могат да се вписват.',
    accountIsActive: 'Този акаунт е активен',
    accountIsDeactivated: 'Този акаунт е деактивиран',
    activate: 'Активирай',
    deactivate: 'Деактивирай',
    saveChanges: 'Запази всички промени',
    userUpdatedSuccess: 'Профилът е обновен успешно!',
    userUpdatedError: 'Грешка при обновяване.',
    // НОВА СЕКЦИЯ: Преводи за "Забравена парола"
    forgotPasswordPrompt: 'Въведете имейла си, за да получите линк за нулиране.',
    sendResetLink: 'Изпрати линк',
    backToLogin: 'Назад към Вход',
    resetPasswordTitle: 'Смяна на парола',
    resetPasswordPrompt: 'Въведете вашата нова парола.',
    newPasswordLabel: 'Нова парола',
    confirmNewPasswordLabel: 'Потвърди новата парола',
    changePasswordButton: 'Смени паролата',
    passwordChangedSuccess: 'Паролата е сменена успешно! Пренасочваме към вход...',
  },
  en: {
    // Вече съществуващи
    welcome: 'Welcome',
    yourControls: 'Your Controls',
    noControls: 'You have no access to controls. Please contact an administrator.',
    region: 'Region',
    section: 'Section',
    control: 'Control',
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
    createTitle: 'Create New Item',
    createSubtitle: 'Select an item type and fill in the details below.',
    createChooseType: 'Choose what to create:',
    createSelectRegion: 'Select Region',
    createSelectSection: 'Select Section',
    createSelectPlaceholder: '-- Please select --',
    createItemNameLabel: 'Name',
    createItemNamePlaceholder: 'Enter name for', 
    createButton: 'Create',
    creatingButton: 'Creating...',
    createSuccess: 'Item created successfully!',
    createError: 'Error during creation',
    nameRequiredError: 'The name is required.',
    selectionRequiredError: 'A selection is required.',
    adminPanel: 'Admin Panel',
    adminDashboard: 'Admin Dashboard',
    welcomeToAdmin: 'Welcome to the admin panel. Please select an option from the menu on the left to continue.',
    users: 'Users',
    controls: 'Controls',
    create: 'Create',
    eventsList: 'Events List',
    backToDashboard: 'Back to Dashboard',
    // ПРЕВОДИ ЗА СТРАНИЦА "КОНТРОЛИ"
    controlManagement: 'Control Management',
    controlNameBG: 'Control Name (BG)',
    controlNameEN: 'Control Name (EN)',
    sections: 'Sections',
    regions: 'Regions',
    noSections: 'No sections',
    noRegions: 'No regions',
    // ПРЕВОДИ ЗА СТРАНИЦА "РЕДАКЦИЯ НА КОНТРОЛА"
    editControlTitle: 'Editing Control',
    mainInfo: 'Main Information',
    nameBG: 'Name (BG)',
    nameEN: 'Name (EN)',
    accessManagement: 'Access Management',
    accessManagementDesc: 'Select which users have access to this control.',
    controlUpdatedSuccess: 'Control updated successfully!',
    controlUpdatedError: 'Error during update.',
    // ДОБАВЕНИ/АКТУАЛИЗИРАНИ ПРЕВОДИ ЗА ПОТРЕБИТЕЛИ
    userManagement: 'User Management',
    editUserTitle: 'Editing User',
    username: 'Username',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    deactivated: 'Deactivated',
    editLink: 'Edit',
    roleDescription: "Change the user's access level.",
    accountStatus: 'Account Status',
    accountStatusDescription: 'Deactivated accounts cannot sign in.',
    accountIsActive: 'This account is active',
    accountIsDeactivated: 'This account is deactivated',
    activate: 'Activate',
    deactivate: 'Deactivate',
    saveChanges: 'Save All Changes',
    userUpdatedSuccess: 'Profile updated successfully!',
    userUpdatedError: 'Error during update.',
    // НОВА СЕКЦИЯ: Преводи за "Забравена парола"
    forgotPasswordPrompt: 'Enter your email to receive a reset link.',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    resetPasswordTitle: 'Reset Password',
    resetPasswordPrompt: 'Enter your new password.',
    newPasswordLabel: 'New Password',
    confirmNewPasswordLabel: 'Confirm New Password',
    changePasswordButton: 'Change Password',
    passwordChangedSuccess: 'Password changed successfully! Redirecting to login...',
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