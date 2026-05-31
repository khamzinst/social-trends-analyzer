import Groq from 'groq-sdk'
import { prisma } from './prisma'
import { fetchTopHeadlines } from './newsapi'
import { fetchYouTubeTrending } from './youtube'

async function buildContext(userMessage: string): Promise<{ context: string; tools: string[] }> {
  const msg = userMessage.toLowerCase()
  const tools: string[] = []
  const parts: string[] = []

  const needsTrends = msg.includes('тренд') || msg.includes('растут') || msg.includes('платформ') || msg.includes('instagram') || msg.includes('tiktok') || msg.includes('twitter') || msg.includes('youtube') || msg.includes('vk')
  const needsNews = msg.includes('новост') || msg.includes('казахст') || msg.includes('сми')
  const needsYoutube = msg.includes('youtube') || msg.includes('ютуб') || msg.includes('видео')

  if (needsTrends || (!needsNews && !needsYoutube)) {
    try {
      tools.push('Загружаю тренды из БД...')
      const trends = await prisma.trend.findMany({
        where: { isActive: true },
        orderBy: { growthRate: 'desc' },
        take: 20,
      })
      if (trends.length > 0) {
        const stats = await prisma.trend.groupBy({
          by: ['platform'],
          where: { isActive: true },
          _count: { id: true },
          _sum: { mentionsCount: true },
          _avg: { growthRate: true },
        })
        parts.push(`=== ТРЕНДЫ В БД (топ по росту) ===\n` +
          trends.map(t => `• ${t.keyword} [${t.platform}]: ${t.mentionsCount.toLocaleString()} упоминаний, рост ${t.growthRate > 0 ? '+' : ''}${t.growthRate.toFixed(1)}%, настроение ${((t.sentiment ?? 0) * 100).toFixed(0)}%`).join('\n'))
        parts.push(`=== СТАТИСТИКА ПО ПЛАТФОРМАМ ===\n` +
          stats.map(s => `• ${s.platform}: ${s._count.id} трендов, ${(s._sum.mentionsCount ?? 0).toLocaleString()} упоминаний, средний рост ${(s._avg.growthRate ?? 0).toFixed(1)}%`).join('\n'))
      }
    } catch {}
  }

  if (needsNews) {
    try {
      tools.push('Ищу новости...')
      const query = msg.includes('технолог') ? 'технологии Казахстан' :
        msg.includes('спорт') ? 'спорт Казахстан' :
        msg.includes('экономик') ? 'экономика Казахстан' : 'Казахстан'
      const articles = await fetchTopHeadlines(query, 5)
      if (articles.length > 0) {
        parts.push(`=== ПОСЛЕДНИЕ НОВОСТИ (${query}) ===\n` +
          articles.map(a => `• ${a.title} [${a.source}]${a.description ? ': ' + a.description : ''}`).join('\n'))
      }
    } catch {}
  }

  if (needsYoutube) {
    try {
      tools.push('Получаю YouTube тренды...')
      const videos = await fetchYouTubeTrending('KZ', 10)
      if (videos.length > 0) {
        parts.push(`=== YOUTUBE ТРЕНДЫ (Казахстан) ===\n` +
          videos.map((v, i) => `${i + 1}. ${v.title} — ${v.channelTitle} | 👁 ${v.viewCount.toLocaleString()} | 👍 ${v.likeCount.toLocaleString()}`).join('\n'))
      }
    } catch {}
  }

  return { context: parts.join('\n\n'), tools }
}

export async function* streamGroqChat(
  messages: { role: 'user' | 'assistant'; content: string }[]
): AsyncGenerator<{ type: string; text?: string; tool?: string; message?: string }> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY не задан в .env')

  const groq = new Groq({ apiKey })
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content ?? ''

  // Load data context
  const { context, tools } = await buildContext(lastUserMessage)
  for (const tool of tools) {
    yield { type: 'tool_call', tool }
  }

  const systemPrompt = `Ты — AI-аналитик платформы TrendScope для анализа социальных медиа трендов в Казахстане.
Отвечай на русском языке, структурированно и чётко.
Сегодня: ${new Date().toLocaleDateString('ru-RU')}.
${context ? `\nДАННЫЕ ДЛЯ АНАЛИЗА:\n${context}` : ''}`

  const chatMessages: any[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: chatMessages,
    max_tokens: 2048,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content ?? ''
  if (text) yield { type: 'text', text }
}
