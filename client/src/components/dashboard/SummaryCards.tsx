import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, ShoppingCart, PiggyBank, Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

interface SummaryCardsProps {
  income: number
  expense: number
  savings: number
  balance: number
  incomeChange?: number
  expenseChange?: number
  savingsChange?: number
  balanceChange?: number
}

export default function SummaryCards({
  income,
  expense,
  savings,
  balance,
  incomeChange = 10,
  expenseChange = 10,
  savingsChange = 10,
  balanceChange = 10,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Income',
      value: income,
      change: incomeChange,
      icon: DollarSign,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      changeColor: 'text-green-600',
      suffix: 'than last month',
    },
    {
      title: 'Expense',
      value: expense,
      change: expenseChange,
      icon: ShoppingCart,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      changeColor: 'text-red-600',
      suffix: 'than last month',
    },
    {
      title: 'Savings',
      value: savings,
      change: savingsChange,
      icon: PiggyBank,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      changeColor: 'text-yellow-600',
      suffix: 'than last month',
    },
    {
      title: 'Balance',
      value: balance,
      change: balanceChange,
      icon: Wallet,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      changeColor: 'text-blue-600',
      suffix: 'than last month',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg ${card.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${card.changeColor} bg-opacity-10`}
                >
                  +{card.change.toFixed(1)}%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(card.value)}
                </p>
                <p className={`mt-1 text-xs ${card.changeColor}`}>
                  ${Math.abs(card.value * (card.change / 100)).toFixed(2)} {card.suffix}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

