import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Upload, Plus } from 'lucide-react'
import TransactionList from '@/components/transactions/TransactionList'

interface TransactionsHistoryProps {
  onAddTransaction: () => void
}

export default function TransactionsHistory({ onAddTransaction }: TransactionsHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Pdf Download
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={onAddTransaction} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionList />
      </CardContent>
    </Card>
  )
}

