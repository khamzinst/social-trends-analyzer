'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Wrench, Sparkles, RefreshCw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: string[]
  isStreaming?: boolean
}

const SUGGESTED_QUESTIONS = [
  'Какие тренды сейчас растут быстрее всего?',
  'Сравни платформы по количеству трендов',
  'Покажи прогноз для самого популярного тренда на 14 дней',
  'Какие последние новости о технологиях в Казахстане?',
  'Что сейчас в тренде на YouTube в Казахстане?',
]

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Привет! Я ваш AI-аналитик трендов. Могу анализировать тренды из базы данных, искать новости, строить прогнозы и отвечать на вопросы о социальных медиа в Казахстане. Спросите меня о чём угодно!',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildApiMessages = (msgs: Message[]) =>
    msgs
      .filter((m) => !m.isStreaming)
      .map((m) => ({ role: m.role, content: m.content }))

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      toolCalls: [],
      isStreaming: true,
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: buildApiMessages(updatedMessages) }),
      })

      if (!res.ok) throw new Error('Ошибка сервера')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.type === 'text') {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + data.text },
              ]
            })
          } else if (data.type === 'tool_call') {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              return [
                ...prev.slice(0, -1),
                { ...last, toolCalls: [...(last.toolCalls ?? []), data.tool] },
              ]
            })
          } else if (data.type === 'done' || data.type === 'error') {
            const errorText =
              data.type === 'error' ? `\n\n⚠️ ${data.message}` : ''
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  content: last.content + errorText,
                  isStreaming: false,
                },
              ]
            })
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            content: 'Произошла ошибка. Проверьте ANTHROPIC_API_KEY в настройках.',
            isStreaming: false,
          },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Привет! Я ваш AI-аналитик трендов. Могу анализировать тренды из базы данных, искать новости, строить прогнозы и отвечать на вопросы о социальных медиа в Казахстане. Спросите меня о чём угодно!',
      },
    ])
  }

  const TOOL_LABELS: Record<string, string> = {
    get_trends: 'Загружаю тренды из БД...',
    get_platform_stats: 'Считаю статистику платформ...',
    search_news: 'Ищу новости...',
    get_youtube_trends: 'Получаю YouTube тренды...',
    get_forecast: 'Строю прогноз...',
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
              {/* Tool calls indicator */}
              {msg.role === 'assistant' && (msg.toolCalls?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {msg.toolCalls!.map((tool, ti) => (
                    <span
                      key={ti}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      <Wrench className="w-3 h-3" />
                      {TOOL_LABELS[tool] ?? tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm'
                }`}
              >
                {msg.content || (msg.isStreaming && (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Думаю...
                  </span>
                ))}
                {msg.isStreaming && msg.content && (
                  <span className="inline-block w-1 h-4 bg-primary/60 ml-0.5 animate-pulse rounded" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (shown when only greeting) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Попробуйте спросить:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2 items-end">
          <button
            onClick={resetChat}
            title="Новый чат"
            className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите что-нибудь о трендах... (Enter — отправить)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            style={{ maxHeight: '120px' }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
