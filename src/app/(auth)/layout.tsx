import { Activity } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">TrendScope</p>
            <p className="text-sidebar-foreground/60 text-xs mt-0.5">Аналитика трендов</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Анализ и прогнозирование<br />трендов социальных сетей
            </h2>
            <p className="mt-4 text-sidebar-foreground/70 text-base leading-relaxed">
              Платформа для обработки больших данных, выявления паттернов и прогнозирования
              популярности контента в реальном времени.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Источников данных', value: '4+' },
              { label: 'Анализов выполнено', value: '120+' },
              { label: 'Точность прогнозов', value: '87%' },
              { label: 'Трендов отслежено', value: '500+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-sidebar-accent/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-sidebar-foreground/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sidebar-foreground/40 text-sm">
          © 2026 TrendScope. Дипломный проект.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">TrendScope</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
