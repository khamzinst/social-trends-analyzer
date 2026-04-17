'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown, Zap, Brain, BarChart2 } from 'lucide-react'
import { MOCK_TRENDS, generateForecast, getPlatformLabel, type ForecastModel } from '@/lib/mock-data'
import { formatNumber, formatPercent } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('ru-RU') : '—'}
        </p>
      ))}
    </div>
  )
}

const MODEL_INFO = {
  linear: {
    name: 'Линейная регрессия',
    description: 'Простая линейная экстраполяция тренда. Хорошо работает при стабильном росте.',
    accuracy: 78,
  },
  exponential: {
    name: 'Экспоненциальное сглаживание',
    description: 'Придаёт больший вес последним наблюдениям. Оптимально для быстрых трендов.',
    accuracy: 84,
  },
  arima: {
    name: 'ARIMA-подобная модель',
    description: 'Учитывает авторегрессионные компоненты и скользящее среднее.',
    accuracy: 87,
  },
}

export function ForecastsPage() {
  const [selectedTrend, setSelectedTrend] = useState(MOCK_TRENDS[0])
  const [horizon, setHorizon] = useState('7')
  const [model, setModel] = useState<ForecastModel>('arima')

  const forecastData = generateForecast(selectedTrend, parseInt(horizon), model)
  const chartData = forecastData.map((p) => ({
    ...p,
    dateLabel: format(parseISO(p.date), 'd MMM', { locale: ru }),
  }))

  const todayIndex = forecastData.findIndex((p) => !p.actual)
  const lastActual = selectedTrend.timeSeries[selectedTrend.timeSeries.length - 1].value
  const lastPredicted = forecastData[forecastData.length - 1].predicted
  const deltaAbs = lastPredicted - lastActual
  const deltaPct = (deltaAbs / lastActual) * 100
  const growthProb = selectedTrend.growthRate > 0
    ? Math.min(0.95, 0.5 + selectedTrend.growthRate / 200)
    : Math.max(0.05, 0.5 + selectedTrend.growthRate / 200)

  const currentModel = MODEL_INFO[model as keyof typeof MODEL_INFO]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">ТРЕНД</label>
              <Select value={selectedTrend.id} onValueChange={(id) => setSelectedTrend(MOCK_TRENDS.find((t) => t.id === id)!)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TRENDS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.keyword} — {getPlatformLabel(t.platform)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">ГОРИЗОНТ</label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 дня</SelectItem>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="14">14 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">МОДЕЛЬ</label>
              <Select value={model} onValueChange={(v) => setModel(v as ForecastModel)}>
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODEL_INFO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-violet-500" />
              <span className="text-xs text-muted-foreground font-medium">МОДЕЛЬ</span>
            </div>
            <p className="font-semibold text-sm">{currentModel.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentModel.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground font-medium">ТОЧНОСТЬ МОДЕЛИ</span>
            </div>
            <p className="text-2xl font-bold">{currentModel.accuracy}%</p>
            <Progress value={currentModel.accuracy} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground font-medium">ПРОГНОЗ ЧЕРЕЗ {horizon} ДН.</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(lastPredicted)}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${deltaPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {deltaPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatPercent(deltaPct)} от текущего
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground font-medium">ВЕРОЯТНОСТЬ РОСТА</span>
            </div>
            <p className="text-2xl font-bold">{(growthProb * 100).toFixed(0)}%</p>
            <Progress
              value={growthProb * 100}
              className={`mt-2 h-1.5 ${growthProb >= 0.5 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-red-500'}`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Forecast chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Прогноз: {selectedTrend.keyword}
              </CardTitle>
              <CardDescription>
                Исторические данные + прогноз на {horizon} дней. Серая область — 95% доверительный интервал.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
                Факт
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block border-dashed" />
                Прогноз
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-slate-200 inline-block rounded" />
                Доверит. интервал
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + 'К' : v} width={52} />
              <Tooltip content={<CustomTooltip />} />

              {/* Confidence interval */}
              <Area dataKey="upper" fill="#e2e8f0" stroke="none" name="Верх. граница" />
              <Area dataKey="lower" fill="#ffffff" stroke="none" name="Ниж. граница" />

              {/* Actual values */}
              <Line dataKey="actual" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} name="Факт" connectNulls={false} />

              {/* Predicted */}
              <Line dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 4 }} name="Прогноз" />

              {/* Today line */}
              {todayIndex >= 0 && (
                <ReferenceLine x={chartData[todayIndex - 1]?.dateLabel} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Сегодня', fontSize: 10, fill: '#f59e0b' }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Per-trend forecast summary table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Прогнозы по всем трендам</CardTitle>
          <CardDescription>Ожидаемые изменения через {horizon} дней</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRENDS.map((trend) => {
              const fc = generateForecast(trend, parseInt(horizon))
              const last = trend.timeSeries[trend.timeSeries.length - 1].value
              const pred = fc[fc.length - 1].predicted
              const pct = ((pred - last) / last) * 100
              const gProb = trend.growthRate > 0
                ? Math.min(95, 50 + trend.growthRate / 2)
                : Math.max(5, 50 + trend.growthRate / 2)

              return (
                <div key={trend.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => setSelectedTrend(trend)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{trend.keyword}</span>
                      <Badge variant="outline" className="text-xs">{getPlatformLabel(trend.platform)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Сейчас: {formatNumber(last)}</span>
                      <span>→</span>
                      <span className="font-medium text-foreground">Прогноз: {formatNumber(pred)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <div className={`text-sm font-semibold ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatPercent(pct)}
                    </div>
                    <div className="text-xs text-muted-foreground">Рост: {gProb.toFixed(0)}%</div>
                  </div>
                  <div className="w-24 shrink-0">
                    <Progress
                      value={gProb}
                      className={`h-1.5 ${gProb >= 50 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-red-500'}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
