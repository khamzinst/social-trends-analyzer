'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Database,
  Upload,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  Youtube,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  {
    title: 'Дашборд',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Источники данных',
    href: '/sources',
    icon: Database,
  },
  {
    title: 'Импорт данных',
    href: '/import',
    icon: Upload,
  },
  {
    title: 'Анализ трендов',
    href: '/trends',
    icon: TrendingUp,
  },
  {
    title: 'YouTube Тренды',
    href: '/youtube',
    icon: Youtube,
  },
  {
    title: 'Прогнозирование',
    href: '/forecasts',
    icon: BarChart3,
  },
  {
    title: 'Отчёты',
    href: '/reports',
    icon: FileText,
  },
]

const bottomItems = [
  { title: 'Профиль', href: '/profile', icon: User },
  { title: 'Настройки', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Mobile close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 md:hidden flex items-center justify-center w-7 h-7 rounded-full text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">TrendScope</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">Аналитика трендов</span>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider">
            Меню
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-2 py-4 border-t border-sidebar-border space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
