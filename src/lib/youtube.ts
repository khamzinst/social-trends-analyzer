export interface YouTubeVideo {
  id: string
  title: string
  channelTitle: string
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  tags: string[]
  categoryId: string
}

export async function fetchYouTubeTrending(regionCode = 'KZ', maxResults = 25): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set')

  // Fetch trending videos
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${apiKey}`
  const res = await fetch(videosUrl, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)

  const data = await res.json()

  return (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.snippet?.title ?? '',
    channelTitle: item.snippet?.channelTitle ?? '',
    viewCount: parseInt(item.statistics?.viewCount ?? '0'),
    likeCount: parseInt(item.statistics?.likeCount ?? '0'),
    commentCount: parseInt(item.statistics?.commentCount ?? '0'),
    publishedAt: item.snippet?.publishedAt ?? '',
    tags: item.snippet?.tags ?? [],
    categoryId: item.snippet?.categoryId ?? '',
  }))
}

export async function searchYouTube(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set')

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`
  const searchRes = await fetch(searchUrl)
  if (!searchRes.ok) throw new Error(`YouTube search error: ${searchRes.status}`)
  const searchData = await searchRes.json()

  const ids = (searchData.items || []).map((i: any) => i.id.videoId).join(',')
  if (!ids) return []

  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${apiKey}`
  const statsRes = await fetch(statsUrl)
  const statsData = await statsRes.json()

  return (statsData.items || []).map((item: any) => ({
    id: item.id,
    title: item.snippet?.title ?? '',
    channelTitle: item.snippet?.channelTitle ?? '',
    viewCount: parseInt(item.statistics?.viewCount ?? '0'),
    likeCount: parseInt(item.statistics?.likeCount ?? '0'),
    commentCount: parseInt(item.statistics?.commentCount ?? '0'),
    publishedAt: item.snippet?.publishedAt ?? '',
    tags: item.snippet?.tags ?? [],
    categoryId: item.snippet?.categoryId ?? '',
  }))
}

// YouTube category names
export const YOUTUBE_CATEGORIES: Record<string, string> = {
  '1': 'Кино и анимация', '2': 'Автомобили', '10': 'Музыка',
  '15': 'Животные', '17': 'Спорт', '19': 'Путешествия',
  '20': 'Игры', '22': 'Блоги', '23': 'Комедия',
  '24': 'Развлечения', '25': 'Новости', '26': 'Политика',
  '27': 'Обучение', '28': 'Наука и технологии', '29': 'НКО',
}
