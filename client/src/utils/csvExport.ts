import type { Transaction } from '@/store/api/transactionsApi'
import { formatDate } from './formatters'

/**
 * Convert transactions array to CSV string
 */
export const transactionsToCSV = (transactions: Transaction[]): string => {
  if (transactions.length === 0) {
    return 'No transactions to export'
  }

  // CSV Headers
  const headers = [
    'Date',
    'Type',
    'Category',
    'Description',
    'Amount',
    'Created At',
  ]

  // Convert transactions to CSV rows
  const rows = transactions.map((transaction) => {
    return [
      formatDate(transaction.date),
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      transaction.category,
      transaction.description || '',
      transaction.amount.toString(),
      transaction.createdAt ? formatDate(transaction.createdAt) : '',
    ]
  })

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: string | number): string => {
    const str = String(value)
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n')

  return csvContent
}

/**
 * Download transactions as CSV file
 */
export const exportTransactionsToCSV = (
  transactions: Transaction[],
  filename?: string
): void => {
  const csvContent = transactionsToCSV(transactions)

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename || `transactions_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}

