import { useForm } from 'react-hook-form'
import * as React from 'react'
import { useCreateTransactionMutation, useUpdateTransactionMutation } from '@/store/api/transactionsApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import type { Transaction } from '@/store/api/transactionsApi'
import { formatDateInput } from '@/utils/formatters'

interface TransactionFormProps {
  transaction?: Transaction
  defaultType?: 'income' | 'expense'
  hideType?: boolean
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormData {
  type: 'income' | 'expense'
  amount: string
  description: string
  category: string
  date: string
}

export default function TransactionForm({ transaction, defaultType, hideType = false, onSuccess, onCancel }: TransactionFormProps) {
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation()
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: transaction
      ? {
          type: transaction.type,
          amount: transaction.amount.toString(),
          description: transaction.description || '',
          category: transaction.category,
          date: formatDateInput(transaction.date),
        }
      : {
          type: defaultType || 'expense',
          amount: '',
          description: '',
          category: '',
          date: formatDateInput(new Date()),
        },
  })

  // Reset form when transaction changes
  React.useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description || '',
        category: transaction.category,
        date: formatDateInput(transaction.date),
      })
    } else {
      reset({
        type: defaultType || 'expense',
        amount: '',
        description: '',
        category: '',
        date: formatDateInput(new Date()),
      })
    }
  }, [transaction, defaultType, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        type: data.type,
        amount: parseFloat(data.amount),
        description: data.description || undefined,
        category: data.category,
        date: new Date(data.date).toISOString(),
      }

      if (transaction) {
        await updateTransaction({ id: transaction._id, data: payload }).unwrap()
      } else {
        await createTransaction(payload).unwrap()
        reset({
          type: defaultType || 'expense',
          amount: '',
          description: '',
          category: '',
          date: formatDateInput(new Date()),
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save transaction:', error)
    }
  }

  const commonCategories = [
    'Food',
    'Entertainment',
    'Transport',
    'Shopping',
    'Bills',
    'Salary',
    'Freelance',
    'Investment',
    'Books',
    'Health',
    'Education',
    'Other',
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!hideType && (
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" {...register('type', { required: 'Type is required' })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select id="category" {...register('category', { required: 'Category is required' })}>
          <option value="">Select a category</option>
          {commonCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register('description')} placeholder="Optional description" />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date', { required: 'Date is required' })}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Saving...' : transaction ? 'Update' : 'Create'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

