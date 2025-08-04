/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/AdminHomePageClient.tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Users, Trello, PlusCircle } from "lucide-react";
import Link from "next/link";

// Помощна функция за форматиране на дата
function formatTimeAgo(date: string, t: any) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60)
    return t.timeAgo({ value: Math.floor(seconds), unit: "second" });
  const minutes = seconds / 60;
  if (minutes < 60)
    return t.timeAgo({ value: Math.floor(minutes), unit: "minute" });
  const hours = minutes / 60;
  if (hours < 24) return t.timeAgo({ value: Math.floor(hours), unit: "hour" });
  const days = hours / 24;
  if (days < 30) return t.timeAgo({ value: Math.floor(days), unit: "day" });
  const months = days / 30;
  if (months < 12)
    return t.timeAgo({ value: Math.floor(months), unit: "month" });
  const years = days / 365;
  return t.timeAgo({ value: Math.floor(years), unit: "year" });
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    </div>
  </div>
);

export default function AdminHomePageClient({
  stats,
  latestEvents,
  latestUsers,
}: any) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          {t.adminDashboardTitle}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {t.adminDashboardSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t.totalUsers} value={stats.users} icon={Users} />
        <StatCard
          title={t.totalControls}
          value={stats.controls}
          icon={Trello}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t.recentActivity}</h2>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {latestEvents.map((event: any) => (
              <li
                key={event.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {event.profiles?.username || "Система"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {event.event_type}
                  </p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatTimeAgo(event.created_at, t)}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/events"
            className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block text-sm font-semibold"
          >
            {t.viewAllEvents} →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t.newUsers}</h2>
          <ul className="space-y-4">
            {latestUsers.map((user: any) => (
              <li key={user.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/users"
            className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block text-sm font-semibold"
          >
            {t.manageUsers} →
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/create"
            className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <PlusCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span className="mt-2 text-sm font-semibold">{t.create}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
