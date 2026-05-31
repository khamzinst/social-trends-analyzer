import { AiChat } from '@/components/ai/ai-chat'
import { Sparkles, Wrench, Zap } from 'lucide-react'

export default function AiAnalystPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">AI Аналитик</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              Groq · Llama 3.3 70B
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Умный анализ трендов с доступом к реальным данным
          </p>
        </div>
      </div>

      {/* Capability badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: Wrench, label: 'Тренды из БД' },
          { icon: Wrench, label: 'Статистика платформ' },
          { icon: Wrench, label: 'Поиск новостей' },
          { icon: Wrench, label: 'YouTube тренды' },
          { icon: Zap, label: 'Прогнозирование' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground border border-border"
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden min-h-0">
        <AiChat />
      </div>
    </div>
  )
}
