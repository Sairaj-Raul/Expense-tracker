import { useState, useMemo } from "react";
import { useGetTransactionsQuery } from "@/store/api/transactionsApi";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionFilters, {
  type FilterState,
} from "@/components/transactions/TransactionFilters";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { exportTransactionsToCSV } from "@/utils/csvExport";
import type { Transaction } from "@/store/api/transactionsApi";
import { useDeleteTransactionMutation } from "@/store/api/transactionsApi";
import { calculateTotals } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export default function Expense() {
  const { data: expenseTransactions = [] } = useGetTransactionsQuery({
    type: "expense",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteTransaction] = useDeleteTransactionMutation();
  const globalSearch = useGlobalSearch();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    description: "",
    dateFrom: "",
    dateTo: "",
    amountOperator: "",
    amountValue: "",
  });

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    return Array.from(
      new Set(expenseTransactions.map((t) => t.category))
    ).sort();
  }, [expenseTransactions]);

  // Filter transactions based on filter state and global search
  const filteredTransactions = useMemo(() => {
    return expenseTransactions.filter((transaction) => {
      // Global search filter (searches category, description, amount)
      if (globalSearch) {
        const searchLower = globalSearch.toLowerCase();
        const matchesGlobalSearch =
          transaction.category.toLowerCase().includes(searchLower) ||
          (transaction.description || "").toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(searchLower);
        if (!matchesGlobalSearch) return false;
      }

      // Local search filter (category or description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          transaction.category.toLowerCase().includes(searchLower) ||
          (transaction.description || "").toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Description filter
      if (filters.description) {
        const descLower = (transaction.description || "").toLowerCase();
        if (!descLower.includes(filters.description.toLowerCase())) {
          return false;
        }
      }

      // Date range filter
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);

      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        dateFrom.setHours(0, 0, 0, 0);
        if (transactionDate < dateFrom) return false;
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        if (transactionDate > dateTo) return false;
      }

      // Amount filter
      if (filters.amountOperator && filters.amountValue) {
        const amountValue = parseFloat(filters.amountValue);
        if (isNaN(amountValue)) return true;

        switch (filters.amountOperator) {
          case "gt":
            if (transaction.amount <= amountValue) return false;
            break;
          case "lt":
            if (transaction.amount >= amountValue) return false;
            break;
          case "eq":
            if (Math.abs(transaction.amount - amountValue) > 0.01) return false;
            break;
        }
      }

      return true;
    });
  }, [expenseTransactions, filters, globalSearch]);

  const totals = calculateTotals(filteredTransactions);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id).unwrap();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense</h1>
          <p className="mt-1 text-gray-600">Manage your expense transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              exportTransactionsToCSV(
                filteredTransactions,
                `expense_${new Date().toISOString().split("T")[0]}.csv`
              )
            }
            disabled={filteredTransactions.length === 0}
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

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="mt-1 text-3xl font-bold text-red-600">
                {formatCurrency(totals.expense)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="mt-1 text-xl font-semibold">
                {filteredTransactions.length}
                {filteredTransactions.length !== expenseTransactions.length && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    of {expenseTransactions.length}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(showAddForm || editingTransaction) && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {editingTransaction
                ? "Edit Expense Transaction"
                : "Add Expense Transaction"}
            </h2>
            <TransactionForm
              transaction={editingTransaction || undefined}
              defaultType="expense"
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Expense Transactions</h2>

          <TransactionFilters
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />

          <div className="mt-4">
            {filteredTransactions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {expenseTransactions.length === 0
                  ? "No expense transactions found."
                  : "No transactions match your filters."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between border-b py-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <span className="text-xl font-bold">-</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.description || "No description"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction._id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
