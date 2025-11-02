import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/utils/formatters'

interface IncomeExpenseComparisonProps {
  income: number
  expense: number
}

const COLORS = {
  income: '#10b981', // green
  expense: '#ef4444', // red
}

export default function IncomeExpenseComparison({
  income,
  expense,
}: IncomeExpenseComparisonProps) {
  const total = income + expense
  const savings = income - expense
  const incomePercentage = total > 0 ? (income / total) * 100 : 0
  const expensePercentage = total > 0 ? (expense / total) * 100 : 0

  const data = [
    {
      name: 'Income',
      value: income,
      percentage: incomePercentage,
      color: COLORS.income,
    },
    {
      name: 'Expense',
      value: expense,
      percentage: expensePercentage,
      color: COLORS.expense,
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
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
    outerRadius,
    payload,
  }: any) => {
    const RADIAN = Math.PI / 180
    
    // Position all labels outside the chart for consistent visibility
    const labelRadius = outerRadius + 25
    
    // Calculate position
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN)
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN)
    
    // Determine text anchor - always center for better visibility
    const textAnchor = 'middle'
    
    // Use the actual percentage from payload data for accuracy
    const displayPercent = payload.percentage.toFixed(1)
    
    // Use shorter label format
    const labelText = `${displayPercent}%`

    return (
      <text
        x={x}
        y={y}
        fill={payload.color}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
        style={{
          pointerEvents: 'none',
        }}
      >
        {labelText}
      </text>
    )
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {formatCurrency(income)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Expense</p>
          <p className="mt-1 text-xl font-bold text-red-600">
            {formatCurrency(expense)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Net Savings</p>
          <p
            className={`mt-1 text-xl font-bold ${
              savings >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(savings)}
          </p>
        </div>
      </div>

      {total === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                label={renderCustomLabel}
                outerRadius={110}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color, marginLeft: '8px' }}>
                    {value}: {formatCurrency(entry.payload.value)} (
                    {entry.payload.percentage.toFixed(1)}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
                <span className="font-semibold text-gray-900">Income</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatCurrency(income)}
              </p>
              <p className="text-sm text-gray-600">
                {incomePercentage.toFixed(1)}% of total
              </p>
            </div>
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-600"></div>
                <span className="font-semibold text-gray-900">Expense</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(expense)}
              </p>
              <p className="text-sm text-gray-600">
                {expensePercentage.toFixed(1)}% of total
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

