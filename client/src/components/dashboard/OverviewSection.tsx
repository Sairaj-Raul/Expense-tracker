import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import CategoryPieChart from './CategoryPieChart'
import IncomeExpenseComparison from './IncomeExpenseComparison'
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'

interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
}

interface OverviewSectionProps {
  total: number
  change: number
  categories: CategoryBreakdown[]
  type: 'income' | 'expense'
  onTypeChange: (type: 'income' | 'expense') => void
  incomeTotal?: number
  expenseTotal?: number
}

type ChartType = 'comparison' | 'pie' | 'list'

export default function OverviewSection({
  total,
  change,
  categories,
  type,
  onTypeChange,
  incomeTotal = 0,
  expenseTotal = 0,
}: OverviewSectionProps) {
  const [chartType, setChartType] = useState<ChartType>('comparison')
  const topCategories = categories.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Brief Overview</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-300 p-1">
              <Button
                variant={chartType === 'comparison' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('comparison')}
                className="h-8 px-2"
                title="Income vs Expense"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('pie')}
                className="h-8 px-2"
                title="Category Pie Chart"
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('list')}
                className="h-8 px-2"
                title="List View"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={type}
              onChange={(e) => onTypeChange(e.target.value as 'income' | 'expense')}
              className="w-32"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === 'comparison' ? (
          <IncomeExpenseComparison income={incomeTotal} expense={expenseTotal} />
        ) : chartType === 'pie' ? (
          <CategoryPieChart categories={categories} type={type} total={total} />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  +{change.toFixed(1)}%
                </span>
                <p className={`text-sm ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  ${Math.abs(total * (change / 100)).toFixed(2)} from the top three {type === 'expense' ? 'expenses' : 'incomes'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {formatCurrency(category.amount)}/{formatCurrency(total)}
                      </span>
                      <span className={`font-semibold ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${type === 'expense' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

