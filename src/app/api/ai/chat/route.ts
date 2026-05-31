import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { streamGroqChat } from '@/lib/groq'

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages } = await req.json()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        for await (const event of streamGroqChat(messages)) {
          send(event)
        }
        send({ type: 'done' })
      } catch (err) {
        let message = err instanceof Error ? err.message : 'Неизвестная ошибка'
        if (message.includes('GROQ_API_KEY')) {
          message = 'Добавьте GROQ_API_KEY в файл .env (получить на console.groq.com)'
        } else if (message.includes('401') || message.includes('auth')) {
          message = 'Неверный GROQ_API_KEY. Проверьте ключ в .env'
        } else if (message.includes('429') || message.includes('rate')) {
          message = 'Превышен лимит запросов. Подождите минуту и попробуйте снова.'
        }
        send({ type: 'error', message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
