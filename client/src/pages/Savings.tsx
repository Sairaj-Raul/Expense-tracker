import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import { calculateTotals, getMonthlyData } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatisticsChart from '@/components/dashboard/StatisticsChart'
import { PiggyBank, TrendingUp, TrendingDown } from 'lucide-react'

export default function Savings() {
  const { data: transactions = [], isLoading } = useGetTransactionsQuery()

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>
  }

  const totals = calculateTotals(transactions)
  const monthlyData = getMonthlyData(transactions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Savings</h1>
        <p className="mt-1 text-gray-600">Track your savings and financial goals</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p
                  className={`mt-1 text-3xl font-bold ${
                    totals.savings >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(totals.savings)}
                </p>
              </div>
              <PiggyBank className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {formatCurrency(totals.income)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {formatCurrency(totals.expense)}
                </p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <StatisticsChart data={monthlyData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Savings Rate</span>
              <span className="text-lg font-semibold">
                {totals.income > 0
                  ? ((totals.savings / totals.income) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full ${
                  totals.savings >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(Math.abs((totals.savings / totals.income) * 100), 100)}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {totals.savings >= 0
                ? 'Great job! You are saving money.'
                : 'You are spending more than you earn. Consider reducing expenses.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

