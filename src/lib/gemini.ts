import { GoogleGenerativeAI, SchemaType, Tool } from '@google/generative-ai'
import { executeTool } from './claude'

export function getGeminiClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY не задан в .env')
  return new GoogleGenerativeAI(apiKey)
}

const GEMINI_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'get_trends',
        description: 'Получить список активных трендов из базы данных. Можно фильтровать по платформе.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            platform: {
              type: SchemaType.STRING,
              description: 'Платформа: INSTAGRAM, TIKTOK, TWITTER, VKONTAKTE, YOUTUBE, OTHER, ALL',
            },
            limit: {
              type: SchemaType.NUMBER,
              description: 'Максимальное количество трендов (по умолчанию 10)',
            },
          },
        },
      },
      {
        name: 'get_platform_stats',
        description: 'Получить статистику по платформам: количество трендов, суммарные упоминания, средний рост.',
        parameters: { type: SchemaType.OBJECT, properties: {} },
      },
      {
        name: 'search_news',
        description: 'Поиск новостей по теме через NewsAPI.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: 'Поисковый запрос на русском языке',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_youtube_trends',
        description: 'Получить топ трендовых видео на YouTube в Казахстане.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            limit: {
              type: SchemaType.NUMBER,
              description: 'Максимальное количество видео (по умолчанию 10)',
            },
          },
        },
      },
      {
        name: 'get_forecast',
        description: 'Построить прогноз роста для конкретного тренда на N дней вперёд.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            keyword: {
              type: SchemaType.STRING,
              description: 'Ключевое слово или название тренда',
            },
            days: {
              type: SchemaType.NUMBER,
              description: 'Горизонт прогноза в днях (7, 14, или 30)',
            },
            model: {
              type: SchemaType.STRING,
              description: 'Модель: linear, exponential, arima',
            },
          },
          required: ['keyword'],
        },
      },
    ],
  },
]

const SYSTEM_PROMPT = `Ты — AI-аналитик платформы TrendScope для анализа социальных медиа трендов в Казахстане.
Отвечай на русском языке. Ты имеешь доступ к реальным данным через инструменты.
Используй инструменты чтобы давать точные ответы на основе реальных данных.
Форматируй ответы чётко и структурированно. Сегодня: ${new Date().toLocaleDateString('ru-RU')}.`

export async function* streamGeminiChat(
  messages: { role: 'user' | 'assistant'; content: string }[]
): AsyncGenerator<{ type: string; text?: string; tool?: string; message?: string }> {
  const genai = getGeminiClient()
  const model = genai.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: GEMINI_TOOLS,
    systemInstruction: SYSTEM_PROMPT,
  })

  // Convert messages to Gemini format — skip leading assistant messages (Gemini requires first = user)
  const allButLast = messages.slice(0, -1).filter((m) => m.content.trim())
  const firstUserIdx = allButLast.findIndex((m) => m.role === 'user')
  const history = (firstUserIdx === -1 ? [] : allButLast.slice(firstUserIdx)).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const lastMessage = messages[messages.length - 1].content

  const chat = model.startChat({ history })

  // Agentic loop
  let currentMessage = lastMessage
  let iteration = 0

  while (iteration < 5) {
    iteration++
    const result = await chat.sendMessage(currentMessage)
    const response = result.response
    const parts = response.candidates?.[0]?.content?.parts ?? []

    // Check for function calls
    const functionCalls = parts.filter((p) => p.functionCall)
    const textParts = parts.filter((p) => p.text)

    // Stream text parts
    for (const part of textParts) {
      if (part.text) yield { type: 'text', text: part.text }
    }

    // No function calls → done
    if (functionCalls.length === 0) break

    // Execute tool calls and feed results back
    const functionResponses = []
    for (const part of functionCalls) {
      const call = part.functionCall!
      yield { type: 'tool_call', tool: call.name }

      const result = await executeTool(
        call.name,
        (call.args ?? {}) as Record<string, unknown>
      )
      functionResponses.push({
        functionResponse: { name: call.name, response: { result } },
      })
    }

    // Send all function results at once
    const toolResult = await chat.sendMessage(functionResponses)
    const toolParts = toolResult.response.candidates?.[0]?.content?.parts ?? []
    for (const part of toolParts) {
      if (part.text) yield { type: 'text', text: part.text }
    }

    // Check if model wants more tool calls
    const moreCalls = toolParts.filter((p) => p.functionCall)
    if (moreCalls.length === 0) break

    // If more calls needed — continue loop
    currentMessage = toolResult.response.text()
  }
}
