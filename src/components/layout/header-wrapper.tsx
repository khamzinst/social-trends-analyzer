'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Дашборд',
  '/sources': 'Источники данных',
  '/import': 'Импорт данных',
  '/trends': 'Анализ трендов',
  '/forecasts': 'Прогнозирование',
  '/reports': 'Отчёты',
  '/settings': 'Настройки',
  '/profile': 'Профиль',
}

interface Props {
  user: { name: string; email: string }
}

export function HeaderWrapper({ user }: Props) {
  const pathname = usePathname()
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? 'TrendScope'

  return <Header title={title} user={user} />
}
