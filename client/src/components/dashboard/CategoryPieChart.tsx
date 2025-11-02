import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import { Button } from '@/components/ui/button'

interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
}

interface CategoryPieChartProps {
  categories: CategoryBreakdown[]
  type: 'income' | 'expense'
  total: number
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
]

export default function CategoryPieChart({
  categories,
  type,
  total,
}: CategoryPieChartProps) {
  const [showAll, setShowAll] = useState(false)

  // Show top 8 categories by default, or all if toggled
  const displayCategories = showAll
    ? categories
    : categories.slice(0, 8)

  const chartData = displayCategories.map((cat) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    // Only show label if percentage is >= 5%
    if (percent < 0.05) return ''
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        {categories.length > 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </Button>
        )}
      </div>
      {categories.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-500">
          No {type} data available
        </div>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
            <p className="text-sm text-gray-600">Total {type === 'income' ? 'Income' : 'Expenses'}</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-lg border p-2 text-xs"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1 truncate">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-600">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

