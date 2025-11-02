import { useState, useMemo } from 'react'
import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Plus, Download } from 'lucide-react'
import { exportTransactionsToCSV } from '@/utils/csvExport'
import { useDeleteTransactionMutation } from '@/store/api/transactionsApi'
import TransactionForm from '@/components/transactions/TransactionForm'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'

export default function Due() {
  const { data: allTransactions = [], isLoading } = useGetTransactionsQuery()
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation()
  const [showAddForm, setShowAddForm] = useState(false)
  const globalSearch = useGlobalSearch()

  // Filter expenses with dates greater than today and apply global search
  const dueExpenses = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (allTransactions || []).filter((transaction) => {
      // Must be expense
      if (transaction.type !== 'expense') return false
      
      // Must be future date
      const transactionDate = new Date(transaction.date)
      transactionDate.setHours(0, 0, 0, 0)
      if (transactionDate <= today) return false
      
      // Apply global search if present
      if (globalSearch) {
        const searchLower = globalSearch.toLowerCase()
        const matchesGlobalSearch =
          transaction.category.toLowerCase().includes(searchLower) ||
          (transaction.description || '').toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(searchLower)
        if (!matchesGlobalSearch) return false
      }

      return true
    })
  }, [allTransactions, globalSearch])

  const totalDueAmount = useMemo(() => {
    return dueExpenses.reduce((sum, transaction) => sum + transaction.amount, 0)
  }, [dueExpenses])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this due expense?')) {
      try {
        await deleteTransaction(id).unwrap()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading due expenses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Due Expenses</h1>
          <p className="mt-1 text-gray-600">Expenses scheduled for future dates</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportTransactionsToCSV(dueExpenses, `due_expenses_${new Date().toISOString().split('T')[0]}.csv`)}
            disabled={dueExpenses.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Add Due Expense</h2>
            <TransactionForm
              defaultType="expense"
              hideType={true}
              onSuccess={() => setShowAddForm(false)}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Due Amount</p>
              <p className="mt-1 text-3xl font-bold text-red-600">
                {formatCurrency(totalDueAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Number of Due Expenses</p>
              <p className="mt-1 text-xl font-semibold">{dueExpenses.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Due Expenses Table</CardTitle>
        </CardHeader>
        <CardContent>
          {dueExpenses.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No due expenses found. All expenses are either current or past.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dueExpenses.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <span className="text-sm font-bold">-</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {transaction.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">
                          {formatDate(transaction.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-lg font-semibold text-red-600">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(transaction._id)}
                            disabled={isDeleting}
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

