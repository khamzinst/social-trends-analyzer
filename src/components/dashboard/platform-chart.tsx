'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'

interface PlatformData {
  platform: string
  count: number
  color: string
}

interface Props {
  data: PlatformData[]
}

const COLORS = ['#6366f1', '#E1306C', '#1DA1F2', '#0077FF', '#FF0000', '#10b981']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-semibold">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">{formatNumber(payload[0].value)} упоминаний</p>
    </div>
  )
}

export function PlatformChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">По платформам</CardTitle>
        <CardDescription>Распределение активности</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              nameKey="platform"
            >
              {data.map((entry, index) => (
                <Cell key={entry.platform} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
