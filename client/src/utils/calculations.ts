import type { Transaction } from '@/store/api/transactionsApi'
import { format } from 'date-fns'

export interface MonthlyData {
  month: string
  income: number
  expense: number
  savings: number
}

export const calculateTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const savings = income - expense
  const balance = savings

  return { income, expense, savings, balance }
}

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { income: number; expense: number }>()

  transactions.forEach((transaction) => {
    const key = `${format(new Date(transaction.date), 'yyyy-MM')}`

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { income: 0, expense: 0 })
    }

    const data = monthlyMap.get(key)!
    if (transaction.type === 'income') {
      data.income += transaction.amount
    } else {
      data.expense += transaction.amount
    }
  })

  const monthlyData: MonthlyData[] = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentYear = new Date().getFullYear()

  months.forEach((monthName, index) => {
    const key = `${currentYear}-${String(index + 1).padStart(2, '0')}`
    const data = monthlyMap.get(key) || { income: 0, expense: 0 }
    monthlyData.push({
      month: monthName,
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense,
    })
  })

  return monthlyData
}

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const categoryMap = new Map<string, number>()

  transactions.forEach((transaction) => {
    const current = categoryMap.get(transaction.category) || 0
    categoryMap.set(transaction.category, current + transaction.amount)
  })

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export const getPreviousMonthTotal = (transactions: Transaction[], type: 'income' | 'expense'): number => {
  const now = new Date()
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return transactions
    .filter((t) => {
      const transactionDate = new Date(t.date)
      return (
        t.type === type &&
        transactionDate >= previousMonth &&
        transactionDate < currentMonth
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

