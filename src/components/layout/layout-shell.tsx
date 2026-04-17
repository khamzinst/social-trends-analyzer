'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Дашборд',
  '/sources': 'Источники данных',
  '/import': 'Импорт данных',
  '/trends': 'Анализ трендов',
  '/forecasts': 'Прогнозирование',
  '/reports': 'Отчёты',
  '/profile': 'Профиль',
  '/settings': 'Настройки',
}

interface Props {
  user: { name: string; email: string } | null
  children: React.ReactNode
}

export function LayoutShell({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'TrendScope'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:relative md:z-auto md:flex
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={title}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
