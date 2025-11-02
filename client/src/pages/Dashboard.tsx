import { useState } from 'react'
import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import SummaryCards from '@/components/dashboard/SummaryCards'
import StatisticsChart from '@/components/dashboard/StatisticsChart'
import OverviewSection from '@/components/dashboard/OverviewSection'
import TransactionsHistory from '@/components/dashboard/TransactionsHistory'
import TransactionForm from '@/components/transactions/TransactionForm'
import {
  calculateTotals,
  getMonthlyData,
  getCategoryBreakdown,
  getPreviousMonthTotal,
  calculatePercentageChange,
} from '@/utils/calculations'

export default function Dashboard() {
  const { data: transactions = [], isLoading } = useGetTransactionsQuery()
  const [showAddForm, setShowAddForm] = useState(false)
  const [overviewType, setOverviewType] = useState<'income' | 'expense'>('expense')

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>
  }

  const totals = calculateTotals(transactions)
  const monthlyData = getMonthlyData(transactions)

  // Calculate percentage changes
  const previousIncome = getPreviousMonthTotal(transactions, 'income')
  const previousExpense = getPreviousMonthTotal(transactions, 'expense')
  const currentIncome = totals.income
  const currentExpense = totals.expense

  const incomeChange = calculatePercentageChange(currentIncome, previousIncome)
  const expenseChange = calculatePercentageChange(currentExpense, previousExpense)
  const savingsChange = calculatePercentageChange(
    totals.savings,
    previousIncome - previousExpense
  )

  // Get category breakdown for overview
  const filteredTransactions = transactions.filter((t) => t.type === overviewType)
  const categoryBreakdown = getCategoryBreakdown(filteredTransactions)
  const totalForType = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const categoriesWithPercentage = categoryBreakdown.map((cat) => ({
    ...cat,
    percentage: (cat.amount / totalForType) * 100,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">An overview of the entire accounting System</p>
      </div>

      {showAddForm && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Add Transaction</h2>
          <TransactionForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <SummaryCards
        income={totals.income}
        expense={totals.expense}
        savings={totals.savings}
        balance={totals.balance}
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        savingsChange={savingsChange}
        balanceChange={savingsChange}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatisticsChart data={monthlyData} />
        <OverviewSection
          total={totalForType}
          change={overviewType === 'income' ? incomeChange : expenseChange}
          categories={categoriesWithPercentage}
          type={overviewType}
          onTypeChange={setOverviewType}
          incomeTotal={totals.income}
          expenseTotal={totals.expense}
        />
      </div>

      <TransactionsHistory onAddTransaction={() => setShowAddForm(!showAddForm)} />
    </div>
  )
}

