import { useMemo } from 'react'
import { useGetTransactionsQuery, type Transaction } from '@/store/api/transactionsApi'
import TransactionItem from './TransactionItem'
import { useState } from 'react'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'

export default function TransactionList() {
  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery()
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null)
  const globalSearch = useGlobalSearch()

  // Filter transactions by global search
  const filteredTransactions = useMemo(() => {
    if (!globalSearch) return transactions

    const searchLower = globalSearch.toLowerCase()
    return transactions.filter((transaction) => {
      return (
        transaction.category.toLowerCase().includes(searchLower) ||
        (transaction.description || '').toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower)
      )
    })
  }, [transactions, globalSearch])

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading transactions...</div>
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error loading transactions. Please try again.
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No transactions found. Add your first transaction to get started!
      </div>
    )
  }

  if (filteredTransactions.length === 0 && globalSearch) {
    return (
      <div className="py-8 text-center text-gray-500">
        No transactions match your search "{globalSearch}".
      </div>
    )
  }

  const handleEdit = (transaction: Transaction) => {
    if (editingTransaction === null) {
      setEditingTransaction(transaction._id)
    }
  }

  return (
    <div className="space-y-2">
      {filteredTransactions.map((transaction) => (
        <TransactionItem
          key={transaction._id}
          transaction={transaction}
          onEdit={editingTransaction === null ? handleEdit : undefined}
        />
      ))}
    </div>
  )
}

