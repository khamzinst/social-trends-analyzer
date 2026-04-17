export interface NewsArticle {
  title: string
  description: string | null
  url: string
  source: string
  publishedAt: string
  urlToImage: string | null
}

export async function fetchTopHeadlines(query = 'Казахстан', pageSize = 20): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) throw new Error('NEWS_API_KEY not set')

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=ru&sortBy=popularity&pageSize=${pageSize}&apiKey=${apiKey}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)

  const data = await res.json()
  if (data.status !== 'ok') throw new Error(data.message ?? 'NewsAPI error')

  return (data.articles ?? []).map((a: any) => ({
    title: a.title ?? '',
    description: a.description ?? null,
    url: a.url ?? '',
    source: a.source?.name ?? '',
    publishedAt: a.publishedAt ?? '',
    urlToImage: a.urlToImage ?? null,
  }))
}

export const NEWS_TOPICS = [
  'Казахстан',
  'Алматы',
  'Астана',
  'технологии',
  'экономика',
  'спорт',
]
