import type { Transaction } from '@/store/api/transactionsApi'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteTransactionMutation } from '@/store/api/transactionsApi'

interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
}

export default function TransactionItem({ transaction, onEdit }: TransactionItemProps) {
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transaction._id).unwrap()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0">
      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-lg flex items-center justify-center ${
            transaction.type === 'income'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          <span className="text-xl font-bold">
            {transaction.type === 'income' ? '$' : '-'}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.category}</p>
          <p className="text-sm text-gray-500">
            {transaction.description || 'No description'}
          </p>
          <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p
          className={`text-lg font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transaction)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

