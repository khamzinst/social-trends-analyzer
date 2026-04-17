'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, Newspaper, ExternalLink, Search, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Article {
  title: string
  description: string | null
  url: string
  source: string
  publishedAt: string
  urlToImage: string | null
}

const TOPICS = ['Казахстан', 'Алматы', 'Астана', 'технологии', 'экономика', 'спорт', 'политика', 'бизнес']

export default function NewsPage() {
  const { toast } = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('Казахстан')
  const [activeQuery, setActiveQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadNews = async (q: string) => {
    setLoading(true)
    setActiveQuery(q)
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setArticles(data.articles ?? [])
      setLastUpdate(new Date())
      toast({ title: `Загружено ${data.articles?.length ?? 0} новостей по теме «${q}»`, variant: 'success' })
    } catch (e: any) {
      toast({ title: 'Ошибка загрузки', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews('Казахстан')
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Новостные тренды</h2>
                <p className="text-xs text-muted-foreground">
                  Реальные новости · NewsAPI · {lastUpdate ? format(lastUpdate, 'HH:mm, d MMM', { locale: ru }) : 'загрузка...'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => loadNews(activeQuery || query)} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по теме..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadNews(query)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => loadNews(query)} disabled={loading}>Найти</Button>
          </div>

          {/* Quick topics */}
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); loadNews(t) }}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeQuery === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-border'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {articles.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground px-1">
          <Badge variant="outline">{articles.length} статей</Badge>
          <span>по запросу «{activeQuery}»</span>
        </div>
      )}

      {/* Articles */}
      <div className="space-y-3">
        {loading ? (
          <Card><CardContent className="py-16 text-center text-muted-foreground">Загрузка новостей...</CardContent></Card>
        ) : articles.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-muted-foreground">Нет результатов</CardContent></Card>
        ) : (
          articles.map((article, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt=""
                      className="w-24 h-16 object-cover rounded-lg shrink-0 hidden sm:block"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2">{article.title}</h3>
                      <a href={article.url} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-primary ml-2">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    {article.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">{article.source}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.publishedAt
                          ? format(parseISO(article.publishedAt), 'd MMM yyyy, HH:mm', { locale: ru })
                          : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
