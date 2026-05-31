import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import { fetchTopHeadlines } from './newsapi'
import { fetchYouTubeTrending } from './youtube'
import { generateForecast, generateTimeSeries } from './mock-data'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_trends',
    description: 'Получить список активных трендов из базы данных. Можно фильтровать по платформе.',
    input_schema: {
      type: 'object' as const,
      properties: {
        platform: {
          type: 'string',
          enum: ['INSTAGRAM', 'TIKTOK', 'TWITTER', 'VKONTAKTE', 'YOUTUBE', 'OTHER', 'ALL'],
          description: 'Платформа для фильтрации. ALL — все платформы.',
        },
        limit: {
          type: 'number',
          description: 'Максимальное количество трендов (по умолчанию 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_platform_stats',
    description: 'Получить статистику по платформам: количество трендов, суммарные упоминания, средний рост.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'search_news',
    description: 'Поиск новостей по теме через NewsAPI. Возвращает последние статьи.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Поисковый запрос на русском языке (например: Казахстан, технологии, спорт)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_youtube_trends',
    description: 'Получить топ трендовых видео на YouTube в Казахстане.',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Максимальное количество видео (по умолчанию 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_forecast',
    description: 'Построить прогноз роста для конкретного тренда на N дней вперёд.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: 'Ключевое слово или название тренда',
        },
        days: {
          type: 'number',
          description: 'Горизонт прогноза в днях (7, 14, или 30)',
        },
        model: {
          type: 'string',
          enum: ['linear', 'exponential', 'arima'],
          description: 'Модель прогнозирования',
        },
      },
      required: ['keyword'],
    },
  },
]

export async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      case 'get_trends': {
        const platform = input.platform as string | undefined
        const limit = (input.limit as number) || 10
        const where = platform && platform !== 'ALL' ? { isActive: true, platform: platform as any } : { isActive: true }
        const trends = await prisma.trend.findMany({
          where,
          orderBy: { mentionsCount: 'desc' },
          take: limit,
        })
        if (trends.length === 0) return 'Трендов не найдено в базе данных.'
        const result = trends.map(t =>
          `• ${t.keyword} (${t.platform}): ${t.mentionsCount.toLocaleString()} упоминаний, рост ${t.growthRate > 0 ? '+' : ''}${t.growthRate.toFixed(1)}%, настроение ${((t.sentiment ?? 0) * 100).toFixed(0)}%`
        ).join('\n')
        return `Найдено ${trends.length} трендов:\n${result}`
      }

      case 'get_platform_stats': {
        const platforms = await prisma.trend.groupBy({
          by: ['platform'],
          where: { isActive: true },
          _count: { id: true },
          _sum: { mentionsCount: true },
          _avg: { growthRate: true },
        })
        if (platforms.length === 0) return 'Данных по платформам нет.'
        const result = platforms.map(p =>
          `• ${p.platform}: ${p._count.id} трендов, ${(p._sum.mentionsCount ?? 0).toLocaleString()} упоминаний, средний рост ${(p._avg.growthRate ?? 0).toFixed(1)}%`
        ).join('\n')
        return `Статистика по платформам:\n${result}`
      }

      case 'search_news': {
        const query = input.query as string
        const articles = await fetchTopHeadlines(query, 5)
        if (articles.length === 0) return `По запросу "${query}" новостей не найдено.`
        const result = articles.map(a =>
          `• ${a.title}\n  Источник: ${a.source} | ${new Date(a.publishedAt).toLocaleDateString('ru-RU')}\n  ${a.description ?? ''}`
        ).join('\n\n')
        return `Последние новости по "${query}":\n\n${result}`
      }

      case 'get_youtube_trends': {
        const limit = (input.limit as number) || 10
        const videos = await fetchYouTubeTrending('KZ', limit)
        if (videos.length === 0) return 'YouTube тренды недоступны.'
        const result = videos.slice(0, limit).map((v, i) =>
          `${i + 1}. ${v.title}\n   Канал: ${v.channelTitle} | 👁 ${v.viewCount.toLocaleString()} | 👍 ${v.likeCount.toLocaleString()}`
        ).join('\n\n')
        return `Топ ${limit} трендовых видео YouTube в Казахстане:\n\n${result}`
      }

      case 'get_forecast': {
        const keyword = input.keyword as string
        const days = (input.days as number) || 14
        const model = (input.model as 'linear' | 'exponential' | 'arima') || 'arima'

        const trend = await prisma.trend.findFirst({
          where: { keyword: { contains: keyword, mode: 'insensitive' }, isActive: true },
          orderBy: { mentionsCount: 'desc' },
        })

        const baseValue = trend?.mentionsCount ?? 50000
        const growthRate = trend?.growthRate ?? 5
        const mockTrendData = {
          id: 'ai-forecast',
          keyword,
          platform: (trend?.platform ?? 'OTHER') as any,
          status: 'RISING' as const,
          mentionsCount: baseValue,
          growthRate,
          sentiment: trend?.sentiment ?? 0.5,
          hashtags: [],
          avgEngagement: 5,
          timeSeries: generateTimeSeries(30, baseValue, growthRate / 10),
        }
        const forecast = generateForecast(mockTrendData, days, model)
        const lastPoint = forecast[forecast.length - 1]
        const firstPoint = forecast.find(p => !p.actual)!

        return `Прогноз для "${keyword}" на ${days} дней (модель: ${model.toUpperCase()}):
• Стартовое значение: ~${baseValue.toLocaleString()} упоминаний
• Прогноз через ${days} дней: ${Math.round(lastPoint.predicted).toLocaleString()} (±${Math.round((lastPoint.upper - lastPoint.lower) / 2).toLocaleString()})
• Ожидаемый рост: ${(((lastPoint.predicted - firstPoint.predicted) / firstPoint.predicted) * 100).toFixed(1)}%
• Доверительный интервал 95%: [${Math.round(lastPoint.lower).toLocaleString()}, ${Math.round(lastPoint.upper).toLocaleString()}]`
      }

      default:
        return `Инструмент "${name}" не найден.`
    }
  } catch (err) {
    return `Ошибка при выполнении ${name}: ${err instanceof Error ? err.message : 'неизвестная ошибка'}`
  }
}
